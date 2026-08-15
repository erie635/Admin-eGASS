'use client';

import { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../../lib/firebase';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Link from 'next/link';


// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Safely convert Firestore Timestamp / Date / string to Date
const toSafeDate = (value) => {
  if (!value) return null;

  try {
    // Firestore Timestamp
    if (typeof value?.toDate === 'function') {
      const date = value.toDate();

      return date instanceof Date && !isNaN(date.getTime())
        ? date
        : null;
    }

    // JavaScript Date
    if (value instanceof Date) {
      return !isNaN(value.getTime()) ? value : null;
    }

    // String / number
    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  } catch (error) {
    console.error('Error converting date:', error);
    return null;
  }
};


// Safely convert numeric Firestore values
const toSafeNumber = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const cleaned = value.replace(/,/g, '').trim();
    const parsed = Number(cleaned);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};


export default function SalesReport() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalStats, setTotalStats] = useState({
    totalRevenue: 0,
    totalLitres: 0,
    totalOrders: 0
  });

  const [userBackground, setUserBackground] = useState('white');


  // States for pagination and filtering
  const [showAllSales, setShowAllSales] = useState(false);
  const [filteredSales, setFilteredSales] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);


  // Ref to store unsubscribe function for cleanup
  const unsubscribeRef = useRef(null);


  // ============================================================
  // FETCH USER BACKGROUND
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
        console.error('Error fetching user background:', error);
      }
    };

    fetchUserBackground();
  }, []);


  // ============================================================
  // REAL-TIME SALES LISTENER
  // ============================================================

  useEffect(() => {
    setLoading(true);

    const driversCollection = collection(db, 'drivers');

    const unsubscribe = onSnapshot(
      driversCollection,
      (snapshot) => {
        const allSales = [];


        // --------------------------------------------------------
        // READ SALES HISTORY FROM EVERY DRIVER
        // --------------------------------------------------------

        snapshot.docs.forEach((driverDoc) => {
          const data = driverDoc.data();

          if (
            Array.isArray(data.salesHistory) &&
            data.salesHistory.length > 0
          ) {
            data.salesHistory.forEach((sale) => {
              allSales.push({
                ...sale,

                // Firebase document ID is kept internally
                driverId: driverDoc.id,

                // Driver name
                driverName:
                  data.name ||
                  sale.driverName ||
                  'Unknown Driver'
              });
            });
          }
        });


        // --------------------------------------------------------
        // SORT ALL SALES BY DATE - NEWEST FIRST
        // --------------------------------------------------------

        const sortedSales = allSales.sort((a, b) => {
          const dateA = toSafeDate(a.date);
          const dateB = toSafeDate(b.date);

          const timeA = dateA ? dateA.getTime() : 0;
          const timeB = dateB ? dateB.getTime() : 0;

          return timeB - timeA;
        });


        // --------------------------------------------------------
        // DO NOT LIMIT THE DATA HERE
        //
        // ALL SALES ARE KEPT IN MEMORY.
        //
        // The table itself only displays 10 initially.
        // --------------------------------------------------------


        // --------------------------------------------------------
        // CALCULATE TOTAL REVENUE
        // --------------------------------------------------------

        const totalRevenue = sortedSales.reduce(
          (sum, sale) => {
            return sum + toSafeNumber(sale.totalAmount);
          },
          0
        );


        // --------------------------------------------------------
        // CALCULATE TOTAL LITRES
        // --------------------------------------------------------

        const totalLitres = sortedSales.reduce(
          (sum, sale) => {
            return sum + toSafeNumber(sale.litresSold);
          },
          0
        );


        // --------------------------------------------------------
        // TOTAL ORDERS
        // --------------------------------------------------------

        const totalOrders = sortedSales.length;


        // --------------------------------------------------------
        // UPDATE STATE
        // --------------------------------------------------------

        setTotalStats({
          totalRevenue,
          totalLitres,
          totalOrders
        });

        setSalesData(sortedSales);
        setFilteredSales(sortedSales);

        setLoading(false);
      },
      (error) => {
        console.error(
          'Error in real-time sales data listener:',
          error
        );

        toast.error('Failed to load sales data');

        setLoading(false);
      }
    );


    unsubscribeRef.current = unsubscribe;


    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);


  // ============================================================
  // FILTER SALES BY DATE
  // ============================================================

  const filterSalesByDate = () => {
    setIsFiltering(true);

    try {
      let filtered = [...salesData];


      // --------------------------------------------------------
      // DATE FROM
      // --------------------------------------------------------

      if (dateFrom) {
        const fromDate = new Date(`${dateFrom}T00:00:00`);

        filtered = filtered.filter((entry) => {
          const entryDate = toSafeDate(entry.date);

          if (!entryDate) return false;

          return entryDate.getTime() >= fromDate.getTime();
        });
      }


      // --------------------------------------------------------
      // DATE TO
      // --------------------------------------------------------

      if (dateTo) {
        const toDate = new Date(`${dateTo}T23:59:59.999`);

        filtered = filtered.filter((entry) => {
          const entryDate = toSafeDate(entry.date);

          if (!entryDate) return false;

          return entryDate.getTime() <= toDate.getTime();
        });
      }


      // --------------------------------------------------------
      // SORT FILTERED RESULTS
      // --------------------------------------------------------

      filtered.sort((a, b) => {
        const dateA = toSafeDate(a.date);
        const dateB = toSafeDate(b.date);

        const timeA = dateA ? dateA.getTime() : 0;
        const timeB = dateB ? dateB.getTime() : 0;

        return timeB - timeA;
      });


      setFilteredSales(filtered);


      if (filtered.length === 0) {
        toast('No sales found for the selected date range');
      } else {
        toast.success(
          `Found ${filtered.length} sales transactions`
        );
      }

    } catch (error) {
      console.error('Error filtering sales:', error);

      toast.error('Failed to filter sales');

    } finally {
      setIsFiltering(false);
    }
  };


  // ============================================================
  // RESET DATE FILTER
  // ============================================================

  const resetDateFilter = () => {
    setDateFrom('');
    setDateTo('');

    setFilteredSales(salesData);

    toast('Date filter cleared');
  };


  // ============================================================
  // TOGGLE SHOW ALL SALES
  // ============================================================

  const toggleShowAllSales = () => {
    const newShowAllState = !showAllSales;

    setShowAllSales(newShowAllState);

    if (newShowAllState) {
      if (dateFrom || dateTo) {
        filterSalesByDate();
      } else {
        setFilteredSales(salesData);
      }
    }
  };


  // ============================================================
  // GET DISPLAY SALES
  // ============================================================

  const getDisplaySales = () => {
    const sales = showAllSales
      ? filteredSales
      : salesData;

    return showAllSales
      ? sales
      : sales.slice(0, 10);
  };


  const displaySales = getDisplaySales();

  const hasMoreSales = salesData.length > 10;


  // ============================================================
  // BACKGROUND CLASS
  // ============================================================

  const getBackgroundClass = () => {
    switch (userBackground) {
      case 'dark':
        return 'bg-gray-900 text-white';

      case 'skyblue':
        return 'bg-gradient-to-br from-blue-100 to-blue-300';

      case 'gray':
        return 'bg-gray-200';

      default:
        return 'bg-gray-100';
    }
  };


  // ============================================================
  // CARD CLASS
  // ============================================================

  const getCardClass = () => {
    switch (userBackground) {
      case 'dark':
        return 'bg-gray-800/95 border-gray-700';

      case 'skyblue':
        return 'bg-white/90 backdrop-blur-sm shadow-lg';

      case 'gray':
        return 'bg-white shadow-lg';

      default:
        return 'bg-white shadow-lg';
    }
  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${getBackgroundClass()}`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }


  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      className={`min-h-screen p-4 md:p-6 transition-colors duration-300 ${getBackgroundClass()}`}
    >
      <div className="max-w-7xl mx-auto">

        <div className="space-y-6">

          {/* HEADER */}

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-2xl font-bold">
                Sales Report
              </h1>

              <p
                className={`text-sm mt-1 ${
                  userBackground === 'dark'
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                View all sales transactions
              </p>
            </div>

            <Link
              href="/reports"
              className={`text-sm ${
                userBackground === 'dark'
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              } flex items-center space-x-1`}
            >
              <span>←</span>
              <span>Back to Reports</span>
            </Link>

          </div>


          {/* SUMMARY CARDS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* TOTAL REVENUE */}

            <div
              className={`rounded-xl shadow-lg p-6 border ${
                userBackground === 'dark'
                  ? 'border-emerald-800'
                  : 'border-emerald-200'
              } ${getCardClass()} bg-emerald-500 dark:bg-emerald-900 hover:bg-emerald-600 dark:hover:bg-emerald-800 transition-all duration-300`}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100 dark:text-emerald-300">
                Total Revenue
              </p>

              <p className="text-3xl font-bold text-white dark:text-emerald-100 mt-1">
                KES {totalStats.totalRevenue.toLocaleString()}
              </p>
            </div>


            {/* TOTAL LITRES */}

            <div
              className={`rounded-xl shadow-lg p-6 border ${
                userBackground === 'dark'
                  ? 'border-sky-800'
                  : 'border-sky-200'
              } ${getCardClass()} bg-sky-500 dark:bg-sky-900 hover:bg-sky-600 dark:hover:bg-sky-800 transition-all duration-300`}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-sky-100 dark:text-sky-300">
                Total Litres Sold
              </p>

              <p className="text-3xl font-bold text-white dark:text-sky-100 mt-1">
                {totalStats.totalLitres.toLocaleString()}L
              </p>
            </div>


            {/* TOTAL ORDERS */}

            <div
              className={`rounded-xl shadow-lg p-6 border ${
                userBackground === 'dark'
                  ? 'border-violet-800'
                  : 'border-violet-200'
              } ${getCardClass()} bg-violet-500 dark:bg-violet-900 hover:bg-violet-600 dark:hover:bg-violet-800 transition-all duration-300`}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-violet-100 dark:text-violet-300">
                Total Orders
              </p>

              <p className="text-3xl font-bold text-white dark:text-violet-100 mt-1">
                {totalStats.totalOrders}
              </p>
            </div>

          </div>


          {/* SALES HISTORY */}

          <div
            className={`rounded-xl shadow-sm border ${
              userBackground === 'dark'
                ? 'border-gray-700'
                : 'border-gray-200'
            } ${getCardClass()}`}
          >

            {/* SALES HEADER */}

            <div
              className={`p-6 border-b ${
                userBackground === 'dark'
                  ? 'border-gray-700'
                  : 'border-gray-200'
              }`}
            >

              <div className="flex items-center justify-between">

                <h2
                  className={`text-lg font-semibold ${
                    userBackground === 'dark'
                      ? 'text-white'
                      : 'text-gray-900'
                  }`}
                >
                  Sales History

                  <span
                    className={`text-sm font-normal ml-2 ${
                      userBackground === 'dark'
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}
                  >
                    (
                    {showAllSales
                      ? filteredSales.length
                      : Math.min(10, salesData.length)}
                    {' '}of{' '}
                    {salesData.length}
                    {' '}transactions)
                  </span>

                </h2>


                {hasMoreSales && (
                  <button
                    onClick={toggleShowAllSales}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
                  >
                    {showAllSales
                      ? 'Show Less'
                      : 'See All Transactions'}
                  </button>
                )}

              </div>

            </div>


            {/* DATE FILTER */}

            {showAllSales && (
              <div
                className={`p-4 border-b ${
                  userBackground === 'dark'
                    ? 'border-gray-700 bg-gray-800/50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >

                <div className="flex flex-wrap items-end gap-3">

                  {/* DATE FROM */}

                  <div>

                    <label
                      className={`block text-xs font-medium ${
                        userBackground === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-700'
                      } mb-1`}
                    >
                      Date From
                    </label>

                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) =>
                        setDateFrom(e.target.value)
                      }
                      className={`px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        userBackground === 'dark'
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'bg-white border-gray-300'
                      }`}
                    />

                  </div>


                  {/* DATE TO */}

                  <div>

                    <label
                      className={`block text-xs font-medium ${
                        userBackground === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-700'
                      } mb-1`}
                    >
                      Date To
                    </label>

                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) =>
                        setDateTo(e.target.value)
                      }
                      className={`px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        userBackground === 'dark'
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'bg-white border-gray-300'
                      }`}
                    />

                  </div>


                  {/* FILTER */}

                  <button
                    onClick={filterSalesByDate}
                    disabled={
                      isFiltering ||
                      (!dateFrom && !dateTo)
                    }
                    className={`px-4 py-1.5 text-sm font-medium text-white rounded-lg transition ${
                      isFiltering ||
                      (!dateFrom && !dateTo)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {isFiltering
                      ? 'Filtering...'
                      : 'Filter'}
                  </button>


                  {/* CLEAR */}

                  {(dateFrom || dateTo) && (
                    <button
                      onClick={resetDateFilter}
                      className={`px-4 py-1.5 text-sm font-medium rounded-lg transition ${
                        userBackground === 'dark'
                          ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                          : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      Clear
                    </button>
                  )}

                </div>

              </div>
            )}


            {/* TABLE */}

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead
                  className={
                    userBackground === 'dark'
                      ? 'bg-red-900'
                      : 'bg-red-900'
                  }
                >

                  <tr>

                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        userBackground === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-200'
                      }`}
                    >
                      Date
                    </th>

                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        userBackground === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-200'
                      }`}
                    >
                      Driver
                    </th>

                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        userBackground === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-200'
                      }`}
                    >
                      Fuel
                    </th>

                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        userBackground === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-200'
                      }`}
                    >
                      Litres
                    </th>

                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        userBackground === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-200'
                      }`}
                    >
                      Amount
                    </th>

                  </tr>

                </thead>


                <tbody
                  className={`divide-y ${
                    userBackground === 'dark'
                      ? 'divide-gray-700'
                      : 'divide-gray-200'
                  }`}
                >

                  {displaySales.length === 0 ? (

                    <tr>

                      <td
                        colSpan={5}
                        className={`px-6 py-8 text-center ${
                          userBackground === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-500'
                        }`}
                      >
                        {showAllSales &&
                        (dateFrom || dateTo)
                          ? 'No sales found for the selected date range'
                          : 'No sales data found'}
                      </td>

                    </tr>

                  ) : (

                    displaySales.map((sale, index) => {

                      const saleDate =
                        toSafeDate(sale.date);

                      const litres =
                        toSafeNumber(sale.litresSold);

                      const amount =
                        toSafeNumber(sale.totalAmount);


                      return (
                        <tr
                          key={`${sale.driverId || 'driver'}-${sale.date || index}-${index}`}
                          className={
                            userBackground === 'dark'
                              ? 'hover:bg-gray-800/50'
                              : 'hover:bg-gray-50'
                          }
                        >

                          {/* DATE */}

                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              userBackground === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          >
                            {saleDate
                              ? saleDate.toLocaleDateString()
                              : 'N/A'}
                          </td>


                          {/* DRIVER */}

                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              userBackground === 'dark'
                                ? 'text-white'
                                : 'text-gray-900'
                            }`}
                          >
                            {sale.driverName || 'N/A'}
                          </td>


                          {/* FUEL */}

                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              userBackground === 'dark'
                                ? 'text-white'
                                : 'text-gray-900'
                            }`}
                          >
                            {sale.fuelType || 'N/A'}
                          </td>


                          {/* LITRES */}

                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              userBackground === 'dark'
                                ? 'text-white'
                                : 'text-gray-900'
                            }`}
                          >
                            {litres.toLocaleString()}L
                          </td>


                          {/* AMOUNT */}

                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              userBackground === 'dark'
                                ? 'text-white'
                                : 'text-gray-900'
                            }`}
                          >
                            KES {amount.toLocaleString()}
                          </td>

                        </tr>
                      );

                    })

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}