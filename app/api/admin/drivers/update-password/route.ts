import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  initializeApp({
    credential: cert(serviceAccount),
  });
}

const auth = getAuth();
const db = getFirestore();

export async function POST(request: NextRequest) {
  try {
    const { driverId, newPassword, adminToken } = await request.json();

    // Validate inputs
    if (!driverId || !newPassword) {
      return NextResponse.json(
        { error: 'Driver ID and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Verify admin is authenticated (using the provided token)
    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No admin token provided' },
        { status: 401 }
      );
    }

    try {
      // Verify the admin token
      const decodedToken = await auth.verifyIdToken(adminToken);
      if (!decodedToken) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid admin token' },
          { status: 401 }
        );
      }

      // Check if user is admin (you can add admin role check here)
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      const userData = userDoc.data();
      
      // Optional: Check if user has admin role
      // if (!userData?.isAdmin) {
      //   return NextResponse.json(
      //     { error: 'Unauthorized - Admin privileges required' },
      //     { status: 403 }
      //   );
      // }
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Get the driver document to find the authUserId
    const driverRef = db.collection('drivers').doc(driverId);
    const driverDoc = await driverRef.get();
    
    if (!driverDoc.exists) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    const driverData = driverDoc.data();
    const authUserId = driverData?.authUserId || driverData?.userId;

    if (!authUserId) {
      return NextResponse.json(
        { error: 'Driver does not have an authentication account. Please create one first.' },
        { status: 400 }
      );
    }

    try {
      // Update the user's password in Firebase Auth using Admin SDK
      await auth.updateUser(authUserId, {
        password: newPassword,
      });

      // Update the driver document with password metadata
      await driverRef.update({
        hasPasswordSet: true,
        passwordUpdatedAt: new Date().toISOString(),
        needsPasswordReset: false,
        lastPasswordUpdate: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully',
        authUserId: authUserId,
      });
    } catch (authError: any) {
      console.error('Auth update error:', authError);
      
      if (authError.code === 'auth/user-not-found') {
        return NextResponse.json(
          { error: 'Driver authentication account not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: authError.message || 'Failed to update password in authentication' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}