'use client';

import { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../../lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface DailyActivity {
  id: string;
  driverId: string;
  driverCode?: string;
  driverName: string;
  numberPlate?: string;
  date: string;
  isOnline: boolean;
  status: string;
  isAvailable: boolean;
  onlineStart?: any;
  offlineStart?: any;
  lastOnlineTime?: any;
  lastOfflineTime?: any;
  totalMinutes?: number;
  totalOfflineMinutes?: number;
  lastAccumulatedAt?: any;
  onlineSessions?: number;
  offlineSessions?: number;
  totalSwitches?: number;
  onlineHistory?: any[];
  offlineHistory?: any[];
  fuelAvailable?: string;
  hasFuel?: boolean;
  remainingFuel?: {
    Petrol: number;
    Diesel: number;
    Kerosene: number;
    'V-Power': number;
  };
  fuelUpdatedAt?: any;
  latitude?: number;
  longitude?: number;
  speed?: number;
  heading?: number;
  locationHistory?: any[];
  activeOrderId?: string | null;
  orderStartedAt?: any | null;
  currentClientName?: string | null;
  currentClientPhone?: string | null;
  currentClientLocation?: string | null;
  totalOrdersCompleted?: number;
  totalRevenueToday?: number;
  averageSessionDuration?: number;
  longestOnlineSession?: number;
  longestOfflineSession?: number;
  totalOnlineTimeToday?: number;
  totalOfflineTimeToday?: number;
  efficiency?: number;
  _refreshToken?: string;
  _forceRefresh?: any;
  _lastSync?: any;
  _adminCreated?: boolean;
  _createdBy?: string;
  _createdAt?: any;
  createdAt?: any;
  updatedAt?: any;
  dateOnly?: string;
  weekDay?: string;
  monthName?: string;
  year?: number;
  weekNumber?: number;
  lastUpdated?: any;
  _calculatedHours?: number;
  _calculatedMinutes?: number;
}

export default function DailyActivityPage() {
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'hours' | 'name' | 'offline'>('hours');
  const [indexError, setIndexError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [userBackground, setUserBackground] = useState('white');
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  const isMountedRef = useRef(true);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const driverUnsubscribeRef = useRef<(() => void) | null>(null);
  
  // Track which drivers are currently being processed to prevent concurrent updates
  const processingDrivers = useRef<Set<string>>(new Set());

  const DRIVER_CODE_PREFIX = 'EGD';

  const createDriverCode = (number: number): string => {
    return `${DRIVER_CODE_PREFIX}-${String(number).padStart(5, '0')}`;
  };

  const getExistingDriverCode = (driverData: any): string | null => {
    const possibleCode =
      driverData?.driverCode ||
      driverData?.customDriverId ||
      driverData?.driverNumber;

    if (
      typeof possibleCode === 'string' &&
      possibleCode.trim().length > 0
    ) {
      return possibleCode.trim();
    }

    return null;
  };

  const ensureDriverCode = async (
    driverId: string,
    driverData: any,
    retryCount: number = 0
  ): Promise<string> => {
    const existingCode = getExistingDriverCode(driverData);

    if (existingCode) {
      return existingCode;
    }

    const driverRef = doc(db, 'drivers', driverId);
    const sequenceRef = doc(db, 'systemSequences', 'driverCodes');

    try {
      const assignedCode = await runTransaction(
        db,
        async (transaction) => {
          const currentDriverSnapshot = await transaction.get(driverRef);
          const currentDriverData = currentDriverSnapshot.exists()
            ? currentDriverSnapshot.data()
            : {};

          const codeAlreadyExists = getExistingDriverCode(currentDriverData);

          if (codeAlreadyExists) {
            return codeAlreadyExists;
          }

          const sequenceSnapshot = await transaction.get(sequenceRef);
          let nextNumber = 1;

          if (sequenceSnapshot.exists()) {
            const sequenceData = sequenceSnapshot.data();
            if (
              typeof sequenceData.nextNumber === 'number' &&
              sequenceData.nextNumber > 0
            ) {
              nextNumber = sequenceData.nextNumber;
            }
          }

          const newDriverCode = createDriverCode(nextNumber);

          transaction.set(
            driverRef,
            {
              driverCode: newDriverCode,
              driverCodeCreatedAt: serverTimestamp(),
            },
            { merge: true }
          );

          transaction.set(
            sequenceRef,
            {
              nextNumber: nextNumber + 1,
              lastAssignedCode: newDriverCode,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );

          return newDriverCode;
        }
      );

      return assignedCode;
    } catch (error: any) {
      if (
        error.code === 'failed-precondition' &&
        retryCount < 3
      ) {
        console.log(`Retrying ensureDriverCode (attempt ${retryCount + 1})...`);
        await new Promise(resolve => setTimeout(resolve, 100 * (retryCount + 1)));
        return ensureDriverCode(driverId, driverData, retryCount + 1);
      }

      console.error('Error creating public driver code:', error);
      return 'PENDING';
    }
  };

  useEffect(() => {
    const fetchUserBackground = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.background) {
            setUserBackground(data.background);
          }
        }
      } catch (error) {
        console.error('Error fetching user background:', error);
      }
    };

    fetchUserBackground();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isMountedRef.current) {
        setCurrentTime(new Date());
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getBackgroundClass = () => {
    switch (userBackground) {
      case 'dark':
        return 'bg-gray-900 text-white min-h-screen';
      case 'skyblue':
        return 'bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen';
      case 'gray':
        return 'bg-gray-200 min-h-screen';
      default:
        return 'bg-gray-100 min-h-screen';
    }
  };

  const getCardClass = () => {
    switch (userBackground) {
      case 'dark':
        return 'bg-gray-800/95 border-gray-700 text-white';
      case 'skyblue':
        return 'bg-white/90 backdrop-blur-sm shadow-lg';
      case 'gray':
        return 'bg-white shadow-lg';
      default:
        return 'bg-white shadow-lg';
    }
  };

  const getTimestamp = (value: any): Date | null => {
    if (!value) return null;
    try {
      if (value.toDate) {
        return value.toDate();
      }
      return new Date(value);
    } catch {
      return null;
    }
  };

  const getServerTimestamp = () => {
    return serverTimestamp();
  };

  const calculateDriverHours = (
    activity: DailyActivity
  ): { hours: number; minutes: number } => {
    let totalMinutes = Math.max(0, activity.totalMinutes || 0);
    const now = currentTime;

    try {
      if (activity.isOnline) {
        const checkpoint = getTimestamp(activity.lastAccumulatedAt);
        const start = checkpoint || getTimestamp(activity.onlineStart);
        if (start) {
          const diffMs = now.getTime() - start.getTime();
          if (diffMs > 0) {
            totalMinutes += Math.floor(diffMs / 60000);
          }
        }
      }

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return { hours, minutes };
    } catch (error) {
      console.error('Error calculating driver hours:', error);
      return { hours: 0, minutes: 0 };
    }
  };

  const calculateOfflineDuration = (
    activity: DailyActivity
  ): string => {
    let totalOfflineMinutes = Math.max(0, activity.totalOfflineMinutes || 0);
    const now = currentTime;

    try {
      if (!activity.isOnline) {
        const checkpoint = getTimestamp(activity.lastAccumulatedAt);
        const offlineStart = getTimestamp(activity.offlineStart);
        const start = checkpoint || offlineStart;

        if (start) {
          const diffMs = now.getTime() - start.getTime();
          if (diffMs > 0) {
            const additionalMinutes = Math.floor(diffMs / 60000);
            totalOfflineMinutes += additionalMinutes;
          }
        }
      }

      const hours = Math.floor(totalOfflineMinutes / 60);
      const minutes = totalOfflineMinutes % 60;

      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    } catch (error) {
      console.error('Error calculating offline duration:', error);
      return '0h 0m';
    }
  };

  const getCurrentDuration = (
    activity: DailyActivity
  ): string => {
    const now = currentTime;

    if (activity.isOnline) {
      const start = getTimestamp(activity.onlineStart);
      if (!start) return 'N/A';
      const diffMs = now.getTime() - start.getTime();
      if (diffMs < 0) return 'N/A';
      const diffMins = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const minutes = diffMins % 60;
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    } else {
      const start = getTimestamp(activity.offlineStart);
      if (!start) return 'N/A';
      const diffMs = now.getTime() - start.getTime();
      if (diffMs < 0) return 'N/A';
      const diffMins = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const minutes = diffMins % 60;
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    }
  };

  const getDriverStatusStart = (
    driverData: any,
    isOnline: boolean,
    fallback: Date,
    todayStr: string
  ): Date => {
    const candidates = isOnline
      ? [
        driverData?.onlineSince,
        driverData?.onlineStart,
        driverData?.lastOnlineTime,
        driverData?.statusChangedAt,
      ]
      : [
        driverData?.offlineSince,
        driverData?.offlineStart,
        driverData?.lastOfflineTime,
        driverData?.statusChangedAt,
      ];

    for (const candidate of candidates) {
      const parsed = getTimestamp(candidate);
      if (
        parsed &&
        parsed.getTime() <= fallback.getTime() &&
        parsed.toISOString().split('T')[0] === todayStr
      ) {
        return parsed;
      }
    }

    return fallback;
  };

  const getMidnightToday = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  };

  const accumulateCurrentSession = (
    current: any,
    isOnline: boolean,
    now: Date,
    updateData: any
  ) => {
    const currentTotalOnline = Math.max(0, current.totalMinutes || 0);
    const currentTotalOffline = Math.max(0, current.totalOfflineMinutes || 0);
    const checkpoint = getTimestamp(current.lastAccumulatedAt);

    const fallbackStart = isOnline
      ? getTimestamp(current.onlineStart)
      : getTimestamp(current.offlineStart);

    const start = checkpoint || fallbackStart;

    if (!start) {
      updateData.totalMinutes = currentTotalOnline;
      updateData.totalOfflineMinutes = currentTotalOffline;
      updateData.lastAccumulatedAt = serverTimestamp();
      return;
    }

    const diffMs = now.getTime() - start.getTime();
    const elapsedMinutes = diffMs > 0 ? Math.floor(diffMs / 60000) : 0;

    if (isOnline) {
      updateData.totalMinutes = currentTotalOnline + elapsedMinutes;
      updateData.totalOfflineMinutes = currentTotalOffline;
    } else {
      updateData.totalMinutes = currentTotalOnline;
      updateData.totalOfflineMinutes = currentTotalOffline + elapsedMinutes;
    }

    updateData.lastAccumulatedAt = serverTimestamp();
  };

  // ============================================================
  // FIXED: processDriverTransaction with server timestamps
  // ============================================================
  const processDriverTransaction = async (
    driverId: string,
    driverData: any,
    isOnline: boolean,
    todayStr: string,
    now: Date,
    retryCount: number = 0
  ): Promise<void> => {
    // Prevent concurrent processing of the same driver
    if (processingDrivers.current.has(driverId)) {
      return;
    }

    processingDrivers.current.add(driverId);

    const activityDocId = `${driverId}_${todayStr}`;
    const activityRef = doc(db, 'driverDailyActivity', activityDocId);
    const driverRef = doc(db, 'drivers', driverId);

    try {
      // Read current state first
      const [activityDoc, driverSnapshot] = await Promise.all([
        getDoc(activityRef),
        getDoc(driverRef)
      ]);

      const activityData = activityDoc.exists() ? activityDoc.data() : null;
      const latestDriverData = driverSnapshot.exists() ? driverSnapshot.data() : {};

      // If driver doesn't exist, skip
      if (!driverSnapshot.exists()) {
        return;
      }

      const driverCode = getExistingDriverCode(latestDriverData) || 'PENDING';

      const updateData: any = {
        driverId,
        driverCode,
        driverName: latestDriverData.name || driverData.name || 'Unknown',
        numberPlate: latestDriverData.numberPlate || driverData.numberPlate || '',
        date: todayStr,
        isOnline,
        status: latestDriverData.status || driverData.status || 'offline',
        isAvailable: latestDriverData.isAvailable ?? driverData.isAvailable ?? false,
        lastUpdated: serverTimestamp(),
      };

      for (const key of ['latitude', 'longitude', 'speed', 'heading']) {
        if (latestDriverData[key] !== undefined && latestDriverData[key] !== null) {
          updateData[key] = latestDriverData[key];
        } else if (driverData[key] !== undefined && driverData[key] !== null) {
          updateData[key] = driverData[key];
        }
      }

      const fuelSource = latestDriverData.remainingFuel
        ? latestDriverData
        : driverData;
      if (fuelSource.remainingFuel) updateData.remainingFuel = fuelSource.remainingFuel;
      if (fuelSource.fuelAvailable) updateData.fuelAvailable = fuelSource.fuelAvailable;
      if (fuelSource.hasFuel !== undefined && fuelSource.hasFuel !== null) {
        updateData.hasFuel = fuelSource.hasFuel;
      }

      if (!activityData) {
        // First observation of this driver for today
        const statusStart = getDriverStatusStart(latestDriverData, isOnline, now, todayStr);
        const midnight = getMidnightToday(todayStr);

        let elapsedMinutesFromMidnight = 0;
        
        if (statusStart <= midnight) {
          const diffMs = now.getTime() - midnight.getTime();
          elapsedMinutesFromMidnight = diffMs > 0 ? Math.floor(diffMs / 60000) : 0;
        } else {
          const diffMs = now.getTime() - statusStart.getTime();
          elapsedMinutesFromMidnight = diffMs > 0 ? Math.floor(diffMs / 60000) : 0;
        }

        updateData.onlineSessions = isOnline ? 1 : 0;
        updateData.offlineSessions = isOnline ? 0 : 1;
        updateData.totalSwitches = 0;
        updateData.totalMinutes = 0;
        updateData.totalOfflineMinutes = 0;
        updateData.createdAt = serverTimestamp();

        if (isOnline) {
          updateData.onlineStart = serverTimestamp();
          updateData.lastOnlineTime = serverTimestamp();
          updateData.offlineStart = null;
          updateData.totalMinutes = elapsedMinutesFromMidnight;
          updateData.totalOfflineMinutes = 0;
        } else {
          updateData.offlineStart = serverTimestamp();
          updateData.lastOfflineTime = serverTimestamp();
          updateData.onlineStart = null;
          updateData.totalMinutes = 0;
          updateData.totalOfflineMinutes = elapsedMinutesFromMidnight;
        }

        updateData.lastAccumulatedAt = serverTimestamp();
        
        // Use set with merge - no transaction needed
        await setDoc(activityRef, updateData, { merge: true });
        
        if (isMountedRef.current) {
          setLastSyncTime(new Date());
          setLastRefreshTime(new Date());
        }
        return;
      }

      const current = activityData;
      const statusChanged = Boolean(current.isOnline) !== Boolean(isOnline);

      if (statusChanged) {
        if (isOnline) {
          // OFFLINE -> ONLINE: Close offline session
          const offlineStart = getTimestamp(current.offlineStart);
          const offlineCheckpoint = getTimestamp(current.lastAccumulatedAt);
          const offlineBase = offlineCheckpoint || offlineStart;
          let offlineMinutes = current.totalOfflineMinutes || 0;

          if (offlineBase) {
            const diffMs = now.getTime() - offlineBase.getTime();
            if (diffMs > 0) offlineMinutes += Math.floor(diffMs / 60000);
          }

          updateData.totalMinutes = current.totalMinutes || 0;
          updateData.totalOfflineMinutes = offlineMinutes;
          updateData.onlineStart = serverTimestamp();
          updateData.lastOnlineTime = serverTimestamp();
          updateData.offlineStart = null;
          updateData.lastAccumulatedAt = serverTimestamp();
          updateData.onlineSessions = (current.onlineSessions || 0) + 1;
          updateData.offlineSessions = current.offlineSessions || 0;
          updateData.totalSwitches = (current.totalSwitches || 0) + 1;
        } else {
          // ONLINE -> OFFLINE: Close online session
          const onlineStart = getTimestamp(current.onlineStart);
          const onlineCheckpoint = getTimestamp(current.lastAccumulatedAt);
          const onlineBase = onlineCheckpoint || onlineStart;
          let onlineMinutes = current.totalMinutes || 0;

          if (onlineBase) {
            const diffMs = now.getTime() - onlineBase.getTime();
            if (diffMs > 0) onlineMinutes += Math.floor(diffMs / 60000);
          }

          updateData.totalMinutes = onlineMinutes;
          updateData.totalOfflineMinutes = current.totalOfflineMinutes || 0;
          updateData.offlineStart = serverTimestamp();
          updateData.lastOfflineTime = serverTimestamp();
          updateData.onlineStart = null;
          updateData.lastAccumulatedAt = serverTimestamp();
          updateData.offlineSessions = (current.offlineSessions || 0) + 1;
          updateData.onlineSessions = current.onlineSessions || 0;
          updateData.totalSwitches = (current.totalSwitches || 0) + 1;
        }
      } else {
        // Status unchanged - just accumulate minutes since last checkpoint
        updateData.onlineStart = current.onlineStart;
        updateData.offlineStart = current.offlineStart;
        updateData.lastOnlineTime = current.lastOnlineTime;
        updateData.lastOfflineTime = current.lastOfflineTime;
        updateData.onlineSessions = current.onlineSessions || 0;
        updateData.offlineSessions = current.offlineSessions || 0;
        updateData.totalSwitches = current.totalSwitches || 0;
        
        // Accumulate current session minutes
        const checkpoint = getTimestamp(current.lastAccumulatedAt);
        const fallbackStart = isOnline
          ? getTimestamp(current.onlineStart)
          : getTimestamp(current.offlineStart);
        const start = checkpoint || fallbackStart;

        let totalOnline = current.totalMinutes || 0;
        let totalOffline = current.totalOfflineMinutes || 0;

        if (start) {
          const diffMs = now.getTime() - start.getTime();
          const elapsedMinutes = diffMs > 0 ? Math.floor(diffMs / 60000) : 0;

          if (isOnline) {
            totalOnline += elapsedMinutes;
          } else {
            totalOffline += elapsedMinutes;
          }
        }

        updateData.totalMinutes = totalOnline;
        updateData.totalOfflineMinutes = totalOffline;
        updateData.lastAccumulatedAt = serverTimestamp();
      }

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) delete updateData[key];
      });

      // Use set with merge - no transaction needed
      await setDoc(activityRef, updateData, { merge: true });

      if (isMountedRef.current) {
        setLastSyncTime(new Date());
        setLastRefreshTime(new Date());
      }
    } catch (error: any) {
      // Only log actual errors (not conflicts since we're not using transactions anymore)
      if (error.code === 'unavailable' && isMountedRef.current) {
        console.warn('Firestore connection dropped. Will retry on next cycle.');
        return;
      }

      console.error('Error updating driver activity for:', driverId, error);
    } finally {
      processingDrivers.current.delete(driverId);
    }
  };

  const setupDriverStatusListener = () => {
    if (driverUnsubscribeRef.current) {
      driverUnsubscribeRef.current();
      driverUnsubscribeRef.current = null;
    }

    const driversQuery = collection(db, 'drivers');

    const processAllDrivers = async (snapshot: any) => {
      if (!isMountedRef.current) return;

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      if (selectedDate !== todayStr) return;

      const driverDocs = snapshot.docs;
      const concurrencyLimit = 3;
      const driversToProcess = driverDocs.filter((doc: any) => {
        const driverData = doc.data();
        return driverData.name && !processingDrivers.current.has(doc.id);
      });
      
      for (let i = 0; i < driversToProcess.length; i += concurrencyLimit) {
        const batch = driversToProcess.slice(i, i + concurrencyLimit);
        await Promise.allSettled(
          batch.map(async (driverDoc: any) => {
            if (!isMountedRef.current) return;

            const driverData = driverDoc.data();
            const driverId = driverDoc.id;
            if (!driverData.name) return;

            const isOnline = Boolean(driverData.isOnline ?? false);

            try {
              await ensureDriverCode(driverId, driverData);
            } catch (error) {
              console.error('Error ensuring driver code:', error);
            }

            await processDriverTransaction(
              driverId,
              driverData,
              isOnline,
              todayStr,
              now
            );
          })
        );
      }
    };

    driverUnsubscribeRef.current = onSnapshot(
      driversQuery,
      async (snapshot) => {
        await processAllDrivers(snapshot);
      },
      (error) => {
        console.error('Error listening to driver status changes:', error);
      }
    );

    const intervalId = window.setInterval(async () => {
      try {
        if (!isMountedRef.current || selectedDate !== new Date().toISOString().split('T')[0]) return;
        const snapshot = await getDocs(driversQuery);
        await processAllDrivers(snapshot);
      } catch (error) {
        console.error('Error during daily driver reconciliation:', error);
      }
    }, 120000);

    const originalUnsubscribe = driverUnsubscribeRef.current;
    driverUnsubscribeRef.current = () => {
      originalUnsubscribe?.();
      window.clearInterval(intervalId);
    };
  };

  const setupListener = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!selectedDate) return;

    const q = query(
      collection(db, 'driverDailyActivity'),
      where('date', '==', selectedDate)
    );

    unsubscribeRef.current = onSnapshot(
      q,
      async (snapshot) => {
        if (!isMountedRef.current) return;

        let validDriverIds = new Set<string>();

        try {
          const driversSnapshot = await getDocs(collection(db, 'drivers'));
          driversSnapshot.docs.forEach((driverDoc) => {
            validDriverIds.add(driverDoc.id);
          });
        } catch (error) {
          console.error('Error fetching drivers for validation:', error);
          validDriverIds = new Set();
        }

        const activitiesData = snapshot.docs.map((activityDoc) => {
          const data = activityDoc.data();
          const driverId = data.driverId || activityDoc.id.split('_')[0];

          return {
            id: activityDoc.id,
            ...data,
            driverId: driverId,
            driverCode: data.driverCode || 'PENDING',
            isOnline: data.isOnline ?? false,
            isAvailable: data.isAvailable ?? false,
            totalMinutes: data.totalMinutes || 0,
            totalOfflineMinutes: data.totalOfflineMinutes || 0,
            lastAccumulatedAt: data.lastAccumulatedAt || null,
          };
        }) as DailyActivity[];

        let filteredActivitiesData = activitiesData;

        if (validDriverIds.size > 0) {
          filteredActivitiesData = activitiesData.filter((activity) => {
            const extractedDriverId = activity.id.split('_')[0];
            return (
              validDriverIds.has(extractedDriverId) ||
              validDriverIds.has(activity.driverId)
            );
          });
        }

        const sortedData = filteredActivitiesData.sort((a, b) => {
          if (sortBy === 'hours') {
            return (b.totalMinutes || 0) - (a.totalMinutes || 0);
          }
          if (sortBy === 'offline') {
            return (b.totalOfflineMinutes || 0) - (a.totalOfflineMinutes || 0);
          }
          return a.driverName?.localeCompare(b.driverName || '') || 0;
        });

        setActivities(sortedData);
        setLoading(false);
        setIndexError(null);
        setLastRefreshTime(new Date());
        setLastSyncTime(new Date());
      },
      (error: any) => {
        console.error('Error fetching daily activities:', error);

        if (
          error.code === 'failed-precondition' ||
          error.message?.includes('index')
        ) {
          const urlMatch = error.message?.match(/https:\/\/console\.firebase\.google\.com[^\s]*/);
          if (urlMatch) {
            setIndexError(urlMatch[0]);
          } else {
            setIndexError('https://console.firebase.google.com/');
          }
        } else {
          if (!loading) {
            toast.error('Failed to load activities');
          }
        }
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    isMountedRef.current = true;
    setupListener();
    setupDriverStatusListener();

    return () => {
      isMountedRef.current = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      if (driverUnsubscribeRef.current) {
        driverUnsubscribeRef.current();
        driverUnsubscribeRef.current = null;
      }
    };
  }, [selectedDate]);

  useEffect(() => {
    setActivities((current) => {
      const copy = [...current];
      copy.sort((a, b) => {
        if (sortBy === 'hours') return (b.totalMinutes || 0) - (a.totalMinutes || 0);
        if (sortBy === 'offline') return (b.totalOfflineMinutes || 0) - (a.totalOfflineMinutes || 0);
        return a.driverName?.localeCompare(b.driverName || '') || 0;
      });
      return copy;
    });
  }, [sortBy]);

  const refreshData = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setCurrentTime(new Date());

    try {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
      setupListener();
      if (!driverUnsubscribeRef.current) {
        setupDriverStatusListener();
      }

      const activityRef = collection(db, 'driverDailyActivity');
      const activityQuery = query(activityRef, where('date', '==', selectedDate));
      const activitySnapshot = await getDocs(activityQuery);

      let validDriverIds = new Set<string>();

      try {
        const driversSnapshot = await getDocs(collection(db, 'drivers'));
        driversSnapshot.docs.forEach((driverDoc) => {
          validDriverIds.add(driverDoc.id);
        });
      } catch (error) {
        console.error('Error fetching drivers for validation:', error);
      }

      const activitiesData = activitySnapshot.docs.map((activityDoc) => {
        const data = activityDoc.data();
        const driverId = data.driverId || activityDoc.id.split('_')[0];

        return {
          id: activityDoc.id,
          ...data,
          driverId: driverId,
          driverCode: data.driverCode || 'PENDING',
          isOnline: data.isOnline ?? false,
          isAvailable: data.isAvailable ?? false,
          totalMinutes: data.totalMinutes || 0,
          totalOfflineMinutes: data.totalOfflineMinutes || 0,
        };
      }) as DailyActivity[];

      let filteredActivitiesData = activitiesData;

      if (validDriverIds.size > 0) {
        filteredActivitiesData = activitiesData.filter((activity) => {
          const extractedDriverId = activity.id.split('_')[0];
          return (
            validDriverIds.has(extractedDriverId) ||
            validDriverIds.has(activity.driverId)
          );
        });
      }

      const sortedData = filteredActivitiesData.sort((a, b) => {
        if (sortBy === 'hours') {
          return (b.totalMinutes || 0) - (a.totalMinutes || 0);
        }
        if (sortBy === 'offline') {
          return (b.totalOfflineMinutes || 0) - (a.totalOfflineMinutes || 0);
        }
        return a.driverName?.localeCompare(b.driverName || '') || 0;
      });

      setActivities(sortedData);
      setLastRefreshTime(new Date());
      setLastSyncTime(new Date());
      toast.success('✅ Data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data. Retrying...');
      setTimeout(() => {
        setupListener();
      }, 500);
    } finally {
      setRefreshing(false);
    }
  };

  const getDateRange = () => {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const formatTime = (timestamp: any): string => {
    if (!timestamp) return 'N/A';
    try {
      const date = getTimestamp(timestamp);
      if (!date) return 'N/A';
      return date.toLocaleTimeString();
    } catch {
      return 'N/A';
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateDuration = (
    startTime: any,
    endTime: Date = currentTime
  ): string => {
    if (!startTime) return 'N/A';
    try {
      const start = getTimestamp(startTime);
      if (!start) return 'N/A';
      const diffMs = endTime.getTime() - start.getTime();
      if (diffMs < 0) return 'N/A';
      const diffMins = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const minutes = diffMins % 60;
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (isOnline: boolean) => {
    if (isOnline) {
      return (
        <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-green-100 text-green-800 animate-pulse">
          🟢 Online
        </span>
      );
    }
    return (
      <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-red-100 text-red-800">
        🔴 Offline
      </span>
    );
  };

  const calculateTotalHoursForDisplay = (
    activity: DailyActivity
  ): string => {
    const { hours, minutes } = calculateDriverHours(activity);
    return `${hours}h ${minutes}m`;
  };

  const getStatusDetails = (
    activity: DailyActivity
  ): {
    status: string;
    duration: string;
    startTime: string;
  } => {
    const now = currentTime;

    if (activity.isOnline) {
      let totalOnlineMinutes = Math.max(0, activity.totalMinutes || 0);

      const checkpoint = getTimestamp(activity.lastAccumulatedAt);
      const start = checkpoint || getTimestamp(activity.onlineStart);
      if (start) {
        const diffMs = now.getTime() - start.getTime();
        if (diffMs > 0) {
          totalOnlineMinutes += Math.floor(diffMs / 60000);
        }
      }

      const hours = Math.floor(totalOnlineMinutes / 60);
      const minutes = totalOnlineMinutes % 60;
      const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

      return {
        status: 'Online',
        duration: duration,
        startTime: formatTime(activity.onlineStart),
      };
    }

    if (!activity.isOnline) {
      let totalOfflineMinutes = Math.max(0, activity.totalOfflineMinutes || 0);

      const checkpoint = getTimestamp(activity.lastAccumulatedAt);
      const start = checkpoint || getTimestamp(activity.offlineStart);
      if (start) {
        const diffMs = now.getTime() - start.getTime();
        if (diffMs > 0) {
          totalOfflineMinutes += Math.floor(diffMs / 60000);
        }
      }

      const hours = Math.floor(totalOfflineMinutes / 60);
      const minutes = totalOfflineMinutes % 60;
      const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

      return {
        status: 'Offline',
        duration: duration,
        startTime: formatTime(activity.offlineStart),
      };
    }

    return {
      status: 'Unknown',
      duration: 'N/A',
      startTime: 'N/A',
    };
  };

  const getFullTimeline = (activity: DailyActivity): string[] => {
    const now = currentTime;
    const timelineItems: string[] = [];

    const allHistory = [
      ...(activity.onlineHistory || []).map(h => ({ ...h, status: 'online' })),
      ...(activity.offlineHistory || []).map(h => ({ ...h, status: 'offline' }))
    ].sort((a, b) => {
      const aTime = getTimestamp(a.timestamp)?.getTime() || 0;
      const bTime = getTimestamp(b.timestamp)?.getTime() || 0;
      return aTime - bTime;
    });

    if (allHistory.length === 0) {
      if (activity.isOnline && activity.onlineStart) {
        const start = getTimestamp(activity.onlineStart);
        if (start) {
          const diffMs = now.getTime() - start.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const hours = Math.floor(diffMins / 60);
          const mins = diffMins % 60;
          const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
          timelineItems.push(`🟢 Online since ${start.toLocaleTimeString()} (${duration})`);
        }
      } else if (!activity.isOnline && activity.offlineStart) {
        const start = getTimestamp(activity.offlineStart);
        if (start) {
          const diffMs = now.getTime() - start.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const hours = Math.floor(diffMins / 60);
          const mins = diffMins % 60;
          const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
          timelineItems.push(`⚪ Offline since ${start.toLocaleTimeString()} (${duration})`);
        }
      }
      return timelineItems;
    }

    allHistory.forEach((entry, index) => {
      const timestamp = getTimestamp(entry.timestamp);
      if (!timestamp) return;

      const timeStr = timestamp.toLocaleTimeString();
      const statusEmoji = entry.status === 'online' ? '🟢' : '⚪';
      const statusText = entry.status === 'online' ? 'Online' : 'Offline';

      let duration = '';
      if (index < allHistory.length - 1) {
        const nextTime = getTimestamp(allHistory[index + 1].timestamp);
        if (nextTime) {
          const diffMs = nextTime.getTime() - timestamp.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          if (diffMins > 0) {
            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
          }
        }
      } else {
        if ((entry.status === 'online' && activity.isOnline) ||
          (entry.status === 'offline' && !activity.isOnline)) {
          const diffMs = now.getTime() - timestamp.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          if (diffMins > 0) {
            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
          }
        }
      }

      timelineItems.push(`${timeStr} ${statusEmoji} ${statusText}${duration ? ` (${duration})` : ''}`);
    });

    return timelineItems;
  };

  const renderTimesWithTooltip = (activity: DailyActivity) => {
    const timeline = getFullTimeline(activity);
    const hasTimeline = timeline.length > 0;

    return (
      <div className="relative group">
        <div className="flex flex-col space-y-1">
          {activity.isOnline ? (
            <>
              <span className="text-sm text-green-600 font-medium">
                Online since: {formatTime(activity.onlineStart)}
              </span>
              {activity.offlineStart && (
                <span className={`text-sm ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                  Last offline: {formatTime(activity.offlineStart)}
                </span>
              )}
            </>
          ) : (
            <>
              <span className="text-sm text-red-600 font-medium">
                Offline since: {formatTime(activity.offlineStart)}
              </span>
              {activity.onlineStart && (
                <span className={`text-sm ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                  Last online: {formatTime(activity.onlineStart)}
                </span>
              )}
            </>
          )}
          {!activity.onlineStart && !activity.offlineStart && (
            <span className={`text-sm ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              No activity recorded
            </span>
          )}
        </div>

        {hasTimeline && (
          <div className={`absolute left-0 top-full mt-1 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 min-w-[200px] max-w-xs rounded-lg shadow-xl border p-3 ${userBackground === 'dark'
              ? 'bg-gray-800 border-gray-600 text-white'
              : 'bg-white border-gray-200 text-gray-900'
            }`}>
            <div className={`text-sm font-medium mb-2 ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              📋 Full Day Timeline
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {timeline.map((item, idx) => (
                <div key={idx} className={`text-sm ${userBackground === 'dark' ? 'text-gray-300' : 'text-gray-600'} py-0.5 border-b ${userBackground === 'dark' ? 'border-gray-700' : 'border-gray-100'} last:border-0`}>
                  {item}
                </div>
              ))}
            </div>
            <div className={`text-xs ${userBackground === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-1 text-center border-t ${userBackground === 'dark' ? 'border-gray-700' : 'border-gray-100'} pt-1`}>
              Hover to see full timeline
            </div>
          </div>
        )}
      </div>
    );
  };

  const filteredActivities = activities.filter(
    (activity) =>
      activity.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.driverCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.driverId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.numberPlate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDrivers = filteredActivities.length;
  const onlineDrivers = filteredActivities.filter((a) => a.isOnline).length;
  const offlineDrivers = totalDrivers - onlineDrivers;

  const totalMinutesWorked = filteredActivities.reduce((sum, a) => {
    const { hours, minutes } = calculateDriverHours(a);
    return sum + hours * 60 + minutes;
  }, 0);

  const totalHoursWorked = Math.floor(totalMinutesWorked / 60);
  const remainingMinutesWorked = totalMinutesWorked % 60;

  const averageMinutes = totalDrivers > 0 ? Math.floor(totalMinutesWorked / totalDrivers) : 0;
  const avgHours = Math.floor(averageMinutes / 60);
  const avgMinutes = averageMinutes % 60;

  if (indexError) {
    return (
      <div className={`space-y-6 ${getBackgroundClass()}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${userBackground === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Daily Driver Activity
            </h1>
            <p className={`text-base ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              View daily performance and activity of all drivers
            </p>
          </div>
          <Link
            href="/dashboard"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-base font-medium transition"
          >
            Back to Dashboard
          </Link>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-800">Index Required</h3>
              <p className="text-base text-yellow-700 mt-1">
                Firestore needs an index to query driver activities. Click the button below to create it.
              </p>
              <a
                href={indexError}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition text-base"
              >
                Create Index in Firebase Console
              </a>
              <p className="text-base text-yellow-600 mt-3">
                After creating the index, wait a few minutes for it to build, then refresh this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-[60vh] ${getBackgroundClass()}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 transition-colors duration-300 ${getBackgroundClass()}`}>
      <div className="w-full max-w-full mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${userBackground === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Daily Driver Activity
            </h1>
            <p className={`text-base ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              View daily performance and activity of all drivers
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <p className={`text-sm ${userBackground === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Last refreshed: {lastRefreshTime.toLocaleTimeString()}
              </p>
              <span className="text-sm text-green-500">
                🟢 Last Sync: {lastSyncTime.toLocaleTimeString()}
              </span>
              <span className="text-sm text-blue-500 animate-pulse">🔄 Real-time</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition ${refreshing
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
            >
              {refreshing ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"  
                    fill="none"  
                    viewBox="0 0 24 24"  
                  >  
                    <circle  
                      className="opacity-25"  
                      cx="12"  
                      cy="12"  
                      r="10"  
                      stroke="currentColor"  
                      strokeWidth="4"  
                    />  
                    <path  
                      className="opacity-75"  
                      fill="currentColor"  
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"  
                    />  
                  </svg>  
                  Refreshing...  
                </>  
              ) : (  
                <>  
                  <svg  
                    className="w-4 h-4"  
                    fill="none"  
                    stroke="currentColor"  
                    viewBox="0 0 24 24"  
                  >  
                    <path  
                      strokeLinecap="round"  
                      strokeLinejoin="round"  
                      strokeWidth="2"  
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"  
                    />  
                  </svg>  
                  Refresh Data  
                </>  
              )}  
            </button>  
            <Link  
              href="/dashboard"  
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-base font-medium transition"  
            >  
              Back to Dashboard  
            </Link>  
          </div>  
        </div>  
   
        {/* REAL-TIME STATUS */}  
        <div  
          className={`rounded-xl p-3 flex flex-wrap items-center justify-between ${userBackground === 'dark'  
              ? 'bg-blue-900/30 border border-blue-700 text-blue-200'  
              : 'bg-blue-50 border border-blue-200 text-blue-700'  
            }`}  
        >  
          <div className="flex flex-wrap items-center gap-2">  
            <div  
              className={`w-2 h-2 rounded-full ${refreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 animate-pulse'  
                }`}  
            />  
            <span className={`text-base ${userBackground === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>  
              {refreshing ? '🔄 Refreshing data...' : '✅ Live updates: Driver status auto-syncs from database'}  
            </span>  
          </div>  
          <span className={`text-sm ${userBackground === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>  
            {onlineDrivers} online • {offlineDrivers} offline  
          </span>  
        </div>  
   
        {/* FILTERS AND STATS */}  
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">  
          <div className="rounded-xl shadow-sm p-4 border bg-cyan-300 border-blue-200">  
            <p className="text-base text-gray-800">Date</p>  
            <select  
              value={selectedDate}  
              onChange={(e) => setSelectedDate(e.target.value)}  
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-400 border-gray-300 text-base"  
            >  
              {getDateRange().map((date) => (  
                <option key={date} value={date}>  
                  {formatDate(date)}  
                </option>  
              ))}  
            </select>  
          </div>  
          <div className="rounded-xl shadow-sm p-4 border bg-green-50 border-green-200">  
            <p className="text-base text-gray-800">Total Drivers</p>  
            <p className="text-3xl font-bold text-gray-900">{totalDrivers}</p>  
          </div>  
          <div className="rounded-xl shadow-sm p-4 border bg-green-100 border-green-300">  
            <p className="text-base text-gray-800">Online Now</p>  
            <p className="text-3xl font-bold text-green-600">{onlineDrivers}</p>  
          </div>  
          <div className="rounded-xl shadow-sm p-4 border bg-red-200 border-red-200">  
            <p className="text-base text-gray-800">Offline Now</p>  
            <p className="text-3xl font-bold text-red-600">{offlineDrivers}</p>  
          </div>  
          <div className="rounded-xl shadow-sm p-4 border bg-blue-300 border-blue-200">  
            <p className="text-base text-gray-800">Average Working Time</p>  
            <p className="text-3xl font-bold text-blue-600">  
              {avgHours}h {avgMinutes}m  
            </p>  
          </div>  
        </div>  
   
        {/* SEARCH AND SORT */}  
        <div className="rounded-xl shadow-sm p-4 border bg-gray-50 border-gray-200 w-full">  
          <div className="flex flex-col sm:flex-row gap-4">  
            <input  
              type="text"  
              placeholder="Search by driver name, ID or plate number..."  
              value={searchTerm}  
              onChange={(e) => setSearchTerm(e.target.value)}  
              className="flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-300 text-gray-900 border-gray-300 text-base"  
            />  
            <select  
              value={sortBy}  
              onChange={(e) =>  
                setSortBy(e.target.value as 'hours' | 'name' | 'offline')  
              }  
              className="px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-400 border-gray-300 text-base"  
            >  
              <option value="hours">Sort by Hours Worked</option>  
              <option value="offline">Sort by Offline Hours</option>  
              <option value="name">Sort by Name</option>  
            </select>  
          </div>  
        </div>  
   
        {/* ACTIVITY TABLE */}  
        <div  
          className={`rounded-xl shadow-sm border overflow-hidden ${userBackground === 'dark' ? 'border-gray-700' : 'border-gray-100'  
            } ${getCardClass()} w-full`}  
        >  
          <div  
            className={`p-6 border-b ${userBackground === 'dark' ? 'border-gray-700' : 'border-gray-200'  
              } flex flex-wrap justify-between items-center gap-4`}  
          >  
            <h2 className={`text-xl font-semibold ${userBackground === 'dark' ? 'text-white' : 'text-gray-900'}`}>  
              Driver Activity - {formatDate(selectedDate)}  
            </h2>  
            <span className={`text-base ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>  
              {filteredActivities.length} drivers  
            </span>  
          </div>  
          <div className="overflow-x-auto w-full">  
            <table className="w-full min-w-[1000px]">  
              <thead className="bg-red-900">  
                <tr>  
                  <th className={`px-6 py-4 text-left text-sm font-medium uppercase tracking-wider ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-200'}`}>  
                    Driver  
                  </th>  
                  <th className={`px-6 py-4 text-left text-sm font-medium uppercase tracking-wider ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-200'}`}>  
                    Driver ID  
                  </th>  
                  <th className={`px-6 py-4 text-left text-sm font-medium uppercase tracking-wider ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-200'}`}>  
                    Plate Number  
                  </th>  
                  <th className={`px-6 py-4 text-left text-sm font-medium uppercase tracking-wider ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-200'}`}>  
                    Status  
                  </th>  
                  <th className={`px-6 py-4 text-left text-sm font-medium uppercase tracking-wider ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-200'}`}>  
                    Current Duration  
                  </th>  
                  <th className={`px-6 py-4 text-left text-sm font-medium uppercase tracking-wider ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-200'}`}>  
                    Offline Duration  
                  </th>  
                  <th className={`px-6 py-4 text-left text-sm font-medium uppercase tracking-wider ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-200'}`}>  
                    Sessions  
                  </th>  
                  <th className={`px-6 py-4 text-left text-sm font-medium uppercase tracking-wider ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-200'}`}>  
                    Times  
                  </th>  
                  <th className={`px-6 py-4 text-left text-sm font-medium uppercase tracking-wider ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-200'}`}>  
                    Total Hours  
                  </th>  
                  <th className={`px-6 py-4 text-left text-sm font-medium uppercase tracking-wider ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-200'}`}>  
                    Efficiency  
                  </th>  
                  <th className={`px-6 py-4 text-left text-sm font-medium uppercase tracking-wider ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-200'}`}>  
                    Last Updated  
                  </th>  
                </tr>  
              </thead>  
              <tbody className={`divide-y ${userBackground === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>  
                {filteredActivities.length === 0 ? (  
                  <tr>  
                    <td  
                      colSpan={11}  
                      className={`px-6 py-8 text-center text-base ${userBackground === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}  
                    >  
                      No activity records found for this date  
                    </td>  
                  </tr>  
                ) : (  
                  filteredActivities.map((activity) => {  
                    const statusInfo = getStatusDetails(activity);  
                    const offlineDuration = calculateOfflineDuration(activity);  
                    const currentDuration = getCurrentDuration(activity); 
 
                    const { hours: efficiencyHours, minutes: efficiencyMinutes } =  
                      calculateDriverHours(activity);  
   
                    const efficiencyTotalMinutes =  
                      efficiencyHours * 60 + efficiencyMinutes;  
   
                    const TARGET_MINUTES = 480;  
   
                    let efficiency = 0;  
   
                    if (efficiencyTotalMinutes <= 0) {  
                      efficiency = 0;  
                    } else if (efficiencyTotalMinutes >= TARGET_MINUTES) {  
                      efficiency = 100;  
                    } else {  
                      efficiency = (efficiencyTotalMinutes / TARGET_MINUTES) * 100;  
                    }  
   
                    efficiency = Math.min(100, Math.max(0, efficiency));  
   
                    const onlineSessions = activity.onlineSessions || 0;  
                    const offlineSessions = activity.offlineSessions || 0;  
                    const totalSwitches = activity.totalSwitches || 0;  
                    const totalHoursDisplay = calculateTotalHoursForDisplay(activity);  
   
                    const displayDriverId =  
                      activity.driverCode && activity.driverCode !== 'PENDING'  
                        ? activity.driverCode  
                        : 'Assigning...';  
   
                    return (  
                      <tr  
                        key={activity.id}  
                        className={userBackground === 'dark' ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}  
                      >  
                        {/* DRIVER */}  
                        <td className="px-6 py-4 whitespace-nowrap">  
                          <div className="flex items-center">  
                            <div className="relative">  
                              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-base">  
                                {activity.driverName?.charAt(0) || '?'}  
                              </div>  
                              {activity.isOnline && (  
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>  
                              )}  
                              {!activity.isOnline && (  
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>  
                              )}  
                            </div>  
                            <div className="ml-3">  
                              <div className={`text-base font-medium ${userBackground === 'dark' ? 'text-white' : 'text-gray-900'}`}>  
                                {activity.driverName || 'Unknown'}  
                              </div>  
                            </div>  
                          </div>  
                        </td>  
   
                        {/* PUBLIC DRIVER ID */}  
                        <td className="px-6 py-4 whitespace-nowrap">  
                          <span className="text-base font-mono font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">  
                            {displayDriverId}  
                          </span>  
                        </td>  
   
                        {/* PLATE */}  
                        <td className="px-6 py-4 whitespace-nowrap">  
                          <span className={`text-base font-medium ${userBackground === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>  
                            {activity.numberPlate || 'N/A'}  
                          </span>  
                        </td>  
   
                        {/* STATUS */}  
                        <td className="px-6 py-4 whitespace-nowrap">  
                          {getStatusBadge(activity.isOnline)}  
                        </td>  
   
                        {/* CURRENT DURATION */}  
                        <td className="px-6 py-4 whitespace-nowrap">  
                          <span className={`text-base font-semibold ${activity.isOnline ? 'text-green-600' : 'text-red-600'}`}>  
                            {currentDuration}  
                          </span>  
                        </td>  
   
                        {/* OFFLINE DURATION */}  
                        <td className="px-6 py-4 whitespace-nowrap">  
                          <span className="text-base font-semibold text-red-600">  
                            {offlineDuration}  
                          </span>  
                        </td>  
   
                        {/* SESSIONS */}  
                        <td className="px-6 py-4 whitespace-nowrap">  
                          <div className="flex flex-col space-y-1">  
                            <span className={`text-sm ${userBackground === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>  
                              Online: {onlineSessions}  
                            </span>  
                            <span className={`text-sm ${userBackground === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>  
                              Offline: {offlineSessions}  
                            </span>  
                            <span className="text-sm text-gray-400">Switches: {totalSwitches}</span>  
                          </div>  
                        </td>  
   
                        {/* TIMES */}  
                        <td className="px-6 py-4 whitespace-nowrap">  
                          {renderTimesWithTooltip(activity)}  
                        </td>  
   
                        {/* TOTAL HOURS */}  
                        <td className="px-6 py-4 whitespace-nowrap">  
                          <span className="text-xl font-bold text-green-700">  
                            {totalHoursDisplay}  
                          </span>  
                        </td>  
   
                        {/* EFFICIENCY */}  
                        <td className="px-6 py-4 whitespace-nowrap">  
                          <div className="flex items-center gap-2">  
                            <div className="w-16 bg-gray-200 rounded-full h-2.5">  
                              <div  
                                className="bg-blue-500 rounded-full h-2.5"  
                                style={{ width: `${Math.min(efficiency, 100)}%` }}  
                              ></div>  
                            </div>  
                            <span className={`text-base font-medium ${userBackground === 'dark' ? 'text-white' : 'text-gray-700'}`}>  
                              {efficiency.toFixed(0)}%  
                            </span>  
                          </div>  
                        </td>  
   
                        {/* LAST UPDATED */}  
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">  
                          {activity.lastUpdated ? formatTime(activity.lastUpdated) : 'N/A'}  
                        </td>  
                      </tr>  
                    );  
                  })  
                )}  
              </tbody>  
            </table>  
          </div>  
        </div>  
   
        {/* SUMMARY FOOTER */}  
        <div  
          className={`rounded-xl shadow-sm p-4 border ${userBackground === 'dark' ? 'border-gray-700' : 'border-gray-100'  
            } ${getCardClass()} w-full`}  
        >  
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-cyan-700 text-center">  
            <div>  
              <p className={`text-base ${userBackground === 'dark' ? 'text-gray-900' : 'text-gray-800'}`}>  
                Total Hours Worked  
              </p>  
              <p className={`text-2xl font-bold ${userBackground === 'dark' ? 'text-white' : 'text-gray-200'}`}>  
                {totalHoursWorked}h {remainingMinutesWorked}m  
              </p>  
            </div>  
            <div>  
              <p className={`text-base ${userBackground === 'dark' ? 'text-gray-900' : 'text-gray-800'}`}>  
                Online Drivers  
              </p>  
              <p className="text-2xl font-bold text-green-600">{onlineDrivers}</p>  
            </div>  
            <div>  
              <p className={`text-base ${userBackground === 'dark' ? 'text-gray-900' : 'text-gray-800'}`}>  
                Offline Drivers  
              </p>  
              <p className="text-2xl font-bold text-red-600">{offlineDrivers}</p>  
            </div>  
            <div>  
              <p className={`text-base ${userBackground === 'dark' ? 'text-gray-900' : 'text-gray-800'}`}>  
                Average Working Time  
              </p>  
              <p className={`text-2xl font-bold ${userBackground === 'dark' ? 'text-white' : 'text-gray-200'}`}>  
                {avgHours}h {avgMinutes}m  
              </p>  
            </div>  
            <div>  
              <p className={`text-base ${userBackground === 'dark' ? 'text-gray-900' : 'text-gray-800'}`}>  
                Total Sessions  
              </p>  
              <p className={`text-2xl font-bold ${userBackground === 'dark' ? 'text-white' : 'text-gray-200'}`}>  
                {filteredActivities.reduce((sum, a) => {  
                  const online = a.onlineSessions || 0;  
                  const offline = a.offlineSessions || 0;  
                  if (online === 0 && offline === 0 && a.driverId) {  
                    return sum + 1;  
                  }  
                  return sum + online + offline;  
                }, 0)}  
              </p>  
            </div>  
            <div>  
              <p className={`text-base ${userBackground === 'dark' ? 'text-gray-900' : 'text-gray-800'}`}>  
                Last Sync  
              </p>  
              <p className={`text-2xl font-bold ${userBackground === 'dark' ? 'text-white' : 'text-gray-200'}`}>  
                {lastSyncTime.toLocaleTimeString()}  
              </p>  
            </div>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
}