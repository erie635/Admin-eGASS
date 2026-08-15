'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { db, auth } from '../../../lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
  orderBy,
  updateDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import toast from 'react-hot-toast';

// ============================================================
// Types
// ============================================================

interface OrderDetails {
  orderId: string;
  fuelType: string;
  litres: number;
  totalAmount: number;
  deliveryAddress?: string;
  deliveryDate: any;
  status?: string;
  paymentMethod?: string;
}

interface Feedback {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  rating: number;
  comment: string;
  orderId?: string;
  fuelType?: string;
  amount?: number;
  createdAt: any;
  timestamp: any;
  isRead?: boolean;
  reply?: string;
  replyAt?: any;
  orderDetails?: OrderDetails;
}

// ============================================================
// Debounce Hook
// ============================================================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================
// Star Rating Component
// ============================================================

const StarRating = ({
  rating,
  size = 'sm',
}: {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const validRating = Math.max(0, Math.min(5, Number(rating) || 0));

  const fullStars = Math.floor(validRating);
  const decimal = validRating - fullStars;

  const hasHalfStar = decimal >= 0.25 && decimal < 0.75;
  const roundedFullStars = decimal >= 0.75 ? fullStars + 1 : fullStars;

  const finalFullStars = Math.min(roundedFullStars, 5);
  const finalHasHalfStar = hasHalfStar && finalFullStars < 5;

  const emptyStars = Math.max(
    0,
    5 - finalFullStars - (finalHasHalfStar ? 1 : 0)
  );

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const starClass = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(finalFullStars)].map((_, i) => (
        <svg
          key={`full_${i}`}
          className={`${starClass} text-yellow-400`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.175 0l-3.39 2.462c-.784.57-1.838-.196-1.539-1.118l1.286-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
        </svg>
      ))}

      {finalHasHalfStar && (
        <svg
          className={`${starClass} text-yellow-400`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15.27l5.18 3.05-1.64-5.81L19 8.5l-6.91-.59L10 2 7.91 7.91 1 8.5l4.45 3.98-1.64 5.81L10 15.27z" />
        </svg>
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty_${i}`}
          className={`${starClass} text-gray-300`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.175 0l-3.39 2.462c-.784.57-1.838-.196-1.539-1.118l1.286-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
        </svg>
      ))}
    </div>
  );
};

// ============================================================
// Loading Skeleton
// ============================================================

const FeedbackSkeleton = ({
  userBackground,
}: {
  userBackground: string;
}) => {
  const getRowClass = () => {
    switch (userBackground) {
      case 'dark':
        return 'bg-gray-700/50';
      case 'skyblue':
        return 'bg-blue-100/50';
      case 'gray':
        return 'bg-gray-200/50';
      default:
        return 'bg-gray-100/50';
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 ${getRowClass()} animate-pulse`}
    >
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-3 space-y-1.5">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>

        <div className="col-span-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
        </div>

        <div className="col-span-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
        </div>

        <div className="col-span-1 flex justify-center">
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>

        <div className="col-span-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
        </div>

        <div className="col-span-1 flex justify-center">
          <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Highlight Search Terms
// ============================================================

const HighlightText = ({
  text,
  searchTerm,
}: {
  text: string;
  searchTerm: string;
}) => {
  if (!searchTerm || !text) return <>{text}</>;

  const escapedSearchTerm = searchTerm.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

  const parts = text.split(
    new RegExp(`(${escapedSearchTerm})`, 'gi')
  );

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark
            key={index}
            className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

// ============================================================
// Stats Summary
// ============================================================

const StatsSummary = ({
  feedbacks,
  userBackground,
}: {
  feedbacks: Feedback[];
  userBackground: string;
}) => {
  const total = feedbacks.length;

  const avgRating =
    total > 0
      ? feedbacks.reduce(
          (sum, f) => sum + (Number(f.rating) || 0),
          0
        ) / total
      : 0;

  const unread = feedbacks.filter((f) => !f.isRead).length;

  const ratingDistribution = [0, 0, 0, 0, 0];

  feedbacks.forEach((f) => {
    const rating = Number(f.rating) || 0;

    if (rating >= 1 && rating <= 5) {
      ratingDistribution[Math.floor(rating) - 1]++;
    }
  });

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

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${getCardClass()} rounded-xl p-5 border`}
    >
      <div className="text-center">
        <p
          className={`text-2xl font-bold ${
            userBackground === 'dark'
              ? 'text-white'
              : 'text-gray-900'
          }`}
        >
          {total}
        </p>

        <p
          className={`text-sm ${
            userBackground === 'dark'
              ? 'text-gray-400'
              : 'text-gray-500'
          }`}
        >
          Total
        </p>
      </div>

      <div className="text-center">
        <div className="flex justify-center">
          <StarRating rating={avgRating} size="md" />
        </div>

        <p
          className={`text-base font-bold mt-1 ${
            userBackground === 'dark'
              ? 'text-white'
              : 'text-gray-900'
          }`}
        >
          {avgRating.toFixed(1)}
        </p>

        <p
          className={`text-sm ${
            userBackground === 'dark'
              ? 'text-gray-400'
              : 'text-gray-500'
          }`}
        >
          Average
        </p>
      </div>

      <div className="text-center">
        <p className="text-2xl font-bold text-yellow-500">
          {ratingDistribution[4] || 0}
        </p>

        <p
          className={`text-sm ${
            userBackground === 'dark'
              ? 'text-gray-400'
              : 'text-gray-500'
          }`}
        >
          5-Star
        </p>
      </div>

      <div className="text-center">
        <p
          className={`text-2xl font-bold ${
            unread > 0
              ? 'text-red-500 animate-pulse'
              : userBackground === 'dark'
              ? 'text-gray-400'
              : 'text-gray-600'
          }`}
        >
          {unread}
        </p>

        <p
          className={`text-sm ${
            userBackground === 'dark'
              ? 'text-gray-400'
              : 'text-gray-500'
          }`}
        >
          {unread > 0 ? '📬 Unread' : 'Read'}
        </p>
      </div>
    </div>
  );
};

// ============================================================
// Main Page
// ============================================================

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [userBackground, setUserBackground] = useState('white');

  const [filter, setFilter] = useState<
    'all' | 'unread' | 'high-rating' | 'low-rating' | 'with-comments'
  >('all');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<string>('all');

  const [drivers, setDrivers] = useState<
    { id: string; name: string }[]
  >([]);

  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'highest' | 'lowest'
  >('newest');

  const [showStats, setShowStats] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isReplying, setIsReplying] = useState(false);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  const rowRefs = useRef<{
    [key: string]: HTMLDivElement | null;
  }>({});

  const debouncedSearch = useDebounce(searchTerm, 300);

  // ============================================================
  // User Background
  // ============================================================

  useEffect(() => {
    const fetchUserBackground = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      try {
        const userDoc = await getDoc(
          doc(db, 'users', currentUser.uid)
        );

        if (userDoc.exists()) {
          const data = userDoc.data();

          if (data.background) {
            setUserBackground(data.background);
          }
        }
      } catch (error) {
        console.error(
          'Error fetching user background:',
          error
        );
      }
    };

    fetchUserBackground();
  }, []);

  // ============================================================
  // Background Classes
  // ============================================================

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

  const getRowClass = () => {
    switch (userBackground) {
      case 'dark':
        return 'hover:bg-gray-700/50';

      case 'skyblue':
        return 'hover:bg-blue-50/50';

      case 'gray':
        return 'hover:bg-gray-50';

      default:
        return 'hover:bg-gray-50';
    }
  };

  // ============================================================
  // Date Helpers
  // ============================================================

  const convertTimestampToDate = (timestamp: any): Date | null => {
    if (!timestamp) return null;

    try {
      if (
        typeof timestamp === 'object' &&
        typeof timestamp.toDate === 'function'
      ) {
        return timestamp.toDate();
      }

      if (
        typeof timestamp === 'object' &&
        typeof timestamp.seconds === 'number'
      ) {
        return new Date(timestamp.seconds * 1000);
      }

      const date = new Date(timestamp);

      if (Number.isNaN(date.getTime())) {
        return null;
      }

      return date;
    } catch {
      return null;
    }
  };

  const formatDate = (timestamp: any) => {
    const date = convertTimestampToDate(timestamp);

    if (!date) return 'N/A';

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatOrderDate = (timestamp: any) => {
    const date = convertTimestampToDate(timestamp);

    if (!date) return 'N/A';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ============================================================
  // Keyboard Navigation
  // ============================================================

  const handleKeyDown = (
    e: React.KeyboardEvent,
    feedbackId: string,
    index: number
  ) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggleExpand(feedbackId);
        break;

      case 'ArrowDown': {
        e.preventDefault();

        const nextId = feedbacks[index + 1]?.id;

        if (nextId) {
          const nextRow = document.querySelector(
            `[data-feedback-id="${nextId}"]`
          );

          if (nextRow) {
            (nextRow as HTMLElement).focus();
          }
        }

        break;
      }

      case 'ArrowUp': {
        e.preventDefault();

        const prevId = feedbacks[index - 1]?.id;

        if (prevId) {
          const prevRow = document.querySelector(
            `[data-feedback-id="${prevId}"]`
          );

          if (prevRow) {
            (prevRow as HTMLElement).focus();
          }
        }

        break;
      }
    }
  };

  // ============================================================
  // Fetch Order Details
  // ============================================================

  const fetchOrderDetails = async (
    orderId: string
  ): Promise<OrderDetails | null> => {
    if (!orderId) return null;

    try {
      const orderDoc = await getDoc(
        doc(db, 'orders', orderId)
      );

      if (!orderDoc.exists()) {
        return null;
      }

      const data = orderDoc.data();

      return {
        orderId,
        fuelType:
          data.fuelType ||
          data.productType ||
          'N/A',

        litres:
          Number(data.litres || data.quantity || 0),

        totalAmount:
          Number(data.totalAmount || data.amount || 0),

        deliveryAddress:
          data.deliveryAddress ||
          data.address ||
          '',

        deliveryDate:
          data.createdAt ||
          data.deliveryDate ||
          null,

        status:
          data.status ||
          'completed',

        paymentMethod:
          data.paymentMethod ||
          'N/A',
      };
    } catch (error) {
      console.error(
        'Error fetching order details:',
        error
      );

      return null;
    }
  };

  // ============================================================
  // Fetch Feedback + Drivers
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const driversSnapshot = await getDocs(
          collection(db, 'drivers')
        );

        const driversList: {
          id: string;
          name: string;
        }[] = [];

        driversSnapshot.forEach((driverDoc) => {
          const data = driverDoc.data();

          driversList.push({
            id: driverDoc.id,
            name: data.name || 'Unknown Driver',
          });
        });

        if (mounted) {
          setDrivers(driversList);
        }

        const feedbackQuery = query(
          collection(db, 'feedback'),
          orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(
          feedbackQuery,
          async (snapshot) => {
            if (!mounted) return;

            try {
              const feedbackList: Feedback[] = [];

              for (const docSnap of snapshot.docs) {
                const data = docSnap.data();

                const feedback: Feedback = {
                  id: docSnap.id,

                  userId:
                    data.userId ||
                    data.clientId ||
                    '',

                  customerName:
                    data.customerName ||
                    data.clientName ||
                    'Anonymous Client',

                  customerEmail:
                    data.customerEmail ||
                    data.clientEmail ||
                    '',

                  customerPhone:
                    data.customerPhone ||
                    data.clientPhone ||
                    '',

                  driverId:
                    data.driverId ||
                    '',

                  driverName:
                    data.driverName ||
                    '',

                  driverPhone:
                    data.driverPhone ||
                    '',

                  rating:
                    Number(data.rating) || 0,

                  comment:
                    data.comment ||
                    '',

                  orderId:
                    data.orderId ||
                    '',

                  fuelType:
                    data.fuelType ||
                    '',

                  amount:
                    Number(data.amount) || 0,

                  createdAt:
                    data.createdAt ||
                    data.timestamp ||
                    null,

                  timestamp:
                    data.timestamp ||
                    data.createdAt ||
                    null,

                  isRead:
                    data.isRead === true,

                  reply:
                    data.reply ||
                    '',

                  replyAt:
                    data.replyAt ||
                    null,
                };

                // Fetch driver if missing
                if (
                  !feedback.driverName &&
                  feedback.driverId
                ) {
                  try {
                    const driverDoc = await getDoc(
                      doc(
                        db,
                        'drivers',
                        feedback.driverId
                      )
                    );

                    if (driverDoc.exists()) {
                      const driverData =
                        driverDoc.data();

                      feedback.driverName =
                        driverData.name ||
                        'Unknown Driver';

                      feedback.driverPhone =
                        driverData.phone ||
                        '';
                    }
                  } catch (error) {
                    console.error(
                      'Error fetching driver:',
                      error
                    );
                  }
                }

                // Fetch order details
                if (feedback.orderId) {
                  const orderDetails =
                    await fetchOrderDetails(
                      feedback.orderId
                    );

                  if (orderDetails) {
                    feedback.orderDetails =
                      orderDetails;
                  }
                }

                feedbackList.push(feedback);
              }

              if (!mounted) return;

              setFeedbacks(feedbackList);

              // IMPORTANT:
              // Calculate unread from Firestore snapshot.
              // This prevents double-counting after reply/read actions.
              const unread = feedbackList.filter(
                (f) => !f.isRead
              ).length;

              setUnreadCount(unread);
              setLoading(false);
            } catch (error) {
              console.error(
                'Error processing feedback:',
                error
              );

              if (mounted) {
                toast.error(
                  'Failed to process feedback'
                );

                setLoading(false);
              }
            }
          },
          (error) => {
            console.error(
              'Error listening to feedback:',
              error
            );

            if (mounted) {
              toast.error(
                'Failed to load feedback'
              );

              setLoading(false);
            }
          }
        );

        unsubscribeRef.current = unsubscribe;
      } catch (error) {
        console.error(
          'Error fetching data:',
          error
        );

        if (mounted) {
          toast.error(
            'Failed to load data'
          );

          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;

      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  // ============================================================
  // SEND ADMIN REPLY TO CLIENT
  // ============================================================

  const handleReply = async (
    feedbackId: string
  ) => {
    const message = replyText.trim();

    if (!message) {
      toast.error('Please enter a reply');
      return;
    }

    if (isReplying) {
      return;
    }

    const feedback = feedbacks.find(
      (item) => item.id === feedbackId
    );

    if (!feedback) {
      toast.error(
        'Feedback could not be found'
      );
      return;
    }

    if (!feedback.userId) {
      toast.error(
        'This feedback has no client user ID. The reply cannot be delivered to the client.'
      );
      return;
    }

    const currentAdmin = auth.currentUser;

    if (!currentAdmin) {
      toast.error(
        'Admin session has expired. Please log in again.'
      );
      return;
    }

    setIsReplying(true);

    try {
      const replyTime = new Date().toISOString();

      // --------------------------------------------------------
      // 1. Save reply on feedback document
      // --------------------------------------------------------

      const feedbackRef = doc(
        db,
        'feedback',
        feedbackId
      );

      await updateDoc(feedbackRef, {
        reply: message,
        replyAt: replyTime,
        isRead: true,

        // Additional metadata
        repliedBy: currentAdmin.uid,
        repliedByEmail:
          currentAdmin.email || '',
      });

      // --------------------------------------------------------
      // 2. Create client notification
      // --------------------------------------------------------
      //
      // The client app can listen to:
      //
      // collection(db, 'notifications')
      // where('userId', '==', currentUser.uid)
      //
      // --------------------------------------------------------

      await addDoc(
        collection(db, 'notifications'),
        {
          userId: feedback.userId,

          type: 'admin_reply',

          title: 'eGAS Admin Reply',

          message,

          body: message,

          feedbackId,

          orderId:
            feedback.orderId || null,

          customerName:
            feedback.customerName || '',

          adminId: currentAdmin.uid,

          adminEmail:
            currentAdmin.email || '',

          read: false,

          isRead: false,

          createdAt:
            serverTimestamp(),

          timestamp:
            serverTimestamp(),
        }
      );

      // --------------------------------------------------------
      // 3. Update local state immediately
      // --------------------------------------------------------

      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === feedbackId
            ? {
                ...f,
                reply: message,
                replyAt: replyTime,
                isRead: true,
              }
            : f
        )
      );

      setReplyText('');
      setReplyingTo(null);

      toast.success(
        'Reply sent to client successfully!'
      );
    } catch (error: any) {
      console.error(
        'Error sending admin reply:',
        error
      );

      toast.error(
        error?.message ||
          'Failed to send reply to client'
      );
    } finally {
      setIsReplying(false);
    }
  };

  // ============================================================
  // Mark as Read
  // ============================================================

  const handleMarkAsRead = async (
    feedbackId: string
  ) => {
    try {
      const feedbackRef = doc(
        db,
        'feedback',
        feedbackId
      );

      await updateDoc(feedbackRef, {
        isRead: true,
      });

      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === feedbackId
            ? {
                ...f,
                isRead: true,
              }
            : f
        )
      );

      // Do not manually decrement unreadCount.
      // Firestore listener remains the source of truth.
    } catch (error) {
      console.error(
        'Error marking as read:',
        error
      );

      toast.error(
        'Failed to mark as read'
      );
    }
  };

  // ============================================================
  // Toggle Expand
  // ============================================================

  const toggleExpand = (id: string) => {
    setExpandedId((current) =>
      current === id ? null : id
    );
  };

  // ============================================================
  // Filter + Sort
  // ============================================================

  const filteredFeedbacks = useMemo(() => {
    return feedbacks
      .filter((feedback) => {
        if (
          filter === 'high-rating' &&
          feedback.rating < 4
        ) {
          return false;
        }

        if (
          filter === 'low-rating' &&
          feedback.rating > 3
        ) {
          return false;
        }

        if (
          filter === 'unread' &&
          feedback.isRead
        ) {
          return false;
        }

        if (
          filter === 'with-comments' &&
          (!feedback.comment ||
            feedback.comment.trim().length === 0)
        ) {
          return false;
        }

        if (
          selectedDriver !== 'all' &&
          feedback.driverId !== selectedDriver
        ) {
          return false;
        }

        if (debouncedSearch) {
          const term =
            debouncedSearch.toLowerCase();

          return (
            feedback.customerName
              ?.toLowerCase()
              .includes(term) ||

            feedback.customerEmail
              ?.toLowerCase()
              .includes(term) ||

            feedback.driverName
              ?.toLowerCase()
              .includes(term) ||

            feedback.comment
              ?.toLowerCase()
              .includes(term) ||

            feedback.customerPhone
              ?.toLowerCase()
              .includes(term) ||

            feedback.orderDetails?.fuelType
              ?.toLowerCase()
              .includes(term) ||

            feedback.orderDetails?.deliveryAddress
              ?.toLowerCase()
              .includes(term)
          );
        }

        return true;
      })
      .sort((a, b) => {
        const aDate =
          convertTimestampToDate(
            a.createdAt
          )?.getTime() || 0;

        const bDate =
          convertTimestampToDate(
            b.createdAt
          )?.getTime() || 0;

        switch (sortBy) {
          case 'newest':
            return bDate - aDate;

          case 'oldest':
            return aDate - bDate;

          case 'highest':
            return (
              (b.rating || 0) -
              (a.rating || 0)
            );

          case 'lowest':
            return (
              (a.rating || 0) -
              (b.rating || 0)
            );

          default:
            return 0;
        }
      });
  }, [
    feedbacks,
    filter,
    selectedDriver,
    debouncedSearch,
    sortBy,
  ]);

  // ============================================================
  // Mark All As Read
  // ============================================================

  const markAllAsRead = async () => {
    try {
      const unread = feedbacks.filter(
        (f) => !f.isRead
      );

      if (unread.length === 0) {
        toast.success(
          'All feedback already read!'
        );
        return;
      }

      for (const f of unread) {
        const feedbackRef = doc(
          db,
          'feedback',
          f.id
        );

        await updateDoc(feedbackRef, {
          isRead: true,
        });
      }

      setFeedbacks((prev) =>
        prev.map((f) => ({
          ...f,
          isRead: true,
        }))
      );

      toast.success(
        `✅ ${unread.length} feedback marked as read!`
      );
    } catch (error) {
      console.error(
        'Error marking as read:',
        error
      );

      toast.error(
        'Failed to mark as read'
      );
    }
  };

  // ============================================================
  // CSV Escape
  // ============================================================

  const csvEscape = (value: any) => {
    const stringValue =
      value === null ||
      value === undefined
        ? ''
        : String(value);

    return `"${stringValue.replace(
      /"/g,
      '""'
    )}"`;
  };

  // ============================================================
  // Export Feedback
  // ============================================================

  const exportData = () => {
    const csv = [
      [
        'Customer',
        'Email',
        'Phone',
        'Driver',
        'Rating',
        'Comment',
        'Date',
        'Read',
        'Reply',
        'Order ID',
        'Fuel Type',
        'Litres',
        'Amount',
        'Delivery Address',
      ],

      ...feedbacks.map((f) => [
        f.customerName,
        f.customerEmail,
        f.customerPhone,
        f.driverName || 'N/A',
        f.rating || 0,
        f.comment || '',
        formatDate(f.createdAt),
        f.isRead ? 'Yes' : 'No',
        f.reply || '',
        f.orderId || 'N/A',
        f.orderDetails?.fuelType ||
          f.fuelType ||
          'N/A',
        f.orderDetails?.litres || 0,
        f.orderDetails?.totalAmount ||
          f.amount ||
          0,
        f.orderDetails?.deliveryAddress ||
          'N/A',
      ]),
    ]
      .map((row) =>
        row.map(csvEscape).join(',')
      )
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement('a');

    a.href = url;

    a.download = `feedback_${
      new Date()
        .toISOString()
        .split('T')[0]
    }.csv`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

    toast.success(
      'Feedback exported successfully!'
    );
  };

  // ============================================================
  // Loading
  // ============================================================

  if (loading) {
    return (
      <div
        className={`p-4 md:p-5 transition-colors duration-300 ${getBackgroundClass()}`}
      >
        <div className="max-w-full mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-40 animate-pulse" />

            <div className="flex gap-3">
              <div className="h-9 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-9 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>

          <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />

          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />

          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <FeedbackSkeleton
                key={i}
                userBackground={
                  userBackground
                }
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // Main UI
  // ============================================================

  return (
    <div
      className={`p-4 md:p-5 transition-colors duration-300 ${getBackgroundClass()}`}
    >
      <div className="max-w-full mx-auto space-y-4">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1
              className={`text-xl font-bold ${
                userBackground === 'dark'
                  ? 'text-white'
                  : 'text-gray-900'
              }`}
            >
              📝 Feedback

              {unreadCount > 0 && (
                <span className="ml-2 px-2.5 py-0.5 text-sm bg-red-500 text-white rounded-full animate-pulse">
                  {unreadCount} new
                </span>
              )}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() =>
                  setFilter(
                    filter === 'unread'
                      ? 'all'
                      : 'unread'
                  )
                }
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  filter === 'unread'
                    ? 'bg-red-500 text-white'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                📬 {unreadCount}
              </button>
            )}

            <button
              onClick={() =>
                setShowStats(!showStats)
              }
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                userBackground === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label="Toggle statistics"
            >
              📊
            </button>

            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              Read All
            </button>

            <button
              onClick={exportData}
              className="px-3 py-1.5 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
            >
              📥
            </button>

            <Link
              href="/dashboard"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                userBackground === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ←
            </Link>
          </div>
        </div>

        {/* Stats */}
        {showStats && (
          <StatsSummary
            feedbacks={feedbacks}
            userBackground={
              userBackground
            }
          />
        )}

        {/* Filters */}
        <div
          className={`rounded-lg shadow-sm p-3 border ${getCardClass()}`}
        >
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="Search..."
              className={`flex-1 min-w-[140px] px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                userBackground === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            />

            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value as typeof filter
                )
              }
              className={`px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                userBackground === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="all">
                All
              </option>

              <option value="unread">
                📬 Unread ({unreadCount})
              </option>

              <option value="high-rating">
                ⭐ 4-5
              </option>

              <option value="low-rating">
                ⚠️ 1-3
              </option>

              <option value="with-comments">
                💬 With Comments
              </option>
            </select>

            <select
              value={selectedDriver}
              onChange={(e) =>
                setSelectedDriver(
                  e.target.value
                )
              }
              className={`px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                userBackground === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="all">
                All Drivers
              </option>

              {drivers.map((driver) => (
                <option
                  key={driver.id}
                  value={driver.id}
                >
                  {driver.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as typeof sortBy
                )
              }
              className={`px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                userBackground === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="highest">
                Highest
              </option>

              <option value="lowest">
                Lowest
              </option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p
            className={`text-sm ${
              userBackground === 'dark'
                ? 'text-gray-400'
                : 'text-gray-500'
            }`}
          >
            Showing {filteredFeedbacks.length} of{' '}
            {feedbacks.length} feedback entries

            {debouncedSearch &&
              ` (matching "${debouncedSearch}")`}
          </p>
        </div>

        {/* Feedback List */}
        {filteredFeedbacks.length > 0 ? (
          <div
            className="space-y-1.5"
            role="table"
            aria-label="Feedback list"
          >
            {/* Header */}
            <div
              className={`grid grid-cols-12 gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg ${
                userBackground === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-red-900 text-gray-200'
              }`}
            >
              <div className="col-span-3">
                Customer
              </div>

              <div className="col-span-3">
                Comment
              </div>

              <div className="col-span-2">
                Driver
              </div>

              <div className="col-span-1 text-center">
                Rating
              </div>

              <div className="col-span-2 text-center">
                Date
              </div>

              <div className="col-span-1 text-center">
                Status
              </div>
            </div>

            {/* Rows */}
            {filteredFeedbacks.map(
              (feedback, index) => (
                <div
                  key={feedback.id}
                  className={`border rounded-lg ${
                    !feedback.isRead
                      ? 'border-blue-400 border-2'
                      : userBackground === 'dark'
                      ? 'border-gray-700'
                      : 'border-gray-400'
                  }`}
                  data-feedback-id={
                    feedback.id
                  }
                >
                  {/* Main Row */}
                  <div
                    ref={(el) => {
                      rowRefs.current[
                        feedback.id
                      ] = el;
                    }}
                    className={`grid grid-cols-12 gap-3 px-4 py-3 text-sm cursor-pointer ${getRowClass()}`}
                    onClick={() =>
                      toggleExpand(
                        feedback.id
                      )
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(
                        e,
                        feedback.id,
                        index
                      )
                    }
                    tabIndex={0}
                    role="button"
                    aria-expanded={
                      expandedId ===
                      feedback.id
                    }
                  >
                    {/* Customer */}
                    <div className="col-span-3 truncate">
                      <div className="font-medium truncate text-base">
                        {debouncedSearch ? (
                          <HighlightText
                            text={
                              feedback.customerName
                            }
                            searchTerm={
                              debouncedSearch
                            }
                          />
                        ) : (
                          feedback.customerName
                        )}
                      </div>

                      <div
                        className={`text-sm truncate ${
                          userBackground === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-500'
                        }`}
                      >
                        {debouncedSearch ? (
                          <HighlightText
                            text={
                              feedback.customerEmail ||
                              feedback.customerPhone ||
                              ''
                            }
                            searchTerm={
                              debouncedSearch
                            }
                          />
                        ) : (
                          feedback.customerEmail ||
                          feedback.customerPhone
                        )}
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="col-span-3 truncate text-sm text-gray-600 dark:text-cyan-600">
                      "
                      {debouncedSearch ? (
                        <HighlightText
                          text={
                            feedback.comment?.slice(
                              0,
                              60
                            ) || ''
                          }
                          searchTerm={
                            debouncedSearch
                          }
                        />
                      ) : (
                        feedback.comment?.slice(
                          0,
                          60
                        )
                      )}
                      {feedback.comment &&
                      feedback.comment.length >
                        60
                        ? '...'
                        : ''}
                      "
                    </div>

                    {/* Driver */}
                    <div className="col-span-2 truncate text-sm">
                      {debouncedSearch &&
                      feedback.driverName ? (
                        <HighlightText
                          text={
                            feedback.driverName
                          }
                          searchTerm={
                            debouncedSearch
                          }
                        />
                      ) : (
                        feedback.driverName ||
                        'N/A'
                      )}
                    </div>

                    {/* Rating */}
                    <div className="col-span-1 flex justify-center items-center">
                      <StarRating
                        rating={
                          feedback.rating || 0
                        }
                        size="sm"
                      />
                    </div>

                    {/* Date */}
                    <div className="col-span-2 text-center truncate text-sm">
                      {formatDate(
                        feedback.createdAt
                      )}
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex justify-center items-center gap-1.5">
                      {!feedback.isRead && (
                        <span
                          className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"
                          aria-label="Unread"
                        />
                      )}

                      {feedback.reply && (
                        <span
                          className="text-sm text-green-500"
                          aria-label="Has reply"
                        >
                          ↩
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId ===
                    feedback.id && (
                    <div
                      className={`px-4 py-3 border-t ${
                        userBackground === 'dark'
                          ? 'border-gray-700'
                          : 'border-gray-200'
                      } space-y-3`}
                    >
                      {/* Comment */}
                      <div>
                        <div
                          className={`text-sm font-medium ${
                            userBackground ===
                            'dark'
                              ? 'text-gray-300'
                              : 'text-blue-700'
                          }`}
                        >
                          💬 Comment
                        </div>

                        <div
                          className={`p-3 rounded text-sm ${
                            userBackground ===
                            'dark'
                              ? 'bg-gray-700/50 text-gray-300'
                              : 'bg-gray-50 text-gray-700'
                          }`}
                        >
                          {debouncedSearch ? (
                            <HighlightText
                              text={
                                feedback.comment ||
                                'No comment'
                              }
                              searchTerm={
                                debouncedSearch
                              }
                            />
                          ) : (
                            feedback.comment ||
                            'No comment'
                          )}
                        </div>
                      </div>

                      {/* Order Details */}
                      {feedback.orderDetails && (
                        <div
                          className={`p-3 rounded border ${
                            userBackground ===
                            'dark'
                              ? 'bg-blue-900/20 border-blue-700'
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div
                            className={`text-sm font-medium mb-2 ${
                              userBackground ===
                              'dark'
                                ? 'text-blue-300'
                                : 'text-blue-700'
                            }`}
                          >
                            📦 Last Delivery Details
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            <div>
                              <span
                                className={
                                  userBackground ===
                                  'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }
                              >
                                Fuel Type:
                              </span>

                              <span className="font-medium ml-1">
                                {
                                  feedback
                                    .orderDetails
                                    .fuelType
                                }
                              </span>
                            </div>

                            <div>
                              <span
                                className={
                                  userBackground ===
                                  'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }
                              >
                                Litres:
                              </span>

                              <span className="font-medium ml-1">
                                {
                                  feedback
                                    .orderDetails
                                    .litres
                                }
                                L
                              </span>
                            </div>

                            <div>
                              <span
                                className={
                                  userBackground ===
                                  'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }
                              >
                                Amount:
                              </span>

                              <span className="font-medium ml-1">
                                KES{' '}
                                {Number(
                                  feedback
                                    .orderDetails
                                    .totalAmount
                                ).toLocaleString()}
                              </span>
                            </div>

                            <div>
                              <span
                                className={
                                  userBackground ===
                                  'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }
                              >
                                Delivery Date:
                              </span>

                              <span className="font-medium ml-1">
                                {formatOrderDate(
                                  feedback
                                    .orderDetails
                                    .deliveryDate
                                )}
                              </span>
                            </div>

                            {feedback
                              .orderDetails
                              .deliveryAddress && (
                              <div className="col-span-2">
                                <span
                                  className={
                                    userBackground ===
                                    'dark'
                                      ? 'text-gray-400'
                                      : 'text-gray-500'
                                  }
                                >
                                  Address:
                                </span>

                                <span className="font-medium ml-1">
                                  {
                                    feedback
                                      .orderDetails
                                      .deliveryAddress
                                  }
                                </span>
                              </div>
                            )}

                            {feedback
                              .orderDetails
                              .status && (
                              <div>
                                <span
                                  className={
                                    userBackground ===
                                    'dark'
                                      ? 'text-gray-400'
                                      : 'text-gray-500'
                                  }
                                >
                                  Status:
                                </span>

                                <span
                                  className={`ml-1 px-2 py-0.5 rounded text-xs font-medium ${
                                    feedback
                                      .orderDetails
                                      .status ===
                                    'completed'
                                      ? 'bg-green-100 text-green-700'
                                      : feedback
                                          .orderDetails
                                          .status ===
                                        'pending'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : feedback
                                          .orderDetails
                                          .status ===
                                        'cancelled'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {
                                    feedback
                                      .orderDetails
                                      .status
                                  }
                                </span>
                              </div>
                            )}

                            {feedback
                              .orderDetails
                              .paymentMethod && (
                              <div>
                                <span
                                  className={
                                    userBackground ===
                                    'dark'
                                      ? 'text-gray-400'
                                      : 'text-gray-500'
                                  }
                                >
                                  Payment:
                                </span>

                                <span className="font-medium ml-1">
                                  {
                                    feedback
                                      .orderDetails
                                      .paymentMethod
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <div
                            className={
                              userBackground ===
                              'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }
                          >
                            Customer
                          </div>

                          <div className="font-medium text-base">
                            {
                              feedback.customerName
                            }
                          </div>

                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {
                              feedback.customerEmail
                            }
                          </div>

                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {
                              feedback.customerPhone
                            }
                          </div>
                        </div>

                        <div>
                          <div
                            className={
                              userBackground ===
                              'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }
                          >
                            Driver
                          </div>

                          <div className="font-medium text-base">
                            {
                              feedback.driverName ||
                              'N/A'
                            }
                          </div>

                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {
                              feedback.driverPhone ||
                              ''
                            }
                          </div>
                        </div>

                        <div>
                          <div
                            className={
                              userBackground ===
                              'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }
                          >
                            Details
                          </div>

                          <div className="flex items-center gap-1">
                            Rating:
                            <StarRating
                              rating={
                                feedback.rating ||
                                0
                              }
                              size="sm"
                            />
                          </div>

                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(
                              feedback.createdAt
                            )}
                          </div>

                          {feedback.orderId && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Order: #
                              {feedback.orderId.slice(
                                0,
                                8
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div>
                          <div
                            className={
                              userBackground ===
                              'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }
                          >
                            Actions
                          </div>

                          <div className="flex gap-1.5 mt-1 flex-wrap">
                            {!feedback.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();

                                  handleMarkAsRead(
                                    feedback.id
                                  );
                                }}
                                className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                              >
                                Read
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                setReplyingTo(
                                  replyingTo ===
                                    feedback.id
                                    ? null
                                    : feedback.id
                                );

                                if (
                                  replyingTo ===
                                  feedback.id
                                ) {
                                  setReplyText(
                                    ''
                                  );
                                }
                              }}
                              className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* ====================================================
                          ADMIN REPLY INPUT
                          ==================================================== */}

                      {replyingTo ===
                        feedback.id && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) =>
                              setReplyText(
                                e.target.value
                              )
                            }
                            placeholder="Write reply to client..."
                            className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                              userBackground ===
                              'dark'
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white border-gray-300'
                            }`}
                            onKeyDown={(e) => {
                              if (
                                e.key ===
                                  'Enter' &&
                                !e.shiftKey
                              ) {
                                e.preventDefault();

                                if (
                                  !isReplying &&
                                  replyText.trim()
                                ) {
                                  handleReply(
                                    feedback.id
                                  );
                                }
                              }
                            }}
                            autoFocus
                          />

                          <button
                            onClick={() =>
                              handleReply(
                                feedback.id
                              )
                            }
                            disabled={
                              isReplying ||
                              !replyText.trim()
                            }
                            className="px-3 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 transition"
                          >
                            {isReplying
                              ? 'Sending...'
                              : 'Send'}
                          </button>

                          <button
                            onClick={() => {
                              setReplyingTo(
                                null
                              );

                              setReplyText('');
                            }}
                            disabled={isReplying}
                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {/* Existing Reply */}
                      {feedback.reply && (
                        <div
                          className={`p-3 rounded text-sm ${
                            userBackground ===
                            'dark'
                              ? 'bg-green-900/30 text-green-300'
                              : 'bg-green-50 text-green-700'
                          }`}
                        >
                          <span className="font-medium">
                            Admin:
                          </span>{' '}
                          {feedback.reply}

                          {feedback.replyAt && (
                            <div className="text-xs mt-1 opacity-70">
                              {formatDate(
                                feedback.replyAt
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          <div
            className={`text-center py-10 rounded-xl border ${getCardClass()}`}
          >
            <div className="text-5xl mb-3">
              📭
            </div>

            <h3
              className={`text-xl font-semibold ${
                userBackground === 'dark'
                  ? 'text-white'
                  : 'text-gray-900'
              }`}
            >
              No Feedback
            </h3>

            <p
              className={`text-sm mt-1.5 ${
                userBackground === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              {feedbacks.length === 0
                ? 'No feedback submitted yet.'
                : 'No matches found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}