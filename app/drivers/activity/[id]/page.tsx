'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '../../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface Driver {
  id: string;
  name: string;
  isOnline: boolean;
  status: string;
  lastUpdate: any;
  onlineHistory?: Array<{ timestamp: any; date: string; time: string }>;
  offlineHistory?: Array<{ timestamp: any; date: string; time: string }>;
}

interface ActivitySummary {
  onlineCount: number;
  offlineCount: number;
  totalOnlineMinutes: number;
  totalOfflineMinutes: number;
  efficiency?: number;
}

export default function DriverActivityPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [activityData, setActivityData] = useState({
    today: { onlineCount: 0, offlineCount: 0, totalOnlineMinutes: 0, totalOfflineMinutes: 0, efficiency: 0 },
    week: { onlineCount: 0, offlineCount: 0, totalOnlineMinutes: 0, totalOfflineMinutes: 0, efficiency: 0 },
    month: { onlineCount: 0, offlineCount: 0, totalOnlineMinutes: 0, totalOfflineMinutes: 0, efficiency: 0 }
  });

  useEffect(() => {
    fetchDriverActivity();
  }, [params.id]);

  /**
   * Get the start of day for a given date
   */
  const getStartOfDay = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  };

  /**
   * Calculate the duration between two timestamps in minutes
   */
  const calculateDuration = (start: any, end: any): number => {
    if (!start || !end) return 0;
    
    try {
      const startDate = start.toDate ? start.toDate() : new Date(start);
      const endDate = end.toDate ? end.toDate() : new Date(end);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 0;
      }
      
      const diffMs = endDate.getTime() - startDate.getTime();
      return Math.max(0, Math.floor(diffMs / 60000));
    } catch (error) {
      console.error('Error calculating duration:', error);
      return 0;
    }
  };

  /**
   * Get the timestamp from Firestore or Date object
   */
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

  /**
   * Check if a date falls within a period
   */
  const isDateInPeriod = (date: Date, period: 'today' | 'week' | 'month'): boolean => {
    const now = new Date();
    const periodStart = new Date(now);
    
    if (period === 'today') {
      periodStart.setHours(0, 0, 0, 0);
      const todayStart = getStartOfDay(now);
      return date >= todayStart && date <= now;
    } else if (period === 'week') {
      periodStart.setDate(periodStart.getDate() - 7);
      periodStart.setHours(0, 0, 0, 0);
      return date >= periodStart && date <= now;
    } else {
      periodStart.setDate(periodStart.getDate() - 30);
      periodStart.setHours(0, 0, 0, 0);
      return date >= periodStart && date <= now;
    }
  };

  /**
   * Calculate activity summary for a given period
   */
  const calculateActivityForPeriod = (
    history: Array<{ timestamp: any; status: string }>,
    period: 'today' | 'week' | 'month',
    currentStatus: boolean
  ): ActivitySummary => {
    if (!history || history.length === 0) {
      return { onlineCount: 0, offlineCount: 0, totalOnlineMinutes: 0, totalOfflineMinutes: 0, efficiency: 0 };
    }

    let onlineCount = 0;
    let offlineCount = 0;
    let totalOnlineMinutes = 0;
    let totalOfflineMinutes = 0;

    // Sort history by timestamp
    const sortedHistory = [...history].sort((a, b) => {
      const aTime = getTimestamp(a.timestamp)?.getTime() || 0;
      const bTime = getTimestamp(b.timestamp)?.getTime() || 0;
      return aTime - bTime;
    });

    // Process each event
    for (let i = 0; i < sortedHistory.length; i++) {
      const current = sortedHistory[i];
      const currentTime = getTimestamp(current.timestamp);
      
      if (!currentTime) continue;

      // Skip if this event is outside the period
      if (!isDateInPeriod(currentTime, period)) {
        continue;
      }

      // Count the event itself
      if (current.status === 'online') {
        onlineCount++;
      } else if (current.status === 'offline') {
        offlineCount++;
      }

      // Calculate duration until next event or current time
      let endTime = new Date();
      let nextEvent: any = null;
      
      // Find the next event after this one
      for (let j = i + 1; j < sortedHistory.length; j++) {
        const nextTime = getTimestamp(sortedHistory[j].timestamp);
        if (nextTime && nextTime > currentTime) {
          nextEvent = sortedHistory[j];
          break;
        }
      }

      // Use next event time or current time
      if (nextEvent) {
        endTime = getTimestamp(nextEvent.timestamp) || new Date();
      } else {
        // If no next event, check if driver is currently in this status
        if (current.status === 'online' && currentStatus) {
          endTime = new Date(); // Driver is still online
        } else if (current.status === 'offline' && !currentStatus) {
          endTime = new Date(); // Driver is still offline
        } else {
          // Use event time as end time (duration of 0)
          endTime = currentTime;
        }
      }

      // Calculate duration
      const durationMinutes = calculateDuration(currentTime, endTime);
      
      if (durationMinutes > 0) {
        if (current.status === 'online') {
          totalOnlineMinutes += durationMinutes;
        } else if (current.status === 'offline') {
          totalOfflineMinutes += durationMinutes;
        }
      }
    }

    // Calculate efficiency (based on 8-hour target)
    const targetMinutes = 480; // 8 hours
    let efficiency = 0;
    if (totalOnlineMinutes > 0) {
      efficiency = Math.min(100, (totalOnlineMinutes / targetMinutes) * 100);
    }

    return {
      onlineCount,
      offlineCount,
      totalOnlineMinutes,
      totalOfflineMinutes,
      efficiency: Math.round(efficiency)
    };
  };

  const fetchDriverActivity = async () => {
    try {
      setLoading(true);
      
      // Fetch driver data
      const docRef = doc(db, 'drivers', params.id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        toast.error('Driver not found');
        router.push('/drivers');
        return;
      }

      const data = docSnap.data();
      setDriver({ id: docSnap.id, ...data } as Driver);

      // Combine all history into a single sorted array
      const allHistory: Array<{ timestamp: any; status: string }> = [];
      
      // Add online history
      if (data.onlineHistory && Array.isArray(data.onlineHistory)) {
        data.onlineHistory.forEach((entry: any) => {
          allHistory.push({
            timestamp: entry.timestamp || entry.date,
            status: 'online'
          });
        });
      }
      
      // Add offline history
      if (data.offlineHistory && Array.isArray(data.offlineHistory)) {
        data.offlineHistory.forEach((entry: any) => {
          allHistory.push({
            timestamp: entry.timestamp || entry.date,
            status: 'offline'
          });
        });
      }

      // Sort all history by timestamp
      allHistory.sort((a, b) => {
        const aTime = getTimestamp(a.timestamp)?.getTime() || 0;
        const bTime = getTimestamp(b.timestamp)?.getTime() || 0;
        return aTime - bTime;
      });

      // Calculate for different periods
      const currentStatus = data.isOnline || false;
      
      const today = calculateActivityForPeriod(allHistory, 'today', currentStatus);
      const week = calculateActivityForPeriod(allHistory, 'week', currentStatus);
      const month = calculateActivityForPeriod(allHistory, 'month', currentStatus);

      setActivityData({
        today,
        week,
        month
      });

    } catch (error) {
      console.error('Error fetching driver activity:', error);
      toast.error('Failed to load driver activity');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number): string => {
    if (minutes <= 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'N/A';
    const date = getTimestamp(timestamp);
    if (!date) return 'N/A';
    return date.toLocaleString();
  };

  const getStatusColor = (isOnline: boolean): string => {
    return isOnline ? 'bg-green-500' : 'bg-gray-400';
  };

  const getStatusText = (isOnline: boolean): string => {
    return isOnline ? '🟢 Online' : '⚪ Offline';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Driver not found</p>
        <Link href="/drivers" className="text-blue-500 hover:underline mt-2 inline-block">
          Back to Drivers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Activity</h1>
          <p className="text-sm text-gray-500">
            {driver.name} - Online/Offline Activity Tracking
          </p>
        </div>
        <div className="flex space-x-3">
          <Link 
            href={`/drivers/edit/${params.id}`}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>✏️</span>
            <span>Edit Driver</span>
          </Link>
          <Link 
            href="/drivers" 
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            <span>←</span>
            <span>Back to Drivers</span>
          </Link>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${getStatusColor(driver.isOnline)} ${driver.isOnline ? 'animate-pulse' : ''}`}></div>
            <div>
              <h2 className="text-lg font-semibold">
                {getStatusText(driver.isOnline)}
              </h2>
              <p className="text-sm text-gray-500">
                Status: {driver.status || 'Unknown'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last Update</p>
            <p className="text-sm font-medium">
              {driver.lastUpdate ? formatDate(driver.lastUpdate) : 'Never'}
            </p>
          </div>
        </div>
      </div>

      {/* Activity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Today</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">🟢 Online</span>
              <span className="text-sm font-medium text-green-600">
                {activityData.today.onlineCount} times
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">⚪ Offline</span>
              <span className="text-sm font-medium text-red-600">
                {activityData.today.offlineCount} times
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-700">Total Online</span>
              <span className="text-sm font-bold text-green-600">
                {formatDuration(activityData.today.totalOnlineMinutes)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Total Offline</span>
              <span className="text-sm font-bold text-red-600">
                {formatDuration(activityData.today.totalOfflineMinutes)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-700">Efficiency</span>
              <span className="text-sm font-bold text-blue-600">
                {activityData.today.efficiency || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-4">This Week</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">🟢 Online</span>
              <span className="text-sm font-medium text-green-600">
                {activityData.week.onlineCount} times
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">⚪ Offline</span>
              <span className="text-sm font-medium text-red-600">
                {activityData.week.offlineCount} times
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-700">Total Online</span>
              <span className="text-sm font-bold text-green-600">
                {formatDuration(activityData.week.totalOnlineMinutes)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Total Offline</span>
              <span className="text-sm font-bold text-red-600">
                {formatDuration(activityData.week.totalOfflineMinutes)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-700">Efficiency</span>
              <span className="text-sm font-bold text-blue-600">
                {activityData.week.efficiency || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-4">This Month</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">🟢 Online</span>
              <span className="text-sm font-medium text-green-600">
                {activityData.month.onlineCount} times
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">⚪ Offline</span>
              <span className="text-sm font-medium text-red-600">
                {activityData.month.offlineCount} times
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-700">Total Online</span>
              <span className="text-sm font-bold text-green-600">
                {formatDuration(activityData.month.totalOnlineMinutes)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Total Offline</span>
              <span className="text-sm font-bold text-red-600">
                {formatDuration(activityData.month.totalOfflineMinutes)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-700">Efficiency</span>
              <span className="text-sm font-bold text-blue-600">
                {activityData.month.efficiency || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Online Time</p>
          <p className="text-2xl font-bold text-green-600">
            {formatDuration(activityData.today.totalOnlineMinutes + activityData.week.totalOnlineMinutes + activityData.month.totalOnlineMinutes)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Offline Time</p>
          <p className="text-2xl font-bold text-red-600">
            {formatDuration(activityData.today.totalOfflineMinutes + activityData.week.totalOfflineMinutes + activityData.month.totalOfflineMinutes)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Current Status</p>
          <p className="text-2xl font-bold">
            {driver.isOnline ? '🟢 Online' : '⚪ Offline'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Average Efficiency</p>
          <p className="text-2xl font-bold text-blue-600">
            {Math.round((activityData.today.efficiency + activityData.week.efficiency + activityData.month.efficiency) / 3)}%
          </p>
        </div>
      </div>

      {/* Detailed Activity History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Activity History</h3>
          <p className="text-sm text-gray-500">All online/offline events in chronological order</p>
        </div>
        <div className="p-6">
          <div className="max-h-96 overflow-y-auto">
            {(() => {
              // Combine and sort history
              const allEvents: Array<{ timestamp: any; status: string; date: string; time: string }> = [
                ...(driver.onlineHistory || []).map(h => ({ ...h, status: 'online' })),
                ...(driver.offlineHistory || []).map(h => ({ ...h, status: 'offline' }))
              ];
              
              allEvents.sort((a, b) => {
                const aTime = getTimestamp(a.timestamp)?.getTime() || 0;
                const bTime = getTimestamp(b.timestamp)?.getTime() || 0;
                return bTime - aTime; // Newest first
              });

              if (allEvents.length === 0) {
                return (
                  <p className="text-center text-gray-500 py-8">No activity recorded yet</p>
                );
              }

              return allEvents.slice(0, 50).map((entry, index) => {
                const timestamp = getTimestamp(entry.timestamp);
                const isOnline = entry.status === 'online';
                
                return (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-3">
                      <span className={isOnline ? 'text-green-500' : 'text-red-500'}>
                        {isOnline ? '🟢' : '⚪'}
                      </span>
                      <span className="text-sm font-medium">
                        {isOnline ? 'Went Online' : 'Went Offline'}
                      </span>
                      {!entry.date && !entry.time && (
                        <span className="text-xs text-gray-400">
                          {timestamp ? formatDate(timestamp) : ''}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {entry.date && entry.time ? `${entry.date} at ${entry.time}` : 
                       timestamp ? formatDate(timestamp) : 'N/A'}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-end space-x-3">
        <Link
          href={`/drivers/edit/${params.id}`}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          Edit Driver
        </Link>
        <Link
          href="/drivers"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
}