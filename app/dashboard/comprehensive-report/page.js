'use client';

import { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../../lib/firebase';
import { collection, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ComprehensiveReport() {
  const [salesData, setSalesData] = useState([]);
  const [driversData, setDriversData] = useState([]);
  const [fuelStockData, setFuelStockData] = useState({});
  const [importData, setImportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBackground, setUserBackground] = useState('white');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Stats states
  const [totalStats, setTotalStats] = useState({
    revenue: 0,
    litres: 0,
    orders: 0
  });
  const [weeklyStats, setWeeklyStats] = useState({
    revenue: 0,
    litres: 0,
    orders: 0,
    startDate: '',
    endDate: ''
  });
  const [monthlyStats, setMonthlyStats] = useState({
    revenue: 0,
    litres: 0,
    orders: 0,
    startDate: '',
    endDate: ''
  });
  const [yearlyStats, setYearlyStats] = useState({
    revenue: 0,
    litres: 0,
    orders: 0,
    startDate: '',
    endDate: ''
  });
  const [todayStats, setTodayStats] = useState({
    revenue: 0,
    litres: 0,
    orders: 0
  });

  // Daily Activity State
  const [dailyActivities, setDailyActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [dailyDateFrom, setDailyDateFrom] = useState('');
  const [dailyDateTo, setDailyDateTo] = useState('');
  const [filteredDailyActivities, setFilteredDailyActivities] = useState([]);
  const [showDailyFiltered, setShowDailyFiltered] = useState(false);

  // Import Fuel Filter States
  const [importDateFrom, setImportDateFrom] = useState('');
  const [importDateTo, setImportDateTo] = useState('');
  const [filteredImports, setFilteredImports] = useState([]);
  const [showImportFiltered, setShowImportFiltered] = useState(false);

  // Drivers Search State
  const [searchDriverTerm, setSearchDriverTerm] = useState('');
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [isLiveUpdate, setIsLiveUpdate] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  
  // Use ref for unsubscribe to avoid stale closure
  const driversUnsubscribeRef = useRef(null);

  // Date filter states
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filteredSales, setFilteredSales] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showFilteredReport, setShowFilteredReport] = useState(false);

  // Section navigation state
  const [activeSection, setActiveSection] = useState('revenue');

  // Fetch user background
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

  // Update filtered drivers whenever driversData changes
  useEffect(() => {
    if (searchDriverTerm.trim() !== '') {
      const searchTerm = searchDriverTerm.toLowerCase();
      const filtered = driversData.filter(driver => {
        const nameMatch = driver.name?.toLowerCase().includes(searchTerm);
        const phoneMatch = driver.phone?.toLowerCase().includes(searchTerm);
        return nameMatch || phoneMatch;
      });
      setFilteredDrivers(filtered);
    } else {
      setFilteredDrivers(driversData);
    }
  }, [driversData, searchDriverTerm]);

  // Set up real-time listener for driver status changes using useRef
  const setupDriversListener = () => {
    if (driversUnsubscribeRef.current) {
      console.log('🧹 Cleaning up existing listener...');
      driversUnsubscribeRef.current();
      driversUnsubscribeRef.current = null;
    }

    console.log('🔄 Setting up real-time driver listener with useRef...');

    const unsubscribe = onSnapshot(collection(db, 'drivers'), (snapshot) => {
      console.log('📡 Real-time update received! Drivers changed.');
      
      const driversList = [];
      let totalStock = { Petrol: 0, Diesel: 0, Kerosene: 0, 'V-Power': 0 };
      const allSales = [];

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const driverId = doc.id;
        
        driversList.push({ id: driverId, ...data });
        
        if (data.remainingFuel) {
          Object.keys(totalStock).forEach(key => {
            totalStock[key] += data.remainingFuel[key] || 0;
          });
        }

        if (data.salesHistory) {
          data.salesHistory.forEach(sale => {
            allSales.push({
              ...sale,
              driverId: driverId,
              driverName: data.name
            });
          });
        }
      });

      setDriversData(driversList);
      setFuelStockData(totalStock);
      setIsLiveUpdate(true);
      setLastUpdateTime(new Date());
      
      const sortedSales = allSales.sort((a, b) =>
        new Date(b.date) - new Date(a.date)
      );
      setSalesData(sortedSales);
      calculateStats(sortedSales);
      
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      if (selectedDate) {
        filterDailyActivities(sortedSales, selectedDate);
      } else {
        filterDailyActivities(sortedSales, todayStr);
        setSelectedDate(todayStr);
      }

      fetchImports();
      setLoading(false);
      
      const onlineDrivers = driversList.filter(d => d.isOnline === true).length;
      const offlineDrivers = driversList.length - onlineDrivers;
      console.log(`🟢 Online drivers: ${onlineDrivers} | 🔴 Offline drivers: ${offlineDrivers} | Total: ${driversList.length}`);
      
      toast.success(`🔄 Driver status updated: ${onlineDrivers} online, ${offlineDrivers} offline`, { duration: 2000 });
      
    }, (error) => {
      console.error('❌ Error listening to drivers:', error);
      toast.error('Failed to load real-time driver data');
    });

    driversUnsubscribeRef.current = unsubscribe;
    console.log('✅ Real-time driver listener connected!');
  };

  // Fetch imports separately
  const fetchImports = async () => {
    try {
      const importsSnapshot = await getDocs(collection(db, 'fuelImports'));
      const importsList = [];
      importsSnapshot.docs.forEach(doc => {
        importsList.push({ id: doc.id, ...doc.data() });
      });
      const sortedImports = importsList.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
      });
      setImportData(sortedImports);
      setFilteredImports(sortedImports);
    } catch (error) {
      console.log('No fuel imports collection found');
      setImportData([]);
      setFilteredImports([]);
    }
  };

  async function fetchAllData() {
    setLoading(true);
    try {
      const driversSnapshot = await getDocs(collection(db, 'drivers'));
      const driversList = [];
      let totalStock = { Petrol: 0, Diesel: 0, Kerosene: 0, 'V-Power': 0 };
      const allSales = [];

      driversSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const driverId = doc.id;
        driversList.push({ id: driverId, ...data });
        
        if (data.remainingFuel) {
          Object.keys(totalStock).forEach(key => {
            totalStock[key] += data.remainingFuel[key] || 0;
          });
        }

        if (data.salesHistory) {
          data.salesHistory.forEach(sale => {
            allSales.push({
              ...sale,
              driverId: driverId,
              driverName: data.name
            });
          });
        }
      });

      const sortedSales = allSales.sort((a, b) =>
        new Date(b.date) - new Date(a.date)
      );

      setSalesData(sortedSales);
      setDriversData(driversList);
      setFilteredDrivers(driversList);
      setFuelStockData(totalStock);
      calculateStats(sortedSales);
      
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      setSelectedDate(todayStr);
      filterDailyActivities(sortedSales, todayStr);

      await fetchImports();

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  // Initialize data and listener
  useEffect(() => {
    fetchAllData();
    setupDriversListener();
    
    return () => {
      if (driversUnsubscribeRef.current) {
        console.log('🧹 Cleaning up listener on unmount...');
        driversUnsubscribeRef.current();
        driversUnsubscribeRef.current = null;
      }
    };
  }, []);

  function calculateStats(sales) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    const totalLitres = sales.reduce((sum, sale) => sum + (sale.litresSold || 0), 0);
    
    setTotalStats({
      revenue: totalRevenue,
      litres: totalLitres,
      orders: sales.length
    });

    const todaySales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.toDateString() === today.toDateString();
    });

    setTodayStats({
      revenue: todaySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0),
      litres: todaySales.reduce((sum, sale) => sum + (sale.litresSold || 0), 0),
      orders: todaySales.length
    });

    const currentDay = today.getDay();
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weeklySales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= weekStart && saleDate <= weekEnd;
    });

    setWeeklyStats({
      revenue: weeklySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0),
      litres: weeklySales.reduce((sum, sale) => sum + (sale.litresSold || 0), 0),
      orders: weeklySales.length,
      startDate: weekStart.toLocaleDateString(),
      endDate: weekEnd.toLocaleDateString()
    });

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);
    
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);

    const monthlySales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= monthStart && saleDate <= monthEnd;
    });

    setMonthlyStats({
      revenue: monthlySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0),
      litres: monthlySales.reduce((sum, sale) => sum + (sale.litresSold || 0), 0),
      orders: monthlySales.length,
      startDate: monthStart.toLocaleDateString(),
      endDate: monthEnd.toLocaleDateString()
    });

    const yearStart = new Date(today.getFullYear(), 0, 1);
    yearStart.setHours(0, 0, 0, 0);
    
    const yearEnd = new Date(today.getFullYear(), 11, 31);
    yearEnd.setHours(23, 59, 59, 999);

    const yearlySales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= yearStart && saleDate <= yearEnd;
    });

    setYearlyStats({
      revenue: yearlySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0),
      litres: yearlySales.reduce((sum, sale) => sum + (sale.litresSold || 0), 0),
      orders: yearlySales.length,
      startDate: yearStart.toLocaleDateString(),
      endDate: yearEnd.toLocaleDateString()
    });
  }

  // Filter daily activities by date range
  function filterDailyActivitiesByDate() {
    if (!dailyDateFrom && !dailyDateTo) {
      toast.error('Please select a date range');
      return;
    }

    let filtered = [...salesData];

    if (dailyDateFrom) {
      const fromDate = new Date(dailyDateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= fromDate;
      });
    }

    if (dailyDateTo) {
      const toDate = new Date(dailyDateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate <= toDate;
      });
    }

    setFilteredDailyActivities(filtered);
    setShowDailyFiltered(true);

    if (filtered.length === 0) {
      toast('No activities found for the selected date range');
    } else {
      toast.success(`Found ${filtered.length} activities`);
    }
  }

  // Reset daily filter
  const resetDailyFilter = () => {
    setDailyDateFrom('');
    setDailyDateTo('');
    setFilteredDailyActivities([]);
    setShowDailyFiltered(false);
    toast('Daily filter cleared');
  };

  // Filter imports by date range
  function filterImportsByDate() {
    if (!importDateFrom && !importDateTo) {
      toast.error('Please select a date range');
      return;
    }

    let filtered = [...importData];

    if (importDateFrom) {
      const fromDate = new Date(importDateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= fromDate;
      });
    }

    if (importDateTo) {
      const toDate = new Date(importDateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate <= toDate;
      });
    }

    setFilteredImports(filtered);
    setShowImportFiltered(true);

    if (filtered.length === 0) {
      toast('No imports found for the selected date range');
    } else {
      toast.success(`Found ${filtered.length} imports`);
    }
  }

  // Reset import filter
  const resetImportFilter = () => {
    setImportDateFrom('');
    setImportDateTo('');
    setFilteredImports([]);
    setShowImportFiltered(false);
    toast('Import filter cleared');
  };

  // Filter daily activities by single date
  function filterDailyActivities(sales, date) {
    const filtered = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const filterDate = new Date(date);
      return saleDate.toDateString() === filterDate.toDateString();
    });
    setDailyActivities(filtered);
  }

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    filterDailyActivities(salesData, date);
    setShowDailyFiltered(false);
    setFilteredDailyActivities([]);
  };

  // Search drivers
  const handleDriverSearch = (term) => {
    setSearchDriverTerm(term);
  };

  // Filter sales by date range
  const filterSalesByDate = () => {
    if (!dateFrom && !dateTo) {
      toast.error('Please select a date range');
      return;
    }

    setIsFiltering(true);
    try {
      let filtered = [...salesData];

      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= fromDate;
        });
      }

      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate <= toDate;
        });
      }

      setFilteredSales(filtered);
      setShowFilteredReport(true);

      if (filtered.length === 0) {
        toast('No sales found for the selected date range');
      } else {
        toast.success(`Found ${filtered.length} sales transactions`);
      }
    } catch (error) {
      console.error('Error filtering sales:', error);
      toast.error('Failed to filter sales');
    } finally {
      setIsFiltering(false);
    }
  };

  // Reset date filter
  const resetDateFilter = () => {
    setDateFrom('');
    setDateTo('');
    setFilteredSales([]);
    setShowFilteredReport(false);
    toast('Date filter cleared');
  };

  // Handle password verification
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === '1234') {
      setIsAuthenticated(true);
      setPasswordError('');
      toast.success('Access granted');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      toast.error('Incorrect password');
    }
  };

  const sections = [
    { id: 'revenue', label: '📊 Revenue Report' },
    { id: 'daily', label: '📋 Daily Activity' },
    { id: 'import', label: '⛽ Import Fuel' },
    { id: 'stock', label: '🏢 Company Stock' },
    { id: 'drivers', label: '🚛 Drivers' }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'revenue':
        return renderRevenueContent();
      case 'daily':
        return renderDailyActivityContent();
      case 'import':
        return renderImportFuelContent();
      case 'stock':
        return renderCompanyStockContent();
      case 'drivers':
        return renderDriversContent();
      default:
        return renderRevenueContent();
    }
  };

  // Revenue Content
  const renderRevenueContent = () => (
    <div className="space-y-6">
      <div
        className="rounded-xl shadow-lg p-6 border border-purple-200 hover:bg-purple-600 transition-all duration-300"
        style={{ backgroundColor: '#780606' }}
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-purple-100">Total Revenue</p>
        <p className="text-3xl font-bold text-white mt-1">KES {totalStats.revenue.toLocaleString()}</p>
        <div className="flex justify-between text-sm text-purple-100 mt-2">
          <span>{totalStats.litres.toLocaleString()}L Total Litres</span>
          <span>{totalStats.orders} Total Orders</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-xl shadow-lg p-6 border border-orange-200 bg-orange-500 hover:bg-orange-600 transition-all duration-300">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-100">📅 Today</p>
          <p className="text-2xl font-bold text-white mt-1">KES {todayStats.revenue.toLocaleString()}</p>
          <div className="flex justify-between text-sm text-orange-100 mt-2">
            <span>{todayStats.litres.toLocaleString()}L</span>
            <span>{todayStats.orders} orders</span>
          </div>
        </div>

        <div className="rounded-xl shadow-lg p-6 border border-emerald-200 bg-emerald-500 hover:bg-emerald-600 transition-all duration-300">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100">📅 Weekly</p>
          <p className="text-2xl font-bold text-white mt-1">KES {weeklyStats.revenue.toLocaleString()}</p>
          <div className="flex justify-between text-sm text-emerald-100 mt-2">
            <span>{weeklyStats.litres.toLocaleString()}L</span>
            <span>{weeklyStats.orders} orders</span>
          </div>
          <div className="text-xs text-emerald-100 mt-2 opacity-75">
            {weeklyStats.startDate} - {weeklyStats.endDate}
          </div>
        </div>

        <div className="rounded-xl shadow-lg p-6 border border-sky-200 bg-sky-500 hover:bg-sky-600 transition-all duration-300">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-100">📆 Monthly</p>
          <p className="text-2xl font-bold text-white mt-1">KES {monthlyStats.revenue.toLocaleString()}</p>
          <div className="flex justify-between text-sm text-sky-100 mt-2">
            <span>{monthlyStats.litres.toLocaleString()}L</span>
            <span>{monthlyStats.orders} orders</span>
          </div>
          <div className="text-xs text-sky-100 mt-2 opacity-75">
            {monthlyStats.startDate} - {monthlyStats.endDate}
          </div>
        </div>

        <div className="rounded-xl shadow-lg p-6 border border-violet-200 bg-violet-500 hover:bg-violet-600 transition-all duration-300">
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-100">📊 Yearly</p>
          <p className="text-2xl font-bold text-white mt-1">KES {yearlyStats.revenue.toLocaleString()}</p>
          <div className="flex justify-between text-sm text-violet-100 mt-2">
            <span>{yearlyStats.litres.toLocaleString()}L</span>
            <span>{yearlyStats.orders} orders</span>
          </div>
          <div className="text-xs text-violet-100 mt-2 opacity-75">
            {yearlyStats.startDate} - {yearlyStats.endDate}
          </div>
        </div>
      </div>

      <div className="rounded-xl shadow-sm border border-gray-200 bg-white">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">🔍 Custom Date Range Report</h2>
          <p className="text-sm mt-1 text-gray-500">Select a specific date range to view detailed transactions</p>
        </div>

        <div className="p-6 bg-cyan-500">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-red-900 bg-white border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-red-900 bg-white border-gray-300"
              />
            </div>
            <button
              onClick={filterSalesByDate}
              disabled={isFiltering || (!dateFrom && !dateTo)}
              className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition ${isFiltering || (!dateFrom && !dateTo) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isFiltering ? 'Filtering...' : 'Show Report'}
            </button>
            {showFilteredReport && (
              <button
                onClick={resetDateFilter}
                className="px-6 py-2 text-sm font-medium rounded-lg transition text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {showFilteredReport && (
        <div className="rounded-xl shadow-sm border border-gray-200 bg-white">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-semibold text-gray-900">
                Filtered Results
                <span className="text-sm font-normal ml-2 text-gray-500">
                  ({filteredSales.length} transactions)
                </span>
              </h3>
              {filteredSales.length > 0 && (
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-600">
                    Revenue: <span className="font-bold text-green-600">KES {filteredSales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0).toLocaleString()}</span>
                  </span>
                  <span className="text-gray-600">
                    Litres: <span className="font-bold text-blue-600">{filteredSales.reduce((sum, sale) => sum + (sale.litresSold || 0), 0).toLocaleString()}L</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fuel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Litres</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No sales found for the selected date range
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.date ? new Date(sale.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.driverName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.fuelType || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.litresSold}L</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        KES {sale.totalAmount?.toLocaleString() || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // Daily Activity Content
  const renderDailyActivityContent = () => {
    const today = new Date().toISOString().split('T')[0];
    const displayDate = selectedDate || today;
    const activitiesToShow = showDailyFiltered ? filteredDailyActivities : dailyActivities;

    return (
      <div className="rounded-xl shadow-sm border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-semibold text-gray-900">📋 Daily Activity</h2>
          <button
            onClick={() => setActiveSection('revenue')}
            className="px-4 py-1.5 text-sm font-medium rounded-lg transition bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            ← Back
          </button>
        </div>

        <div className="p-4 rounded-lg mb-6 bg-cyan-500">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Date From</label>
              <input
                type="date"
                value={dailyDateFrom}
                onChange={(e) => setDailyDateFrom(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-red-900 bg-white border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Date To</label>
              <input
                type="date"
                value={dailyDateTo}
                onChange={(e) => setDailyDateTo(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-red-900 bg-white border-gray-300"
              />
            </div>
            <button
              onClick={filterDailyActivitiesByDate}
              disabled={!dailyDateFrom && !dailyDateTo}
              className={`px-4 py-1.5 text-sm font-medium text-white rounded-lg transition ${!dailyDateFrom && !dailyDateTo ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Filter Range
            </button>
            {showDailyFiltered && (
              <button
                onClick={resetDailyFilter}
                className="px-4 py-1.5 text-sm font-medium rounded-lg transition text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-blue-700">Or select single date:</span>
            <input
              type="date"
              value={displayDate}
              onChange={handleDateChange}
              className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-red-900 bg-white border-gray-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-blue-500">
            <p className="text-sm text-gray-900">Total Revenue</p>
            <p className="text-xl font-bold text-gray-900">
              KES {activitiesToShow.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0).toLocaleString()}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-green-500">
            <p className="text-sm text-gray-900">Total Litres</p>
            <p className="text-xl font-bold text-gray-900">
              {activitiesToShow.reduce((sum, sale) => sum + (sale.litresSold || 0), 0).toLocaleString()}L
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500">
            <p className="text-sm text-gray-900">Total Orders</p>
            <p className="text-xl font-bold text-gray-900">{activitiesToShow.length}</p>
          </div>
        </div>

        {activitiesToShow.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100">Driver</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100">Fuel Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100">Litres</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activitiesToShow.map((sale, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{sale.driverName || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{sale.fuelType || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{sale.litresSold}L</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">KES {sale.totalAmount?.toLocaleString() || 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {sale.date ? new Date(sale.date).toLocaleTimeString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center rounded-lg bg-gray-50">
            <p className="text-lg text-gray-500">No activities found</p>
            <p className="text-sm mt-1 text-gray-400">
              {showDailyFiltered ? 'No activities in the selected date range' : 'Select a date to view activities'}
            </p>
          </div>
        )}
      </div>
    );
  };

  // ✅ UPDATED: Import Fuel Content with litres and cost clearly shown
  const renderImportFuelContent = () => {
    const sortedImports = [...importData].sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0);
      const dateB = b.date ? new Date(b.date) : new Date(0);
      return dateB - dateA;
    });

    const getFilteredImports = () => {
      let filtered = [...sortedImports];
      if (showImportFiltered) {
        if (importDateFrom) {
          const fromDate = new Date(importDateFrom);
          fromDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= fromDate;
          });
        }
        if (importDateTo) {
          const toDate = new Date(importDateTo);
          toDate.setHours(23, 59, 59, 999);
          filtered = filtered.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate <= toDate;
          });
        }
      }
      return filtered;
    };

    const importsToShow = showImportFiltered ? getFilteredImports() : sortedImports;

    // Calculate total litres and total cost
    const totalLitres = importsToShow.reduce((sum, item) => sum + (item.litres || item.quantity || 0), 0);
    const totalCost = importsToShow.reduce((sum, item) => sum + (item.totalCost || item.cost || 0), 0);

    return (
      <div className="rounded-xl shadow-sm border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-semibold text-gray-900">⛽ Import Fuel History</h2>
          <button
            onClick={() => setActiveSection('revenue')}
            className="px-4 py-1.5 text-sm font-medium rounded-lg transition bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            ← Back
          </button>
        </div>

        <div className="p-4 rounded-lg mb-6 bg-cyan-500">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Date From</label>
              <input
                type="date"
                value={importDateFrom}
                onChange={(e) => setImportDateFrom(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-red-900 bg-white border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Date To</label>
              <input
                type="date"
                value={importDateTo}
                onChange={(e) => setImportDateTo(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-red-900 bg-white border-gray-300"
              />
            </div>
            <button
              onClick={filterImportsByDate}
              disabled={!importDateFrom && !importDateTo}
              className={`px-4 py-1.5 text-sm font-medium text-white rounded-lg transition ${!importDateFrom && !importDateTo ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Filter
            </button>
            {showImportFiltered && (
              <button
                onClick={resetImportFilter}
                className="px-4 py-1.5 text-sm font-medium rounded-lg transition text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Showing {importsToShow.length} records (newest first)
          </div>
        </div>

        {/* ✅ ADDED: Summary cards for total litres and total cost */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-blue-200 border border-blue-200">
            <p className="text-sm text-gray-600">📊 Total Litres Imported</p>
            <p className="text-2xl font-bold text-blue-700">{totalLitres.toLocaleString()}L</p>
          </div>
          <div className="p-4 rounded-lg bg-green-200 border border-green-200">
            <p className="text-sm text-gray-600">💰 Total Cost</p>
            <p className="text-2xl font-bold text-green-700">KES {totalCost.toLocaleString()}</p>
          </div>
        </div>

        {importsToShow.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100">Fuel Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100">Quantity (L)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100">Cost (KES)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100">Supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {importsToShow.map((item, index) => {
                  // Get litres from either field
                  const litres = item.litres || item.quantity || 0;
                  // Get cost from either field
                  const cost = item.totalCost || item.cost || 0;
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.fuelType || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-blue-700">{litres.toLocaleString()}L</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-700">KES {cost.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.supplier || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center rounded-lg bg-gray-50">
            <p className="text-lg text-gray-500">
              {showImportFiltered ? 'No imports found for the selected date range' : 'No fuel import records found'}
            </p>
            <p className="text-sm mt-1 text-gray-400">
              {showImportFiltered ? 'Try adjusting your date range' : 'Import records will appear here when fuel is imported'}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Company Stock Content
  const renderCompanyStockContent = () => {
    const stockItems = Object.entries(fuelStockData);
    const totalFuel = stockItems.reduce((sum, [_, value]) => sum + value, 0);

    return (
      <div className="rounded-xl shadow-sm border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">🏢 Company Fuel Stock</h2>
          <button
            onClick={() => setActiveSection('revenue')}
            className="px-4 py-1.5 text-sm font-medium rounded-lg transition bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            ← Back
          </button>
        </div>

        <div className="p-4 rounded-lg mb-6 bg-cyan-500">
          <p className="text-sm text-gray-500">Total Fuel in Stock</p>
          <p className="text-2xl font-bold text-gray-900">{totalFuel.toLocaleString()}L</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stockItems.map(([fuelType, quantity]) => (
            <div key={fuelType} className="p-4 rounded-lg bg-green-700 border border-gray-200">
              <p className="text-sm font-medium text-gray-300">{fuelType}</p>
              <p className="text-xl font-bold text-gray-900">{quantity.toLocaleString()}L</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 rounded-full h-2 transition-all duration-500" 
                  style={{ width: `${totalFuel > 0 ? (quantity / totalFuel) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Drivers Content
  const renderDriversContent = () => {
    const driversToShow = filteredDrivers;

    const getDriverStatus = (driver) => {
      if (driver.isOnline !== undefined && driver.isOnline !== null) {
        return driver.isOnline ? 'Online' : 'Offline';
      }
      if (driver.status) {
        return driver.status === 'online' ? 'Online' : 'Offline';
      }
      return 'Offline';
    };

    const onlineCount = driversToShow.filter(d => getDriverStatus(d) === 'Online').length;
    const offlineCount = driversToShow.filter(d => getDriverStatus(d) === 'Offline').length;

    return (
      <div className="rounded-xl shadow-sm border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-semibold text-gray-900">🚛 Drivers List</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs flex items-center gap-1 text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block"></span>
              {isLiveUpdate ? 'Live' : 'Connected'}
            </span>
            <span className="text-xs text-gray-500">Updated: {lastUpdateTime.toLocaleTimeString()}</span>
            <button
              onClick={() => setActiveSection('revenue')}
              className="px-4 py-1.5 text-sm font-medium rounded-lg transition bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              ← Back
            </button>
          </div>
        </div>

        <div className="p-2 rounded-lg mb-4 text-center text-xs bg-green-50 text-green-700">
          🔄 Real-time driver status updates active - Status changes appear instantly
          {isLiveUpdate && (
            <span className="ml-2 inline-block">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block mr-1"></span>
              Live
            </span>
          )}
        </div>

        <div className="p-4 rounded-lg mb-6 bg-gray-50">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Search Driver</label>
              <input
                type="text"
                value={searchDriverTerm}
                onChange={(e) => handleDriverSearch(e.target.value)}
                placeholder="Search by name or phone number..."
                className="w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white border-gray-300"
              />
            </div>
            <div className="text-sm">
              <span className="text-gray-500">
                Found: <span className="font-bold">{driversToShow.length}</span> drivers
              </span>
            </div>
            {searchDriverTerm && (
              <button
                onClick={() => {
                  setSearchDriverTerm('');
                  setFilteredDrivers(driversData);
                }}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-gray-300">
            <p className="text-sm text-gray-500">🟢 Online Drivers</p>
            <p className="text-2xl font-bold text-green-600">{onlineCount}</p>
          </div>
          <div className="p-4 rounded-lg bg-red-200">
            <p className="text-sm text-gray-500">🔴 Offline Drivers</p>
            <p className="text-2xl font-bold text-red-600">{offlineCount}</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-300">
            <p className="text-sm text-gray-500">Total Drivers</p>
            <p className="text-2xl font-bold text-gray-900">{driversToShow.length}</p>
          </div>
        </div>

        {driversToShow.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200">Driver Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200">Vehicle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200">Total Sales</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {driversToShow.map((driver) => {
                  const totalSales = driver.salesHistory 
                    ? driver.salesHistory.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0) 
                    : 0;
                  const status = getDriverStatus(driver);
                  const isOnline = status === 'Online';
                  
                  return (
                    <tr key={driver.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{driver.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{driver.phone || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{driver.vehicle || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">KES {totalSales.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                          isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                          {isOnline ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {driver.lastUpdated ? new Date(driver.lastUpdated).toLocaleTimeString() : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center rounded-lg bg-gray-50">
            <p className="text-lg text-gray-500">
              {searchDriverTerm ? 'No drivers match your search' : 'No drivers found'}
            </p>
            <p className="text-sm mt-1 text-gray-400">
              {searchDriverTerm ? 'Try a different search term' : 'Drivers will appear here when they are added'}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900">Secure Access Required</h2>
            <p className="text-sm mt-2 text-gray-500">Please enter the password to access the comprehensive report</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Unlock Report
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">📈 Comprehensive Report</h1>
              <p className="text-sm mt-1 text-gray-500">Weekly, Monthly, and Yearly revenue analysis</p>
            </div>
            <Link href="/reports" className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
              <span>←</span>
              <span>Back to Reports</span>
            </Link>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Dynamic Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}