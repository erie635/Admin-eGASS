'use client'; 
 
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'; 
import { db, auth } from '../../../lib/firebase'; 
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  getDoc, 
  setDoc, 
  query, 
  where, 
  runTransaction 
} from 'firebase/firestore'; 
import Link from 'next/link'; 
import toast from 'react-hot-toast'; 
 
 
// ============================================================ 
// TYPES 
// ============================================================ 
 
type FuelType = 'Petrol' | 'Diesel' | 'Kerosene' | 'V-Power'; 
 
type FuelStock = { 
  Petrol: number; 
  Diesel: number; 
  Kerosene: number; 
  'V-Power': number; 
}; 
 
type ActivityEntry = { 
  fuelType?: string; 
  amount?: number; 
  action?: string; 
  actionType?: string; 
  reason?: string; 
  timestamp?: string; 
  date?: string; 
  previousTankAmount?: number; 
  newTankAmount?: number; 
  updatedBy?: string; 
 
  deliveryId?: string; 
  saleId?: string; 
  driverName?: string; 
  customerName?: string; 
  truckNumber?: string; 
 
  // IMPORT PRICE FIELDS 
  pricePerLiter?: number; 
  pricePerLitre?: number; 
  unitPrice?: number; 
  costPerLiter?: number; 
  costPerLitre?: number; 
  purchasePrice?: number; 
  totalImportCost?: number; 
  totalCost?: number; 
  importReference?: string; 
  imported?: boolean; 
  source?: string; 
  currency?: string; 
 
  capacityInfo?: string; 
 
  // Driver fuel fields 
  driverId?: string; 
  driverCode?: string; 
  driverVehicle?: string; 
  driverPhone?: string; 
  adminName?: string; 
  adminId?: string; 
  fuelHistory?: any[]; 
}; 
 
 
// ============================================================ 
// CONSTANTS 
// ============================================================ 
 
const TANK_CAPACITY: Record<FuelType, number> = { 
  Petrol: 100000, 
  Diesel: 100000, 
  Kerosene: 100000, 
  'V-Power': 100000 
}; 
 
const DEFAULT_STOCK: FuelStock = { 
  Petrol: 0, 
  Diesel: 0, 
  Kerosene: 0, 
  'V-Power': 0 
}; 
 
 
// ============================================================ 
// HELPER FUNCTIONS 
// ============================================================ 
 
const getNumericValue = (...values: unknown[]): number => { 
  for (const value of values) { 
    const numberValue = 
      typeof value === 'number' 
        ? value 
        : typeof value === 'string' 
          ? Number(value) 
          : NaN; 
 
    if (Number.isFinite(numberValue) && numberValue >= 0) { 
      return numberValue; 
    } 
  } 
 
  return 0; 
}; 
 
 
/** 
 * Finds the import price regardless of which compatible 
 * field name the import page used. 
 */ 
const getImportPricePerLiter = (entry: ActivityEntry): number => { 
  return getNumericValue( 
    entry.pricePerLiter, 
    entry.pricePerLitre, 
    entry.unitPrice, 
    entry.costPerLiter, 
    entry.costPerLitre, 
    entry.purchasePrice 
  ); 
}; 
 
 
/** 
 * Determines whether an activity is an actual fuel import/top-up. 
 * 
 * Existing code uses action: "add", so all additions are treated 
 * as imported fuel unless they are clearly something else. 
 */ 
const isFuelImportEntry = (entry: ActivityEntry): boolean => { 
  if (!entry || !entry.fuelType || !entry.amount || entry.amount <= 0) { 
    return false; 
  } 
 
  if (entry.imported === true) { 
    return true; 
  } 
 
  if (entry.source?.toLowerCase() === 'import') { 
    return true; 
  } 
 
  if ( 
    entry.actionType?.toLowerCase().includes('import') || 
    entry.actionType?.toLowerCase().includes('top-up') || 
    entry.actionType?.toLowerCase().includes('top up') 
  ) { 
    return true; 
  } 
 
  if (entry.action === 'add') { 
    return true; 
  } 
 
  return false; 
}; 
 
 
/** 
 * Determines whether an activity is a driver fuel top-up 
 */ 
const isDriverFuelEntry = (entry: ActivityEntry): boolean => { 
  if (!entry || !entry.fuelType || !entry.amount || entry.amount <= 0) { 
    return false; 
  } 
 
  if (entry.actionType?.toLowerCase().includes('driver top-up') || 
      entry.actionType?.toLowerCase().includes('driver fuel')) { 
    return true; 
  } 
 
  if (entry.driverId || entry.driverName) { 
    return true; 
  } 
 
  return false; 
}; 
 
 
/** 
 * Gets the total cost of an import. 
 * 
 * If totalImportCost / totalCost was saved, use it. 
 * Otherwise calculate: 
 * 
 * litres × price per litre 
 */ 
const getImportTotalCost = (entry: ActivityEntry): number => { 
  const savedTotal = getNumericValue( 
    entry.totalImportCost, 
    entry.totalCost 
  ); 
 
  if (savedTotal > 0) { 
    return savedTotal; 
  } 
 
  const litres = getNumericValue(entry.amount); 
  const pricePerLiter = getImportPricePerLiter(entry); 
 
  return litres * pricePerLiter; 
}; 
 
 
// ============================================================ 
// SHARED VALIDATION FUNCTION 
// ============================================================ 
 
/** 
 * Gets the administrator who is actually logged in at the time
 * the stock action is performed. Firebase Auth displayName is
 * preferred, followed by the user's Firestore profile name and
 * then the Auth email.
 */ 
const getCurrentAdminIdentity = async (fallback = 'Admin') => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return {
      adminId: '',
      adminName: fallback || 'Admin'
    };
  }

  let adminName = currentUser.displayName?.trim() || '';

  if (!adminName) {
    try {
      const userSnap = await getDoc(
        doc(db, 'users', currentUser.uid)
      );

      if (userSnap.exists()) {
        const userData = userSnap.data();
        adminName = String(
          userData.displayName ||
          userData.adminName ||
          userData.name ||
          userData.fullName ||
          ''
        ).trim();
      }
    } catch (error) {
      console.warn(
        'Could not load the logged-in admin profile name:',
        error
      );
    }
  }

  if (!adminName) {
    adminName = currentUser.email?.trim() || fallback || 'Admin';
  }

  return {
    adminId: currentUser.uid,
    adminName
  };
};

/**
 * Import Activity Log only: identify a real administrator name.
 * Existing records may contain the generic value "Admin" instead of
 * the administrator who was logged in. New records with adminId/adminName
 * keep their stored identity; legacy generic records fall back to the
 * currently logged-in administrator for this log display.
 */
const isGenericImportAdmin = (value?: string) => {
  const normalized = String(value || '').trim().toLowerCase();
  return !normalized ||
    normalized === 'admin' ||
    normalized === 'system' ||
    normalized === 'system (auto)' ||
    normalized === 'administrator';
};

/** 
 * Added optional: 
 * - pricePerLiter 
 * - totalImportCost 
 * - importReference 
 * - useCurrentUserAsActor
 * 
 * Existing calls using the old arguments continue working. Manual
 * imports/top-ups use the currently logged-in admin by default.
 * Automated reconciliation calls pass false so the original actor
 * already stored on the source record is preserved.
 */ 
export const validateAndUpdateFuelStock = async ( 
  fuelType: FuelType | string, 
  amount: number, 
  action: 'add' | 'remove', 
  reason = '', 
  updatedBy = 'Admin', 
  pricePerLiter = 0, 
  totalImportCost = 0, 
  importReference = '', 
  useCurrentUserAsActor = true
) => { 
  try { 
    const actor = useCurrentUserAsActor
      ? await getCurrentAdminIdentity(updatedBy)
      : {
          adminId: '',
          adminName: updatedBy || 'System (Auto)'
        };

    const capacity = 
      TANK_CAPACITY[fuelType as FuelType] || 0; 
 
    if (capacity <= 0) { 
      throw new Error(`Invalid fuel type: ${fuelType}`); 
    } 
 
    const companyRef = doc(db, 'company', 'fuelStock'); 
 
    const result = await runTransaction(db, async (transaction) => { 
      const snap = await transaction.get(companyRef); 
 
      if (!snap.exists()) { 
        throw new Error('Fuel stock document does not exist'); 
      } 
 
      const data = snap.data(); 
 
      const currentStock: FuelStock = { 
        ...DEFAULT_STOCK, 
        ...(data.stock || {}) 
      }; 
 
      const currentAmount = Math.min( 
        Number(currentStock[fuelType as FuelType] || 0), 
        capacity 
      ); 
 
      const existingLogs: ActivityEntry[] = 
        data.activityLog || []; 
 
      let newAmount: number; 
      let actionType: string; 
 
      if (action === 'add') { 
        if (currentAmount >= capacity - 0.001) { 
          throw new Error( 
            `${fuelType} tank is FULL! Current: ${currentAmount.toFixed( 
              1 
            )}L, Capacity: ${capacity}L` 
          ); 
        } 
 
        newAmount = currentAmount + amount; 
 
        if (newAmount > capacity + 0.001) { 
          const availableSpace = capacity - currentAmount; 
 
          throw new Error( 
            `Cannot add ${amount}L! ${fuelType} tank capacity is ${capacity}L. Only ${availableSpace.toFixed( 
              1 
            )}L space available.` 
          ); 
        } 
 
        actionType = 'Fuel Import'; 
      } else if (action === 'remove') { 
        if (currentAmount < amount) { 
          throw new Error( 
            `Cannot remove ${amount}L! Only ${currentAmount.toFixed( 
              1 
            )}L available.` 
          ); 
        } 
 
        newAmount = currentAmount - amount; 
        actionType = 'Driver Fuel Top-up'; 
      } else { 
        throw new Error( 
          'Invalid action. Must be "add" or "remove"' 
        ); 
      } 
 
      const safePricePerLiter = 
        Number(pricePerLiter) > 0 
          ? Number(pricePerLiter) 
          : 0; 
 
      const calculatedImportCost = 
        action === 'add' && safePricePerLiter > 0 
          ? amount * safePricePerLiter 
          : 0; 
 
      const safeTotalImportCost = 
        Number(totalImportCost) > 0 
          ? Number(totalImportCost) 
          : calculatedImportCost; 
 
      const logEntry: ActivityEntry = { 
        fuelType, 
        amount, 
        action, 
        actionType, 
        reason: 
          reason || 
          `${actionType} of ${amount}L ${fuelType}`, 
        timestamp: new Date().toISOString(), 
        date: new Date().toLocaleString(), 
        previousTankAmount: currentAmount, 
        newTankAmount: newAmount, 
        updatedBy: actor.adminName, 
        adminName: actor.adminName, 
        adminId: actor.adminId, 
        capacityInfo: `${newAmount}/${capacity}L (${( 
          (newAmount / capacity) * 
          100 
        ).toFixed(1)}%)` 
      }; 
 
      // ======================================================== 
      // IMPORT PRICE INFORMATION 
      // ======================================================== 
 
      if (action === 'add') { 
        logEntry.imported = true; 
        logEntry.source = 'import'; 
 
        if (safePricePerLiter > 0) { 
          logEntry.pricePerLiter = safePricePerLiter; 
          logEntry.pricePerLitre = safePricePerLiter; 
          logEntry.unitPrice = safePricePerLiter; 
        } 
 
        if (safeTotalImportCost > 0) { 
          logEntry.totalImportCost = safeTotalImportCost; 
          logEntry.totalCost = safeTotalImportCost; 
        } 
 
        if (importReference) { 
          logEntry.importReference = importReference; 
        } 
 
        logEntry.currency = 'KES'; 
      } 
 
      const updatedStock: FuelStock = { 
        ...currentStock, 
        [fuelType]: newAmount 
      }; 
 
      const updatedLogs = [ 
        logEntry, 
        ...existingLogs 
      ].slice(0, 100); 
 
      transaction.update(companyRef, { 
        stock: updatedStock, 
        activityLog: updatedLogs, 
        lastUpdated: new Date().toISOString() 
      }); 
 
      return { 
        success: true, 
        previousAmount: currentAmount, 
        newAmount, 
        capacity, 
        logEntry 
      }; 
    }); 
 
    return result; 
  } catch (error) { 
    console.error('Validation error:', error); 
    throw error; 
  } 
}; 
 
 
// ============================================================ 
// MAIN COMPONENT 
// ============================================================ 
 
export default function FuelTanks() { 
  const [totalStock, setTotalStock] = 
    useState<FuelStock>(DEFAULT_STOCK); 
 
  const [loading, setLoading] = useState(true); 
 
  const [selectedFuel, setSelectedFuel] = 
    useState<FuelType>('Petrol'); 
 
  const [animate, setAnimate] = useState(false); 
 
  const [previousStock, setPreviousStock] = 
    useState<Partial<FuelStock>>({}); 
 
  const [activityLog, setActivityLog] = 
    useState<ActivityEntry[]>([]); 
 
  const [fuelDeliveries, setFuelDeliveries] = 
    useState<any[]>([]); 
 
  const [processedDeliveries, setProcessedDeliveries] = 
    useState<Set<string>>(new Set()); 
 
  const [showAllActivities, setShowAllActivities] = 
    useState(false); 
 
  const [filteredActivities, setFilteredActivities] = 
    useState<ActivityEntry[]>([]); 
 
  const [dateFrom, setDateFrom] = useState(''); 
  const [dateTo, setDateTo] = useState(''); 
 
  const [isFiltering, setIsFiltering] = 
    useState(false); 
 
  const [userBackground, setUserBackground] = 
    useState('white'); 

  // Separate import and driver fuel activities
  const [importActivities, setImportActivities] = 
    useState<ActivityEntry[]>([]); 

  // Import Activity Log actor shown for legacy records that were saved
  // with the generic "Admin" value. This is display-only for imports.
  const [loggedInImportAdminName, setLoggedInImportAdminName] =
    useState('');

  const [driverFuelActivities, setDriverFuelActivities] = 
    useState<ActivityEntry[]>([]); 
 
  const [showAllImports, setShowAllImports] = 
    useState(false); 
 
  const [showAllDriverFuel, setShowAllDriverFuel] = 
    useState(false); 
 
 
  // ========================================================== 
  // REFS 
  // ========================================================== 
 
  const processingQueueRef = 
    useRef<Set<string>>(new Set()); 
 
  const listenerUnsubscribeRef = 
    useRef<(() => void) | null>(null); 
 
  const processedDeliveriesRef = 
    useRef<Set<string>>(new Set()); 
 
  const activityLogRef = 
    useRef<ActivityEntry[]>([]); 
 
  const previousStockRef = 
    useRef<Partial<FuelStock>>({}); 
 
  const selectedFuelRef = 
    useRef<FuelType>('Petrol'); 
 
 
  // Keep refs synchronized. 
  useEffect(() => { 
    processedDeliveriesRef.current = 
      processedDeliveries; 
  }, [processedDeliveries]); 
 
 
  useEffect(() => { 
    activityLogRef.current = 
      activityLog; 
  }, [activityLog]); 
 
 
  useEffect(() => { 
    previousStockRef.current = 
      previousStock; 
  }, [previousStock]); 
 
 
  useEffect(() => { 
    selectedFuelRef.current = 
      selectedFuel; 
  }, [selectedFuel]); 
 
 
  // ========================================================== 
  // USER BACKGROUND 
  // ========================================================== 
 
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
 
 
  // ==========================================================
  // IMPORT ACTIVITY ADMIN DISPLAY
  // ==========================================================

  useEffect(() => {
    let active = true;

    const loadLoggedInImportAdmin = async () => {
      try {
        const identity = await getCurrentAdminIdentity('Admin');
        if (active && identity.adminName) {
          setLoggedInImportAdminName(identity.adminName);
        }
      } catch (error) {
        console.warn(
          'Could not load the logged-in admin for Import Activity Log:',
          error
        );
      }
    };

    loadLoggedInImportAdmin();

    return () => {
      active = false;
    };
  }, []);

  const getImportAdminDisplay = (entry: ActivityEntry) => {
    const storedName =
      String(entry.adminName || entry.updatedBy || '').trim();

    // Prefer the administrator explicitly saved with the import.
    if (!isGenericImportAdmin(storedName)) {
      return storedName;
    }

    // Legacy imports that only contain "Admin" are displayed against
    // the administrator currently logged into the system.
    if (loggedInImportAdminName) {
      return loggedInImportAdminName;
    }

    return storedName || 'Admin';
  };


  // ========================================================== 
  // BACKGROUND CLASS 
  // ========================================================== 
 
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
 
 
  // ========================================================== 
  // CARD CLASS 
  // ========================================================== 
 
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
 
 
  // ========================================================== 
  // INITIAL DATA 
  // ========================================================== 
 
  useEffect(() => { 
    const loadInitialData = async () => { 
      try { 
        const docRef = 
          doc(db, 'company', 'fuelStock'); 
 
        const docSnap = 
          await getDoc(docRef); 
 
        if (docSnap.exists()) { 
          const data = docSnap.data(); 
 
          const logs: ActivityEntry[] = 
            data.activityLog || []; 
 
          const stock: FuelStock = { 
            ...DEFAULT_STOCK, 
            ...(data.stock || {}) 
          }; 
 
          setActivityLog(logs); 
          setFuelDeliveries( 
            data.fuelDeliveries || [] 
          ); 
          setFilteredActivities(logs); 
 
          // Separate imports and driver fuel
          const imports = logs.filter(entry => isFuelImportEntry(entry) && !isDriverFuelEntry(entry));
          const driverFuel = logs.filter(entry => isDriverFuelEntry(entry) || entry.action === 'remove');
          
          setImportActivities(imports);
          setDriverFuelActivities(driverFuel);
 
          setTotalStock(stock); 
          setPreviousStock(stock); 
 
          activityLogRef.current = logs; 
          previousStockRef.current = stock; 
        } else { 
          await setDoc(docRef, { 
            stock: DEFAULT_STOCK, 
            activityLog: [], 
            lastUpdated: new Date().toISOString() 
          }); 
 
          setTotalStock(DEFAULT_STOCK); 
          setPreviousStock(DEFAULT_STOCK); 
          setActivityLog([]); 
          setFilteredActivities([]); 
          setImportActivities([]);
          setDriverFuelActivities([]);
        } 
      } catch (error) { 
        console.error( 
          'Error loading data:', 
          error 
        ); 
      } finally { 
        setLoading(false); 
      } 
    }; 
 
    loadInitialData(); 
  }, []); 
 
 
  // ========================================================== 
  // DATE FILTER 
  // ========================================================== 
 
  const filterActivitiesByDate = 
    useCallback(() => { 
      setIsFiltering(true); 
 
      try { 
        let filtered = [...activityLog]; 
 
        if (dateFrom) { 
          const fromDate = 
            new Date(dateFrom); 
 
          fromDate.setHours( 
            0, 
            0, 
            0, 
            0 
          ); 
 
          filtered = filtered.filter( 
            entry => 
              entry.timestamp && 
              new Date(entry.timestamp) >= 
                fromDate 
          ); 
        } 
 
        if (dateTo) { 
          const toDate = 
            new Date(dateTo); 
 
          toDate.setHours( 
            23, 
            59, 
            59, 
            999 
          ); 
 
          filtered = filtered.filter( 
            entry => 
              entry.timestamp && 
              new Date(entry.timestamp) <= 
                toDate 
          ); 
        } 
 
        setFilteredActivities(filtered); 
 
        // Separate filtered activities
        const imports = filtered.filter(entry => isFuelImportEntry(entry) && !isDriverFuelEntry(entry));
        const driverFuel = filtered.filter(entry => isDriverFuelEntry(entry) || entry.action === 'remove');
        
        setImportActivities(imports);
        setDriverFuelActivities(driverFuel);
 
        if (filtered.length === 0) { 
          toast('No activities found'); 
        } else { 
          toast.success( 
            `Found ${filtered.length} activities` 
          ); 
        } 
      } catch (error) { 
        console.error( 
          'Error filtering activities:', 
          error 
        ); 
 
        toast.error( 
          'Failed to filter activities' 
        ); 
      } finally { 
        setIsFiltering(false); 
      } 
    }, [activityLog, dateFrom, dateTo]); 
 
 
  const resetDateFilter = 
    useCallback(() => { 
      setDateFrom(''); 
      setDateTo(''); 
      setFilteredActivities(activityLog); 
      
      // Reset separation
      const imports = activityLog.filter(entry => isFuelImportEntry(entry) && !isDriverFuelEntry(entry));
      const driverFuel = activityLog.filter(entry => isDriverFuelEntry(entry) || entry.action === 'remove');
      
      setImportActivities(imports);
      setDriverFuelActivities(driverFuel);
      
      toast('Date filter cleared'); 
    }, [activityLog]); 
 
 
  // ========================================================== 
  // UPDATE SEPARATED LISTS WHEN ACTIVITY LOG CHANGES 
  // ========================================================== 
 
  useEffect(() => { 
    const imports = activityLog.filter(entry => isFuelImportEntry(entry) && !isDriverFuelEntry(entry));
    const driverFuel = activityLog.filter(entry => isDriverFuelEntry(entry) || entry.action === 'remove');
    
    setImportActivities(imports);
    setDriverFuelActivities(driverFuel);
  }, [activityLog]); 
 
 
  // ========================================================== 
  // IMPORT SUMMARY 
  // ========================================================== 
 
  const importSummary = useMemo(() => { 
    const summary: Record< 
      FuelType, 
      { 
        importedLitres: number; 
        totalCost: number; 
        pricedLitres: number; 
        weightedCost: number; 
        averagePricePerLiter: number; 
        latestPricePerLiter: number; 
        latestImportDate: string; 
      } 
    > = { 
      Petrol: { 
        importedLitres: 0, 
        totalCost: 0, 
        pricedLitres: 0, 
        weightedCost: 0, 
        averagePricePerLiter: 0, 
        latestPricePerLiter: 0, 
        latestImportDate: '' 
      }, 
      Diesel: { 
        importedLitres: 0, 
        totalCost: 0, 
        pricedLitres: 0, 
        weightedCost: 0, 
        averagePricePerLiter: 0, 
        latestPricePerLiter: 0, 
        latestImportDate: '' 
      }, 
      Kerosene: { 
        importedLitres: 0, 
        totalCost: 0, 
        pricedLitres: 0, 
        weightedCost: 0, 
        averagePricePerLiter: 0, 
        latestPricePerLiter: 0, 
        latestImportDate: '' 
      }, 
      'V-Power': { 
        importedLitres: 0, 
        totalCost: 0, 
        pricedLitres: 0, 
        weightedCost: 0, 
        averagePricePerLiter: 0, 
        latestPricePerLiter: 0, 
        latestImportDate: '' 
      } 
    }; 
 
    for (const entry of activityLog) { 
      if (!isFuelImportEntry(entry) || isDriverFuelEntry(entry)) { 
        continue; 
      } 
 
      const fuelType = 
        entry.fuelType as FuelType; 
 
      if (!summary[fuelType]) { 
        continue; 
      } 
 
      const litres = 
        getNumericValue(entry.amount); 
 
      const price = 
        getImportPricePerLiter(entry); 
 
      const totalCost = 
        getImportTotalCost(entry); 
 
      summary[fuelType].importedLitres += 
        litres; 
 
      if (price > 0) { 
        summary[fuelType].pricedLitres += 
          litres; 
 
        summary[fuelType].weightedCost += 
          litres * price; 
 
        summary[fuelType].totalCost += 
          totalCost; 
 
        summary[fuelType].latestPricePerLiter = 
          price; 
 
        summary[fuelType].latestImportDate = 
          entry.date || ''; 
      } else if (totalCost > 0) { 
        summary[fuelType].totalCost += 
          totalCost; 
      } 
    } 
 
    for (const fuelType of Object.keys( 
      summary 
    ) as FuelType[]) { 
      if ( 
        summary[fuelType].pricedLitres > 0 
      ) { 
        summary[fuelType].averagePricePerLiter = 
          summary[fuelType].weightedCost / 
          summary[fuelType].pricedLitres; 
      } 
    } 
 
    return summary; 
  }, [activityLog]); 
 
 
  // ========================================================== 
  // DRIVER FUEL SUMMARY 
  // ========================================================== 
 
  const driverFuelSummary = useMemo(() => { 
    const summary: Record< 
      FuelType, 
      { 
        totalLitresGiven: number; 
        totalDrivers: number; 
        entries: ActivityEntry[]; 
      } 
    > = { 
      Petrol: { 
        totalLitresGiven: 0, 
        totalDrivers: 0, 
        entries: [] 
      }, 
      Diesel: { 
        totalLitresGiven: 0, 
        totalDrivers: 0, 
        entries: [] 
      }, 
      Kerosene: { 
        totalLitresGiven: 0, 
        totalDrivers: 0, 
        entries: [] 
      }, 
      'V-Power': { 
        totalLitresGiven: 0, 
        totalDrivers: 0, 
        entries: [] 
      } 
    }; 
 
    const driverSet = new Set<string>(); 
 
    for (const entry of driverFuelActivities) { 
      const fuelType = 
        entry.fuelType as FuelType; 
 
      if (!summary[fuelType]) { 
        continue; 
      } 
 
      const litres = 
        getNumericValue(entry.amount); 
 
      summary[fuelType].totalLitresGiven += 
        litres; 
 
      if (entry.driverId) { 
        driverSet.add(entry.driverId); 
      } 
 
      summary[fuelType].entries.push(entry); 
    } 
 
    // Count unique drivers across all fuel types 
    const uniqueDrivers = new Set<string>(); 
    for (const entry of driverFuelActivities) { 
      if (entry.driverId) { 
        uniqueDrivers.add(entry.driverId); 
      } else if (entry.driverName) { 
        uniqueDrivers.add(entry.driverName); 
      } 
    } 
 
    // Add total drivers to each fuel type 
    for (const fuelType of Object.keys( 
      summary 
    ) as FuelType[]) { 
      summary[fuelType].totalDrivers = 
        uniqueDrivers.size; 
    } 
 
    return summary; 
  }, [driverFuelActivities]); 
 
 
  // ========================================================== 
  // FUEL DEDUCTION (Driver Fuel Top-up) 
  // ========================================================== 
 
  const performFuelDeduction = 
    useCallback( 
      async ( 
        fuelType: FuelType | string, 
        amount: number, 
        logEntry: ActivityEntry 
      ) => { 
        const transactionId = 
          logEntry.deliveryId || 
          logEntry.saleId || 
          `${fuelType}-${amount}`; 
 
        const dedupKey = 
          `remove-${fuelType}-${amount}-${transactionId}`; 
 
        if ( 
          processingQueueRef.current.has( 
            dedupKey 
          ) 
        ) { 
          return; 
        } 
 
        processingQueueRef.current.add( 
          dedupKey 
        ); 
 
        try { 
          if ( 
            !fuelType || 
            !amount || 
            amount <= 0 
          ) { 
            return; 
          } 
 
          const result = 
            await validateAndUpdateFuelStock( 
              fuelType, 
              amount, 
              'remove', 
              logEntry.reason || 
                `Fuel delivery of ${amount}L ${fuelType}`, 
              logEntry.updatedBy || 'System (Auto)' ,
              0,
              0,
              '',
              false
            ); 
 
          if (result?.success) { 
            setTotalStock(prev => ({ 
              ...prev, 
              [fuelType as FuelType]: 
                result.newAmount 
            })); 
 
            setPreviousStock(prev => ({ 
              ...prev, 
              [fuelType as FuelType]: 
                result.previousAmount 
            })); 
 
            setAnimate(true); 
 
            setTimeout( 
              () => setAnimate(false), 
              800 
            ); 
 
            const docRef = 
              doc( 
                db, 
                'company', 
                'fuelStock' 
              ); 
 
            const docSnap = 
              await getDoc(docRef); 
 
            if (docSnap.exists()) { 
              const data = 
                docSnap.data(); 
 
              const logs = 
                data.activityLog || []; 
 
              setActivityLog(logs); 
              setFilteredActivities( 
                logs 
              ); 
 
              activityLogRef.current = 
                logs; 
            } 
 
            toast.success( 
              `${amount}L ${fuelType} given to driver - Remaining: ${result.newAmount.toFixed( 
                1 
              )}L`, 
              { 
                duration: 4000, 
                icon: '🚛' 
              } 
            ); 
          } 
        } catch (error: any) { 
          console.error( 
            'Error performing fuel deduction:', 
            error 
          ); 
 
          toast.error( 
            `${error?.message || 'Fuel deduction failed'}` 
          ); 
        } finally { 
          setTimeout(() => { 
            processingQueueRef.current.delete( 
              dedupKey 
            ); 
          }, 5000); 
        } 
      }, 
      [] 
    ); 
 
 
  // ========================================================== 
  // FUEL ADDITION (Import) 
  // ========================================================== 
 
  const performFuelAddition = 
    useCallback( 
      async ( 
        fuelType: FuelType | string, 
        amount: number, 
        logEntry: ActivityEntry 
      ) => { 
        const dedupKey = 
          `add-${fuelType}-${amount}-${logEntry.importReference || Date.now()}`; 
 
        if ( 
          processingQueueRef.current.has( 
            dedupKey 
          ) 
        ) { 
          return; 
        } 
 
        processingQueueRef.current.add( 
          dedupKey 
        ); 
 
        try { 
          if ( 
            !fuelType || 
            !amount || 
            amount <= 0 
          ) { 
            return; 
          } 
 
          const pricePerLiter = 
            getImportPricePerLiter( 
              logEntry 
            ); 
 
          const totalImportCost = 
            getImportTotalCost( 
              logEntry 
            ); 
 
          const result = 
            await validateAndUpdateFuelStock( 
              fuelType, 
              amount, 
              'add', 
              logEntry.reason || 
                `Imported ${amount}L ${fuelType}`, 
              logEntry.updatedBy || 
                'Admin', 
              pricePerLiter, 
              totalImportCost, 
              logEntry.importReference || 
                '' ,
              false
            ); 
 
          if (result?.success) { 
            setTotalStock(prev => ({ 
              ...prev, 
              [fuelType as FuelType]: 
                result.newAmount 
            })); 
 
            setPreviousStock(prev => ({ 
              ...prev, 
              [fuelType as FuelType]: 
                result.previousAmount 
            })); 
 
            setAnimate(true); 
 
            setTimeout( 
              () => setAnimate(false), 
              800 
            ); 
 
            const docRef = 
              doc( 
                db, 
                'company', 
                'fuelStock' 
              ); 
 
            const docSnap = 
              await getDoc(docRef); 
 
            if (docSnap.exists()) { 
              const data = 
                docSnap.data(); 
 
              const logs = 
                data.activityLog || []; 
 
              setActivityLog(logs); 
              setFilteredActivities( 
                logs 
              ); 
 
              activityLogRef.current = 
                logs; 
            } 
 
            const priceMessage = 
              pricePerLiter > 0 
                ? ` @ KSh ${pricePerLiter.toFixed( 
                    2 
                  )}/L` 
                : ''; 
 
            toast.success( 
              `${amount}L ${fuelType} imported${priceMessage} - New total: ${result.newAmount.toFixed( 
                1 
              )}L`, 
              { 
                duration: 4000, 
                icon: '📦' 
              } 
            ); 
          } 
        } catch (error: any) { 
          console.error( 
            'Error performing fuel addition:', 
            error 
          ); 
 
          toast.error( 
            `${error?.message || 'Fuel addition failed'}` 
          ); 
        } finally { 
          setTimeout(() => { 
            processingQueueRef.current.delete( 
              dedupKey 
            ); 
          }, 5000); 
        } 
      }, 
      [] 
    ); 
 
 
  // ========================================================== 
  // REAL-TIME FIRESTORE LISTENERS 
  // ========================================================== 
 
  useEffect(() => { 
    if (loading) return; 
 
    if ( 
      listenerUnsubscribeRef.current 
    ) { 
      listenerUnsubscribeRef.current(); 
      listenerUnsubscribeRef.current = 
        null; 
    } 
 
 
    // -------------------------------------------------------- 
    // FUEL DELIVERIES 
    // -------------------------------------------------------- 
 
    const deliveriesQuery = 
      query( 
        collection( 
          db, 
          'fuelDeliveries' 
        ), 
        where( 
          'status', 
          '==', 
          'completed' 
        ) 
      ); 
 
    const unsubscribeDeliveries = 
      onSnapshot( 
        deliveriesQuery, 
        async snapshot => { 
          const deliveries = 
            snapshot.docs.map( 
              item => ({ 
                id: item.id, 
                ...item.data() 
              }) 
            ); 
 
          setFuelDeliveries( 
            deliveries 
          ); 
 
          for (const delivery of deliveries) { 
            const deliveryKey = 
              `${delivery.id}-${delivery.fuelType}-${delivery.amount}`; 
 
            if ( 
              !processedDeliveriesRef.current.has( 
                deliveryKey 
              ) && 
              delivery.fuelType && 
              delivery.amount 
            ) { 
              processedDeliveriesRef.current.add( 
                deliveryKey 
              ); 
 
              setProcessedDeliveries( 
                prev => 
                  new Set([ 
                    ...prev, 
                    deliveryKey 
                  ]) 
              ); 
 
              const logEntry: ActivityEntry = 
                { 
                  fuelType: 
                    delivery.fuelType, 
                  amount: 
                    delivery.amount, 
                  action: 'remove', 
                  actionType: 
                    'Driver Fuel Top-up', 
                  reason: 
                    `Driver ${delivery.driverName || 'Unknown'} received ${delivery.amount}L ${delivery.fuelType}`, 
                  timestamp: 
                    new Date().toISOString(), 
                  date: 
                    new Date().toLocaleString(), 
                  deliveryId: 
                    delivery.id, 
                  driverName: 
                    delivery.driverName || 
                    'Unknown Driver', 
                  driverId: 
                    delivery.driverId || 
                    delivery.driverId || 
                    '', 
                  customerName: 
                    delivery.customerName || 
                    'Unknown Customer', 
                  updatedBy: 
                    delivery.updatedBy ||
                    delivery.adminName ||
                    'System (Auto)', 
                  truckNumber: 
                    delivery.truckNumber || 
                    'N/A', 
                  adminName:
                    delivery.adminName ||
                    delivery.updatedBy ||
                    'System (Auto)' 
                }; 
 
              await performFuelDeduction( 
                delivery.fuelType, 
                delivery.amount, 
                logEntry 
              ); 
 
              try { 
                await updateDoc( 
                  doc( 
                    db, 
                    'fuelDeliveries', 
                    delivery.id 
                  ), 
                  { 
                    deductedFromTank: 
                      true, 
                    deductedAt: 
                      new Date().toISOString() 
                  } 
                ); 
              } catch ( 
                updateError 
              ) { 
                console.error( 
                  `Error updating delivery ${delivery.id}:`, 
                  updateError 
                ); 
              } 
            } 
          } 
        }, 
        error => { 
          console.error( 
            'Error listening to fuel deliveries:', 
            error 
          ); 
 
          toast.error( 
            'Failed to listen for fuel deliveries' 
          ); 
        } 
      ); 
 
 
    // -------------------------------------------------------- 
    // SALES 
    // -------------------------------------------------------- 
 
    const salesQuery = 
      query( 
        collection( 
          db, 
          'sales' 
        ), 
        where( 
          'status', 
          '==', 
          'completed' 
        ) 
      ); 
 
    const unsubscribeSales = 
      onSnapshot( 
        salesQuery, 
        async snapshot => { 
          const sales = 
            snapshot.docs.map( 
              item => ({ 
                id: item.id, 
                ...item.data() 
              }) 
            ); 
 
          for (const sale of sales) { 
            if ( 
              sale.fuelType && 
              sale.amount && 
              sale.status === 
                'completed' 
            ) { 
              const saleKey = 
                `sale-${sale.id}-${sale.fuelType}`; 
 
              const alreadyLogged = 
                activityLogRef.current.some( 
                  log => 
                    log.saleId === 
                      sale.id && 
                    log.action === 
                      'remove' 
                ); 
 
              if ( 
                !processedDeliveriesRef.current.has( 
                  saleKey 
                ) && 
                !alreadyLogged 
              ) { 
                processedDeliveriesRef.current.add( 
                  saleKey 
                ); 
 
                setProcessedDeliveries( 
                  prev => 
                    new Set([ 
                      ...prev, 
                      saleKey 
                    ]) 
                ); 
 
                const logEntry: ActivityEntry = 
                  { 
                    fuelType: 
                      sale.fuelType, 
                    amount: 
                      sale.amount, 
                    action: 'remove', 
                    actionType: 
                      'Driver Fuel Top-up', 
                    reason: 
                      `Sale #${sale.id} - ${ 
                        sale.driverName || 
                        'Driver' 
                      } received ${ 
                        sale.amount 
                      }L ${ 
                        sale.fuelType 
                      }`, 
                    timestamp: 
                      new Date().toISOString(), 
                    date: 
                      new Date().toLocaleString(), 
                    saleId: 
                      sale.id, 
                    driverName: 
                      sale.driverName || 
                      'Unknown Driver', 
                    driverId: 
                      sale.driverId || '', 
                    customerName: 
                      sale.customerName || 
                      'Unknown Customer', 
                    updatedBy: 
                      sale.updatedBy ||
                      sale.adminName ||
                      'System (Auto)', 
                    adminName:
                      sale.adminName ||
                      sale.updatedBy ||
                      'System (Auto)' 
                  }; 
 
                await performFuelDeduction( 
                  sale.fuelType, 
                  sale.amount, 
                  logEntry 
                ); 
              } 
            } 
          } 
        }, 
        error => { 
          console.error( 
            'Error listening to sales:', 
            error 
          ); 
        } 
      ); 
 
 
    // -------------------------------------------------------- 
    // COMPANY STOCK 
    // -------------------------------------------------------- 
 
    const unsubscribeStock = 
      onSnapshot( 
        doc( 
          db, 
          'company', 
          'fuelStock' 
        ), 
        docSnap => { 
          if (!docSnap.exists()) { 
            return; 
          } 
 
          const data = 
            docSnap.data(); 
 
          const stock: FuelStock = { 
            ...DEFAULT_STOCK, 
            ...(data.stock || {}) 
          }; 
 
          const oldStock = 
            previousStockRef.current; 
 
          const fuel = 
            selectedFuelRef.current; 
 
          if ( 
            oldStock[fuel] !== 
            undefined 
          ) { 
            const oldValue = 
              oldStock[fuel] || 0; 
 
            const newValue = 
              stock[fuel] || 0; 
 
            if ( 
              Math.abs( 
                newValue - 
                  oldValue 
              ) > 0.01 
            ) { 
              setAnimate(true); 
 
              setTimeout( 
                () => 
                  setAnimate(false), 
                800 
              ); 
            } 
          } 
 
          previousStockRef.current = 
            stock; 
 
          setPreviousStock(stock); 
          setTotalStock(stock); 
 
          if ( 
            data.activityLog 
          ) { 
            const logs = 
              data.activityLog; 
 
            activityLogRef.current = 
              logs; 
 
            setActivityLog( 
              logs 
            ); 
 
            setFilteredActivities( 
              logs 
            ); 
          } 
        }, 
        error => { 
          console.error( 
            'Error listening to company stock:', 
            error 
          ); 
        } 
      ); 
 
 
    // -------------------------------------------------------- 
    // CLEANUP 
    // -------------------------------------------------------- 
 
    listenerUnsubscribeRef.current = 
      () => { 
        unsubscribeDeliveries(); 
        unsubscribeSales(); 
        unsubscribeStock(); 
      }; 
 
 
    return () => { 
      if ( 
        listenerUnsubscribeRef.current 
      ) { 
        listenerUnsubscribeRef.current(); 
        listenerUnsubscribeRef.current = 
          null; 
      } 
    }; 
  }, [ 
    loading, 
    performFuelDeduction 
  ]); 
 
 
  // ========================================================== 
  // FUEL STATUS 
  // ========================================================== 
 
  const getFuelStatus = 
    useCallback( 
      (fuelType: FuelType) => { 
        const amount = 
          totalStock[fuelType] || 
          0; 
 
        const capacity = 
          TANK_CAPACITY[fuelType] || 
          100000; 
 
        const percentage = 
          Math.min( 
            (amount / capacity) * 
              100, 
            100 
          ); 
 
        let status = { 
          color: '', 
          label: '', 
          icon: '' 
        }; 
 
        if ( 
          percentage >= 100 || 
          amount >= capacity 
        ) { 
          status = { 
            color: 
              'text-red-600', 
            label: 'FULL', 
            icon: '🔴' 
          }; 
        } else if ( 
          percentage > 80 
        ) { 
          status = { 
            color: 
              'text-green-600', 
            label: 'Full', 
            icon: '🟢' 
          }; 
        } else if ( 
          percentage > 50 
        ) { 
          status = { 
            color: 
              'text-yellow-600', 
            label: 'Moderate', 
            icon: '🟡' 
          }; 
        } else if ( 
          percentage > 20 
        ) { 
          status = { 
            color: 
              'text-orange-600', 
            label: 'Low', 
            icon: '🟠' 
          }; 
        } else { 
          status = { 
            color: 
              'text-red-600', 
            label: 'Critical', 
            icon: '🔴' 
          }; 
        } 
 
        return { 
          percentage, 
          status, 
          amount, 
          capacity 
        }; 
      }, 
      [totalStock] 
    ); 
 
 
  // ========================================================== 
  // TODAY'S DELIVERIES 
  // ========================================================== 
 
  const getTodayDeliveries = 
    useCallback(() => { 
      const today = 
        new Date().toDateString(); 
 
      const totalByFuel: Record< 
        string, 
        number 
      > = {}; 
 
      fuelDeliveries 
        .filter( 
          d => 
            d.createdAt && 
            new Date( 
              d.createdAt 
            ).toDateString() === 
              today 
        ) 
        .forEach(d => { 
          if (d.fuelType) { 
            totalByFuel[ 
              d.fuelType 
            ] = 
              (totalByFuel[ 
                d.fuelType 
              ] || 0) + 
              (d.amount || 0); 
          } 
        }); 
 
      return totalByFuel; 
    }, [fuelDeliveries]); 
 
 
  // ========================================================== 
  // TANK RENDERER 
  // ========================================================== 
 
  const renderFuelTank = 
    useCallback( 
      (fuelType: FuelType) => { 
        const { 
          percentage, 
          status, 
          amount, 
          capacity 
        } = 
          getFuelStatus( 
            fuelType 
          ); 
 
        const isSelected = 
          fuelType === 
          selectedFuel; 
 
        const liquidHeight = 
          Math.max( 
            5, 
            percentage 
          ); 
 
        const isFull = 
          amount >= 
          capacity; 
 
        const colorMap: Record< 
          string, 
          string 
        > = { 
          Petrol: 
            'from-red-500 via-orange-500 to-yellow-400', 
          Diesel: 
            'from-green-700 via-green-600 to-green-400', 
          Kerosene: 
            'from-blue-600 via-indigo-500 to-blue-400', 
          'V-Power': 
            'from-purple-700 via-purple-600 to-purple-400' 
        }; 
 
        const gradientColor = 
          colorMap[fuelType] || 
          'from-blue-500 to-blue-300'; 
 
 
        // Live tank-level identification colors. Only the tank visualization
        // uses these colors; all existing fuel/accounting logic remains intact.
        const tankLevelColor =
          percentage >= 100
            ? '#22c55e'       // FULL - green
            : percentage <= 0
              ? '#ef4444'     // EMPTY - red
              : percentage <= 20
                ? '#f97316'   // VERY LOW - orange
                : percentage <= 50
                  ? '#eab308' // LOW/MODERATE - yellow
                  : '#3b82f6'; // HEALTHY LEVEL - blue

        const tankLevelDarkColor =
          percentage >= 100
            ? '#15803d'
            : percentage <= 0
              ? '#b91c1c'
              : percentage <= 20
                ? '#c2410c'
                : percentage <= 50
                  ? '#a16207'
                  : '#1d4ed8';

        const tankLevelLabel =
          percentage >= 100
            ? 'FULL'
            : percentage <= 0
              ? 'EMPTY'
              : percentage <= 20
                ? 'VERY LOW'
                : percentage <= 50
                  ? 'LOW'
                  : 'GOOD LEVEL';
        const todayDeliveries = 
          getTodayDeliveries(); 
 
        const deliveredToday = 
          todayDeliveries[ 
            fuelType 
          ] || 0; 
 
        const fuelImport = 
          importSummary[ 
            fuelType 
          ]; 
 
        return ( 
          <div 
            key={`tank-${fuelType}`} 
            className={`relative ${ 
              isSelected 
                ? 'ring-4 ring-blue-500 ring-opacity-50' 
                : '' 
            }`} 
            onClick={() => 
              setSelectedFuel( 
                fuelType 
              ) 
            } 
          > 
            <div 
              className={`rounded-xl shadow-lg border ${ 
                isFull 
                  ? 'border-red-500 border-2' 
                  : 'border-gray-200' 
              } p-6 hover:shadow-xl transition-all duration-300 cursor-pointer ${getCardClass()}`} 
            > 
              <div className="flex items-center justify-between mb-3"> 
                <div className="flex items-center space-x-3"> 
                  <div 
                    className={`w-5 h-5 rounded-full ${status.color}`} 
                  ></div> 
 
                  <h3 
                    className={`text-xl font-bold ${ 
                      userBackground === 
                      'dark' 
                        ? 'text-white' 
                        : 'text-gray-800' 
                    }`} 
                  > 
                    {fuelType} 
                  </h3> 
 
                  <span 
                    className={`text-base font-medium ${status.color}`} 
                  > 
                    {status.icon}{' '} 
                    {status.label} 
                  </span> 
                </div> 
 
                <div className="text-right"> 
                  <span 
                    className={`text-3xl font-bold ${ 
                      isFull 
                        ? 'text-red-600' 
                        : userBackground === 
                          'dark' 
                          ? 'text-white' 
                          : 'text-gray-900' 
                    }`} 
                  > 
                    {amount.toFixed( 
                      1 
                    )} 
                    L 
                  </span> 
 
                  <span 
                    className={`text-base ml-1 ${ 
                      userBackground === 
                      'dark' 
                        ? 'text-gray-400' 
                        : 'text-gray-500' 
                    }`} 
                  > 
                    / {capacity}L 
                  </span> 
                </div> 
              </div> 
 
 
              {isFull && ( 
                <div className="mb-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-1 font-bold animate-pulse text-center"> 
                  TANK IS FULL! 
                </div> 
              )} 
 
 
              {deliveredToday > 0 && ( 
                <div className="mb-2 text-sm text-blue-600 bg-blue-50 rounded-lg px-3 py-1"> 
                  {deliveredToday.toFixed( 
                    1 
                  )} 
                  L delivered today 
                </div> 
              )} 
 
 
              {/* IMPORT PRICE INFORMATION */} 
              {fuelImport.importedLitres > 
                0 && ( 
                <div 
                  className={`mb-3 rounded-lg p-3 border ${ 
                    userBackground === 
                    'dark' 
                      ? 'bg-gray-700/50 border-gray-600' 
                      : 'bg-blue-50 border-blue-100' 
                  }`} 
                > 
                  <div className="grid grid-cols-2 gap-2 text-sm"> 
                    <div> 
                      <p 
                        className={ 
                          userBackground === 
                          'dark' 
                            ? 'text-gray-400' 
                            : 'text-gray-500' 
                        } 
                      > 
                        Imported 
                      </p> 
 
                      <p 
                        className={`font-bold text-base ${ 
                          userBackground === 
                          'dark' 
                            ? 'text-white' 
                            : 'text-gray-900' 
                        }`} 
                      > 
                        {fuelImport.importedLitres.toLocaleString( 
                          undefined, 
                          { 
                            maximumFractionDigits: 1 
                          } 
                        )}{' '} 
                        L 
                      </p> 
                    </div> 
 
                    <div> 
                      <p 
                        className={ 
                          userBackground === 
                          'dark' 
                            ? 'text-gray-400' 
                            : 'text-gray-500' 
                        } 
                      > 
                        Avg. Import Price 
                      </p> 
 
                      <p className="font-bold text-blue-600 text-base"> 
                        {fuelImport.averagePricePerLiter > 
                        0 
                          ? `KSh ${fuelImport.averagePricePerLiter.toFixed( 
                              2 
                            )}/L` 
                          : 'Price not recorded'} 
                      </p> 
                    </div> 
                  </div> 
                </div> 
              )} 
 
 
              <div className="relative">
                {/* Solid tank visualization with a live fuel-level indicator.
                    The tank graphic is kept inside this file so no external image
                    or asset is required. */}
                <div className="relative h-56 w-full overflow-hidden rounded-xl border-2 border-gray-300 bg-gradient-to-b from-gray-50 to-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center px-10">
                    <div className="relative h-44 w-full max-w-md">
                      <svg
                        viewBox="0 0 520 220"
                        className="h-full w-full"
                        role="img"
                        aria-label={`${fuelType} tank showing ${percentage.toFixed(1)} percent full`}
                      >
                        <defs>
                          <linearGradient id={`tankMetal-${fuelType}`} x1="0" x2="1">
                            <stop offset="0%" stopColor="#8b949e" />
                            <stop offset="18%" stopColor="#eef2f5" />
                            <stop offset="48%" stopColor="#ffffff" />
                            <stop offset="78%" stopColor="#c7ced5" />
                            <stop offset="100%" stopColor="#737d87" />
                          </linearGradient>
                          <linearGradient id={`tankTop-${fuelType}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#aeb7c0" />
                          </linearGradient>
                          <linearGradient id={`fuel-${fuelType}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.48" />
                            <stop offset="14%" stopColor={tankLevelColor} stopOpacity="0.92" />
                            <stop offset="100%" stopColor={tankLevelDarkColor} stopOpacity="0.98" />
                          </linearGradient>
                          <clipPath id={`tankClip-${fuelType}`}>
                            <rect x="90" y="52" width="300" height="122" rx="58" />
                          </clipPath>
                          <filter id={`tankShadow-${fuelType}`} x="-20%" y="-20%" width="140%" height="160%">
                            <feDropShadow dx="0" dy="7" stdDeviation="7" floodOpacity="0.25" />
                          </filter>
                        </defs>

                        {/* Solid 3-D tank body */}
                        <ellipse cx="240" cy="58" rx="150" ry="30" fill={`url(#tankTop-${fuelType})`} stroke="#69737d" strokeWidth="2" filter={`url(#tankShadow-${fuelType})`} />
                        <rect x="90" y="58" width="300" height="116" fill={`url(#tankMetal-${fuelType})`} stroke="#69737d" strokeWidth="2" />
                        <ellipse cx="240" cy="174" rx="150" ry="30" fill="#aeb7c0" stroke="#69737d" strokeWidth="2" />

                        {/* Live fuel volume, clipped inside the solid tank */}
                        <g clipPath={`url(#tankClip-${fuelType})`}>
                          <rect
                            x="90"
                            y={174 - (122 * Math.min(Math.max(percentage, 0), 100) / 100)}
                            width="300"
                            height={122 * Math.min(Math.max(percentage, 0), 100) / 100 + 30}
                            fill={`url(#fuel-${fuelType})`}
                          />
                          <rect
                            x="90"
                            y={174 - (122 * Math.min(Math.max(percentage, 0), 100) / 100)}
                            width="300"
                            height="5"
                            fill={tankLevelColor}
                            opacity="0.95"
                          />
                          <rect
                            x="90"
                            y={174 - (122 * Math.min(Math.max(percentage, 0), 100) / 100) + 1}
                            width="300"
                            height="2"
                            fill="#ffffff"
                            opacity="0.82"
                          />
                        </g>

                        {/* Tank details */}
                        <ellipse cx="240" cy="58" rx="150" ry="30" fill="none" stroke="#69737d" strokeWidth="2" />
                        <ellipse cx="240" cy="174" rx="150" ry="30" fill="none" stroke="#69737d" strokeWidth="2" />
                        <path d="M130 76 H350 M130 156 H350" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
                        <circle cx="240" cy="43" r="8" fill="#69737d" />
                        <rect x="232" y="25" width="16" height="18" rx="4" fill="#8b949e" />

                        {/* eGAS tank mark */}
                        <text x="240" y="124" textAnchor="middle" fontSize="25" fontWeight="800" fill="#3f4852">eGAS</text>
                      </svg>

                      {/* Small color marker: instantly identifies the live tank level. */}
                      <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 px-3 py-1 shadow-md"
                        style={{ backgroundColor: tankLevelColor }}
                      >
                        <span className="text-xs font-extrabold tracking-wide text-white">
                          {tankLevelLabel}
                        </span>
                      </div>

                      {/* Transparent measurement line beside the tank */}
                      <div className="absolute -right-8 top-2 bottom-2 flex w-16 flex-col items-center justify-between text-xs font-semibold text-gray-500">
                        <span>100%</span>
                        <span>75%</span>
                        <span>50%</span>
                        <span>25%</span>
                        <span>0%</span>
                      </div>

                      <div
                        className="absolute -right-1 w-12 border-t-2 border-dashed"
                        style={{
                          top: `${8 + (100 - percentage) * 0.84}%`,
                          borderColor: tankLevelColor
                        }}
                      >
                        <span
                          className="absolute -right-16 -top-3 whitespace-nowrap rounded px-2 py-1 text-xs font-bold text-white shadow-sm"
                          style={{ backgroundColor: tankLevelDarkColor }}
                        >
                          {amount.toLocaleString(undefined, { maximumFractionDigits: 1 })}L
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Current amount shown clearly over the tank */}
                  <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full px-4 py-1.5 backdrop-blur-sm shadow-sm" style={{ backgroundColor: tankLevelDarkColor }}>
                    <span className="text-base font-bold text-white">
                      {percentage.toFixed(1)}% · {amount.toLocaleString(undefined, { maximumFractionDigits: 1 })}L · {tankLevelLabel}
                    </span>
                  </div>
                </div>
              </div>


              {/* View Only Stats */} 
              <div className="grid grid-cols-2 gap-2 mt-4"> 
                <div 
                  className={`rounded-lg p-2 text-center ${ 
                    userBackground === 
                    'dark' 
                      ? 'bg-gray-700/50' 
                      : 'bg-gray-50' 
                  }`} 
                > 
                  <p 
                    className={`text-sm ${ 
                      userBackground === 
                      'dark' 
                        ? 'text-gray-400' 
                        : 'text-gray-500' 
                    }`} 
                  > 
                    Available 
                  </p> 
 
                  <p 
                    className={`font-bold text-base ${ 
                      isFull 
                        ? 'text-red-600' 
                        : userBackground === 
                          'dark' 
                          ? 'text-white' 
                          : 'text-gray-900' 
                    }`} 
                  > 
                    {amount.toFixed( 
                      1 
                    )} 
                    L 
                  </p> 
                </div> 
 
                <div 
                  className={`rounded-lg p-2 text-center ${ 
                    userBackground === 
                    'dark' 
                      ? 'bg-gray-700/50' 
                      : 'bg-gray-50' 
                  }`} 
                > 
                  <p 
                    className={`text-sm ${ 
                      userBackground === 
                      'dark' 
                        ? 'text-gray-400' 
                        : 'text-gray-500' 
                    }`} 
                  > 
                    Capacity 
                  </p> 
 
                  <p 
                    className={`font-bold text-base ${ 
                      userBackground === 
                      'dark' 
                        ? 'text-white' 
                        : 'text-gray-900' 
                    }`} 
                  > 
                    {capacity}L 
                  </p> 
                </div> 
              </div> 
 
 
              {/* IMPORT COST INFORMATION */} 
              {fuelImport.importedLitres > 
                0 && ( 
                <div className="grid grid-cols-2 gap-2 mt-2"> 
                  <div 
                    className={`rounded-lg p-2 text-center ${ 
                      userBackground === 
                      'dark' 
                        ? 'bg-gray-700/50' 
                        : 'bg-gray-50' 
                    }`} 
                  > 
                    <p 
                      className={`text-sm ${ 
                        userBackground === 
                        'dark' 
                          ? 'text-gray-400' 
                          : 'text-gray-500' 
                      }`} 
                    > 
                      Import Cost 
                    </p> 
 
                    <p 
                      className={`font-bold text-base ${ 
                        userBackground === 
                        'dark' 
                          ? 'text-white' 
                          : 'text-gray-900' 
                      }`} 
                    > 
                      {fuelImport.totalCost > 
                      0 
                        ? `KSh ${fuelImport.totalCost.toLocaleString( 
                            undefined, 
                            { 
                              maximumFractionDigits: 2 
                            } 
                          )}` 
                        : 'Not recorded'} 
                    </p> 
                  </div> 
 
                  <div 
                    className={`rounded-lg p-2 text-center ${ 
                      userBackground === 
                      'dark' 
                        ? 'bg-gray-700/50' 
                        : 'bg-gray-50' 
                    }`} 
                  > 
                    <p 
                      className={`text-sm ${ 
                        userBackground === 
                        'dark' 
                          ? 'text-gray-400' 
                          : 'text-gray-500' 
                      }`} 
                    > 
                      Latest Price/L 
                    </p> 
 
                    <p className="font-bold text-blue-600 text-base"> 
                      {fuelImport.latestPricePerLiter > 
                      0 
                        ? `KSh ${fuelImport.latestPricePerLiter.toFixed( 
                            2 
                          )}` 
                        : 'Not recorded'} 
                    </p> 
                  </div> 
                </div> 
              )} 
 
 
              {/* Info Message */} 
              <div className="mt-3 text-center"> 
                <p 
                  className={`text-sm ${ 
                    userBackground === 
                    'dark' 
                      ? 'text-gray-400' 
                      : 'text-gray-400' 
                  } border-t ${ 
                    userBackground === 
                    'dark' 
                      ? 'border-gray-700' 
                      : 'border-gray-100' 
                  } pt-2`} 
                > 
                  Fuel is managed through 
                  imports and deliveries only 
                </p> 
              </div> 
            </div> 
          </div> 
        ); 
      }, 
      [ 
        getFuelStatus, 
        selectedFuel, 
        animate, 
        getTodayDeliveries, 
        userBackground, 
        getCardClass, 
        importSummary 
      ] 
    ); 
 
 
  // ========================================================== 
  // LOADING 
  // ========================================================== 
 
  if (loading) { 
    return ( 
      <div 
        className={`min-h-screen flex items-center justify-center ${getBackgroundClass()}`} 
      > 
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div> 
      </div> 
    ); 
  } 
 
 
    // ========================================================== 
  // ACTIVITY COUNTS 
  // ========================================================== 
 
  const totalActivities = 
    showAllActivities 
      ? filteredActivities.length 
      : Math.min( 
          10, 
          activityLog.length 
        ); 
 
  const hasMoreActivities = 
    activityLog.length > 10; 

  // FIXED: Added displayActivities definition
  const displayActivities = 
    showAllActivities 
      ? filteredActivities 
      : activityLog.slice(0, 10); 

  // Import activities counts
  const displayImports = 
    showAllImports 
      ? importActivities 
      : importActivities.slice(0, 10); 

  const hasMoreImports = 
    importActivities.length > 10; 

  // Driver fuel activities counts
  const displayDriverFuel = 
    showAllDriverFuel 
      ? driverFuelActivities 
      : driverFuelActivities.slice(0, 10); 

  const hasMoreDriverFuel = 
    driverFuelActivities.length > 10; 
 
 
  // ========================================================== 
  // TOTAL IMPORTS 
  // ========================================================== 
 
  const totalImportedLitres = 
    Object.values( 
      importSummary 
    ).reduce( 
      (total, item) => 
        total + 
        item.importedLitres, 
      0 
    ); 
 
  const totalImportCost = 
    Object.values( 
      importSummary 
    ).reduce( 
      (total, item) => 
        total + 
        item.totalCost, 
      0 
    ); 

  // Total driver fuel given
  const totalDriverFuelGiven = 
    Object.values( 
      driverFuelSummary 
    ).reduce( 
      (total, item) => 
        total + 
        item.totalLitresGiven, 
      0 
    ); 

  const totalDriversServed = 
    driverFuelActivities.length > 0 
      ? new Set(driverFuelActivities.map(e => e.driverId || e.driverName)).size 
      : 0; 
 
 
  // ========================================================== 
  // RETURN 
  // ========================================================== 
 
  return ( 
    <div 
      className={`min-h-screen p-4 md:p-6 transition-colors duration-300 ${getBackgroundClass()}`} 
    > 
      <div className="w-full max-w-full mx-auto space-y-6"> 
 
        {/* Header */} 
        <div className="flex flex-wrap items-center justify-between gap-4"> 
          <div> 
            <h1 className="text-3xl font-bold"> 
              Fuel Tanks 
            </h1> 
 
            <p 
              className={`text-base mt-1 ${ 
                userBackground === 
                'dark' 
                  ? 'text-gray-400' 
                  : 'text-gray-500' 
              }`} 
            > 
              Real-time fuel stock levels with AI tank visualization 
            </p> 
          </div> 
 
          <Link 
            href="/fuel" 
            className={`text-base ${ 
              userBackground === 
              'dark' 
                ? 'text-gray-400 hover:text-gray-200' 
                : 'text-gray-500 hover:text-gray-700' 
            } flex items-center space-x-1`} 
          > 
            <span>←</span> 
            <span> 
              Back to Fuel 
            </span> 
          </Link> 
        </div> 
 
 
        {/* Summary Cards */} 
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> 
          {( 
            Object.keys( 
              totalStock 
            ) as FuelType[] 
          ).map( 
            fuelType => { 
              const { 
                percentage 
              } = 
                getFuelStatus( 
                  fuelType 
                ); 
 
              const isFull = 
                totalStock[ 
                  fuelType 
                ] >= 
                TANK_CAPACITY[ 
                  fuelType 
                ]; 
 
              const todayDeliveries = 
                getTodayDeliveries(); 
 
              const deliveredToday = 
                todayDeliveries[ 
                  fuelType 
                ] || 0; 
 
              return ( 
                <div 
                  key={`summary-${fuelType}`} 
                  className={`rounded-lg shadow p-4 border ${ 
                    isFull 
                      ? 'border-red-500' 
                      : 'border-gray-200' 
                  } ${ 
                    fuelType === 
                    'Diesel' 
                      ? 'bg-cyan-500' 
                      : fuelType === 
                        'Kerosene' 
                        ? 'bg-blue-300' 
                        : fuelType === 
                          'Petrol' 
                          ? 'bg-red-300' 
                          : fuelType === 
                            'V-Power' 
                            ? 'bg-purple-500' 
                            : 'bg-white' 
                  }`} 
                > 
                  <p className="text-base text-gray-600"> 
                    {fuelType} 
                  </p> 
 
                  <p 
                    className={`text-2xl font-bold ${ 
                      isFull 
                        ? 'text-red-600' 
                        : 'text-gray-900' 
                    }`} 
                  > 
                    {totalStock[ 
                      fuelType 
                    ].toFixed( 
                      1 
                    )} 
                    L 
                  </p> 
 
                  <div className="flex items-center mt-1"> 
                    <div className="w-full bg-gray-200 rounded-full h-2.5"> 
                      <div 
                        className={`h-2.5 rounded-full ${ 
                          isFull 
                            ? 'bg-red-500' 
                            : percentage > 
                              80 
                              ? 'bg-green-500' 
                              : percentage > 
                                50 
                                ? 'bg-yellow-500' 
                                : percentage > 
                                  20 
                                  ? 'bg-orange-500' 
                                  : 'bg-red-500' 
                        }`} 
                        style={{ 
                          width: `${Math.min( 
                            percentage, 
                            100 
                          )}%` 
                        }} 
                      /> 
                    </div> 
 
                    <span className="text-sm ml-2 text-gray-500"> 
                      {percentage.toFixed( 
                        0 
                      )} 
                      % 
                    </span> 
                  </div> 
 
                  {isFull && ( 
                    <p className="text-sm text-red-600 mt-1 font-bold animate-pulse"> 
                      FULL 
                    </p> 
                  )} 
 
                  {deliveredToday > 
                    0 && ( 
                    <p className="text-sm text-blue-600 mt-1"> 
                      {deliveredToday.toFixed( 
                        1 
                      )} 
                      L today 
                    </p> 
                  )} 
                </div> 
              ); 
            } 
          )} 
        </div> 
 
 
        {/* ==================================================== 
            IMPORT SUMMARY 
        ==================================================== */} 
 
        <div 
          className={`rounded-xl shadow-sm p-6 border ${ 
            userBackground === 
            'dark' 
              ? 'border-gray-700' 
              : 'border-gray-200' 
          } ${getCardClass()}`} 
        > 
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4"> 
            <div> 
              <h2 
                className={`text-xl font-semibold ${ 
                  userBackground === 
                  'dark' 
                    ? 'text-white' 
                    : 'text-gray-900' 
                }`} 
              > 
                📦 Imported Fuel & Purchase Price 
              </h2> 
 
              <p 
                className={`text-sm mt-1 ${ 
                  userBackground === 
                  'dark' 
                    ? 'text-gray-400' 
                    : 'text-gray-500' 
                }`} 
              > 
                Fuel imported to main tank with actual recorded purchase cost per litre 
              </p> 
            </div> 
 
            <div className="flex gap-3"> 
              <div 
                className={`rounded-lg px-4 py-2 ${ 
                  userBackground === 
                  'dark' 
                    ? 'bg-gray-700' 
                    : 'bg-blue-200' 
                }`} 
              > 
                <p 
                  className={`text-sm ${ 
                    userBackground === 
                    'dark' 
                      ? 'text-gray-400' 
                      : 'text-gray-500' 
                  }`} 
                > 
                  Total Imported 
                </p> 
 
                <p className="font-bold text-blue-600 text-lg"> 
                  {totalImportedLitres.toLocaleString( 
                    undefined, 
                    { 
                      maximumFractionDigits: 1 
                    } 
                  )} 
                  L 
                </p> 
              </div> 
 
              <div 
                className={`rounded-lg px-4 py-2 ${ 
                  userBackground === 
                  'dark' 
                    ? 'bg-gray-700' 
                    : 'bg-green-200' 
                }`} 
              > 
                <p 
                  className={`text-sm ${ 
                    userBackground === 
                    'dark' 
                      ? 'text-gray-400' 
                      : 'text-gray-500' 
                  }`} 
                > 
                  Total Import Cost 
                </p> 
 
                <p className="font-bold text-green-600 text-lg"> 
                  {totalImportCost > 
                  0 
                    ? `KSh ${totalImportCost.toLocaleString( 
                        undefined, 
                        { 
                          maximumFractionDigits: 2 
                        } 
                      )}` 
                    : 'Not recorded'} 
                </p> 
              </div> 
            </div> 
          </div> 
 
 
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"> 
            {( 
              Object.keys( 
                importSummary 
              ) as FuelType[] 
            ).map( 
              fuelType => { 
                const item = 
                  importSummary[ 
                    fuelType 
                  ]; 
 
                const fuelColors: Record< 
                  FuelType, 
                  string 
                > = { 
                  Petrol: 
                    'border-red-200 bg-orange-200', 
                  Diesel: 
                    'border-green-200 bg-yellow-200', 
                  Kerosene: 
                    'border-blue-200 bg-olive-200', 
                  'V-Power': 
                    'border-purple-200 bg-teal-200' 
                }; 
 
                return ( 
                  <div 
                    key={`import-${fuelType}`} 
                    className={`rounded-lg border p-4 ${ 
                      userBackground === 
                      'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : fuelColors[ 
                            fuelType 
                          ] 
                    }`} 
                  > 
                    <div className="flex items-center justify-between mb-3"> 
                      <h3 
                        className={`font-bold text-lg ${ 
                          userBackground === 
                          'dark' 
                            ? 'text-white' 
                            : 'text-gray-800' 
                        }`} 
                      > 
                        {fuelType} 
                      </h3> 
 
                      <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-700"> 
                        IMPORT 
                      </span> 
                    </div> 
 
                    <div className="space-y-2"> 
                      <div className="flex justify-between"> 
                        <span 
                          className={`text-sm ${ 
                            userBackground === 
                            'dark' 
                              ? 'text-gray-400' 
                              : 'text-gray-500' 
                          }`} 
                        > 
                          Imported litres 
                        </span> 
 
                        <span 
                          className={`font-bold text-base ${ 
                            userBackground === 
                            'dark' 
                              ? 'text-white' 
                              : 'text-gray-900' 
                          }`} 
                        > 
                          {item.importedLitres.toLocaleString( 
                            undefined, 
                            { 
                              maximumFractionDigits: 1 
                            } 
                          )} 
                          L 
                        </span> 
                      </div> 
 
                      <div className="flex justify-between"> 
                        <span 
                          className={`text-sm ${ 
                            userBackground === 
                            'dark' 
                              ? 'text-gray-400' 
                              : 'text-gray-500' 
                          }`} 
                        > 
                          Average price/L 
                        </span> 
 
                        <span className="font-bold text-blue-600 text-base"> 
                          {item.averagePricePerLiter > 
                          0 
                            ? `KSh ${item.averagePricePerLiter.toFixed( 
                                2 
                              )}` 
                            : 'Not recorded'} 
                        </span> 
                      </div> 
 
                      <div className="flex justify-between"> 
                        <span 
                          className={`text-sm ${ 
                            userBackground === 
                            'dark' 
                              ? 'text-gray-400' 
                              : 'text-gray-500' 
                          }`} 
                        > 
                          Latest price/L 
                        </span> 
 
                        <span className="font-bold text-purple-600 text-base"> 
                          {item.latestPricePerLiter > 
                          0 
                            ? `KSh ${item.latestPricePerLiter.toFixed( 
                                2 
                              )}` 
                            : 'Not recorded'} 
                        </span> 
                      </div> 
 
                      <div className="flex justify-between border-t pt-2"> 
                        <span 
                          className={`text-sm ${ 
                            userBackground === 
                            'dark' 
                              ? 'text-gray-400' 
                              : 'text-gray-500' 
                          }`} 
                        > 
                          Total cost 
                        </span> 
 
                        <span className="font-bold text-green-600 text-base"> 
                          {item.totalCost > 
                          0 
                            ? `KSh ${item.totalCost.toLocaleString( 
                                undefined, 
                                { 
                                  maximumFractionDigits: 2 
                                } 
                              )}` 
                            : 'Not recorded'} 
                        </span> 
                      </div> 
                    </div> 
                  </div> 
                ); 
              } 
            )} 
          </div> 
 
          <div 
            className={`mt-4 rounded-lg p-3 text-sm ${ 
              userBackground === 
              'dark' 
                ? 'bg-gray-700/50 text-gray-400' 
                : 'bg-gray-50 text-gray-500' 
            }`} 
          > 
            <strong> 
              Price calculation: 
            </strong>{' '} 
            Average price per litre is calculated as a weighted average using the litres purchased at each recorded purchase price. This gives you a more accurate cost basis for pricing your fuel. 
          </div> 
        </div> 
 
 
        {/* ==================================================== 
            DRIVER FUEL SUMMARY 
        ==================================================== */} 
 
        <div 
          className={`rounded-xl shadow-sm p-6 border ${ 
            userBackground === 
            'dark' 
              ? 'border-gray-700' 
              : 'border-gray-200' 
          } ${getCardClass()}`} 
        > 
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4"> 
            <div> 
              <h2 
                className={`text-xl font-semibold ${ 
                  userBackground === 
                  'dark' 
                    ? 'text-white' 
                    : 'text-gray-900' 
                }`} 
              > 
                🚛 Fuel Given to Drivers 
              </h2> 
 
              <p 
                className={`text-sm mt-1 ${ 
                  userBackground === 
                  'dark' 
                    ? 'text-gray-400' 
                    : 'text-gray-500' 
                }`} 
              > 
                Fuel distributed from main tank to drivers 
              </p> 
            </div> 
 
            <div className="flex gap-3"> 
              <div 
                className={`rounded-lg px-4 py-2 ${ 
                  userBackground === 
                  'dark' 
                    ? 'bg-gray-700' 
                    : 'bg-orange-200' 
                }`} 
              > 
                <p 
                  className={`text-sm ${ 
                    userBackground === 
                    'dark' 
                      ? 'text-gray-400' 
                      : 'text-gray-500' 
                  }`} 
                > 
                  Total Given 
                </p> 
 
                <p className="font-bold text-orange-600 text-lg"> 
                  {totalDriverFuelGiven.toLocaleString( 
                    undefined, 
                    { 
                      maximumFractionDigits: 1 
                    } 
                  )} 
                  L 
                </p> 
              </div> 
 
              <div 
                className={`rounded-lg px-4 py-2 ${ 
                  userBackground === 
                  'dark' 
                    ? 'bg-gray-700' 
                    : 'bg-purple-200' 
                }`} 
              > 
                <p 
                  className={`text-sm ${ 
                    userBackground === 
                    'dark' 
                      ? 'text-gray-400' 
                      : 'text-gray-500' 
                  }`} 
                > 
                  Drivers Served 
                </p> 
 
                <p className="font-bold text-purple-600 text-lg"> 
                  {totalDriversServed} 
                </p> 
              </div> 
            </div> 
          </div> 
 
 
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"> 
            {( 
              Object.keys( 
                driverFuelSummary 
              ) as FuelType[] 
            ).map( 
              fuelType => { 
                const item = 
                  driverFuelSummary[ 
                    fuelType 
                  ]; 
 
                const fuelColors: Record< 
                  FuelType, 
                  string 
                > = { 
                  Petrol: 
                    'border-red-200 bg-teal-300', 
                  Diesel: 
                    'border-green-200 bg-yellow-300', 
                  Kerosene: 
                    'border-blue-200 bg-orange-300', 
                  'V-Power': 
                    'border-purple-200 bg-olive-300' 
                }; 
 
                return ( 
                  <div 
                    key={`driver-${fuelType}`} 
                    className={`rounded-lg border p-4 ${ 
                      userBackground === 
                      'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : fuelColors[ 
                            fuelType 
                          ] 
                    }`} 
                  > 
                    <div className="flex items-center justify-between mb-3"> 
                      <h3 
                        className={`font-bold text-lg ${ 
                          userBackground === 
                          'dark' 
                            ? 'text-white' 
                            : 'text-gray-800' 
                        }`} 
                      > 
                        {fuelType} 
                      </h3> 
 
                      <span className="text-sm px-2 py-1 rounded-full bg-orange-100 text-orange-700"> 
                        DRIVERS 
                      </span> 
                    </div> 
 
                    <div className="space-y-2"> 
                      <div className="flex justify-between"> 
                        <span 
                          className={`text-sm ${ 
                            userBackground === 
                            'dark' 
                              ? 'text-gray-400' 
                              : 'text-gray-500' 
                          }`} 
                        > 
                          Given to drivers 
                        </span> 
 
                        <span 
                          className={`font-bold text-base ${ 
                            userBackground === 
                            'dark' 
                              ? 'text-white' 
                              : 'text-gray-900' 
                          }`} 
                        > 
                          {item.totalLitresGiven.toLocaleString( 
                            undefined, 
                            { 
                              maximumFractionDigits: 1 
                            } 
                          )} 
                          L 
                        </span> 
                      </div> 
 
                      <div className="flex justify-between"> 
                        <span 
                          className={`text-sm ${ 
                            userBackground === 
                            'dark' 
                              ? 'text-gray-400' 
                              : 'text-gray-500' 
                          }`} 
                        > 
                          Total drivers 
                        </span> 
 
                        <span 
                          className={`font-bold text-base ${ 
                            userBackground === 
                            'dark' 
                              ? 'text-white' 
                              : 'text-gray-900' 
                          }`} 
                        > 
                          {item.totalDrivers} 
                        </span> 
                      </div> 
 
                      <div className="flex justify-between border-t pt-2"> 
                        <span 
                          className={`text-sm ${ 
                            userBackground === 
                            'dark' 
                              ? 'text-gray-400' 
                              : 'text-gray-500' 
                          }`} 
                        > 
                          Transactions 
                        </span> 
 
                        <span 
                          className={`font-bold text-base ${ 
                            userBackground === 
                            'dark' 
                              ? 'text-white' 
                              : 'text-gray-900' 
                          }`} 
                        > 
                          {item.entries.length} 
                        </span> 
                      </div> 
                    </div> 
                  </div> 
                ); 
              } 
            )} 
          </div> 
 
          <div 
            className={`mt-4 rounded-lg p-3 text-sm ${ 
              userBackground === 
              'dark' 
                ? 'bg-gray-700/50 text-gray-400' 
                : 'bg-gray-50 text-gray-500' 
            }`} 
          > 
            <strong> 
              Note: 
            </strong>{' '} 
            This shows fuel that has been given to drivers from the main tank. Each transaction records the driver, amount, fuel type, and admin who approved the distribution. 
          </div> 
        </div> 
 
 
        {/* Fuel Tank Visualizations - View Only */} 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
          {( 
            Object.keys( 
              totalStock 
            ) as FuelType[] 
          ).map( 
            fuelType => 
              renderFuelTank( 
                fuelType 
              ) 
          )} 
        </div> 
 
 
        {/* ==================================================== 
            IMPORT ACTIVITY LOG 
        ==================================================== */} 
 
        {importActivities.length > 
          0 && ( 
          <div 
            className={`rounded-xl shadow-sm p-6 border ${ 
              userBackground === 
              'dark' 
                ? 'border-gray-700' 
                : 'border-gray-200' 
            } ${getCardClass()}`} 
          > 
            <div className="flex items-center justify-between mb-4"> 
              <h2 
                className={`text-xl font-semibold ${ 
                  userBackground === 
                  'dark' 
                    ? 'text-white' 
                    : 'text-gray-900' 
                }`} 
              > 
                📦 Import Activity Log 
                <span 
                  className={`text-base font-normal ml-2 ${ 
                    userBackground === 
                    'dark' 
                      ? 'text-gray-400' 
                      : 'text-gray-500' 
                  }`} 
                > 
                  ({importActivities.length} imports) 
                </span> 
              </h2> 
 
              {hasMoreImports && ( 
                <button 
                  onClick={() => 
                    setShowAllImports( 
                      !showAllImports 
                    ) 
                  } 
                  className="text-base text-blue-600 hover:text-blue-800 font-medium transition" 
                > 
                  {showAllImports 
                    ? 'Show Less' 
                    : 'See All Imports'} 
                </button> 
              )} 
            </div> 
 
            <div className="max-h-96 overflow-y-auto"> 
              <div className="space-y-2"> 
                {displayImports.length > 
                0 ? ( 
                  displayImports.map( 
                    ( 
                      entry, 
                      index 
                    ) => { 
                      const importPrice = 
                        isFuelImportEntry( 
                          entry 
                        ) 
                          ? getImportPricePerLiter( 
                              entry 
                            ) 
                          : 0; 
 
                      const importCost = 
                        isFuelImportEntry( 
                          entry 
                        ) 
                          ? getImportTotalCost( 
                              entry 
                            ) 
                          : 0; 
 
                      return ( 
                        <div 
                          key={`import-log-${index}`} 
                          className={`p-3 rounded-lg text-base ${ 
                            userBackground === 
                            'dark' 
                              ? 'bg-gray-800/50' 
                              : 'bg-blue-50' 
                          }`} 
                        > 
                          <div className="flex items-center justify-between gap-3"> 
                            <div className="flex items-center space-x-3 min-w-0"> 
                              <span 
                                className={`px-2 py-1 rounded-full text-sm font-medium whitespace-nowrap bg-green-100 text-green-700`} 
                              > 
                                Imported 
                              </span> 
 
                              <span 
                                className={`min-w-0 text-base ${ 
                                  userBackground === 
                                  'dark' 
                                    ? 'text-gray-300' 
                                    : 'text-gray-600' 
                                }`} 
                              > 
                                {entry.amount} 
                                L{' '} 
                                {entry.fuelType} 
                                {entry.reason && 
                                  ` - ${entry.reason}`} 
                                {` (By: ${getImportAdminDisplay(entry)})`} 
                              </span> 
                            </div> 
 
                            <span 
                              className={`text-sm whitespace-nowrap ${ 
                                userBackground === 
                                'dark' 
                                  ? 'text-gray-400' 
                                  : 'text-gray-400' 
                              }`} 
                            > 
                              {entry.date} 
                            </span> 
                          </div> 
 
                          {/* IMPORT PRICE DETAILS */} 
                          <div className="mt-2 ml-0 flex flex-wrap gap-2"> 
                            <span className="text-sm bg-blue-100 text-blue-700 rounded px-2 py-1"> 
                              Imported:{' '} 
                              {Number( 
                                entry.amount || 
                                  0 
                              ).toLocaleString()}{' '} 
                              L 
                            </span> 
 
                            <span className="text-sm bg-purple-100 text-purple-700 rounded px-2 py-1"> 
                              Price/L:{' '} 
                              {importPrice > 
                              0 
                                ? `KSh ${importPrice.toFixed( 
                                    2 
                                  )}` 
                                : 'Not recorded'} 
                            </span> 
 
                            <span className="text-sm bg-green-100 text-green-700 rounded px-2 py-1"> 
                              Total:{' '} 
                              {importCost > 
                              0 
                                ? `KSh ${importCost.toLocaleString( 
                                    undefined, 
                                    { 
                                      maximumFractionDigits: 2 
                                    } 
                                  )}` 
                                : 'Not recorded'} 
                            </span> 
 
                            {entry.importReference && ( 
                              <span className="text-sm bg-gray-100 text-gray-700 rounded px-2 py-1"> 
                                Ref:{' '} 
                                { 
                                  entry.importReference 
                                } 
                              </span> 
                            )} 
                          </div> 
 
                          <div className="mt-2 flex flex-wrap gap-2"> 
                            {entry.previousTankAmount !== 
                              undefined && ( 
                              <span 
                                className={`text-sm ${ 
                                  userBackground === 
                                  'dark' 
                                    ? 'text-gray-400' 
                                    : 'text-gray-400' 
                                }`} 
                              > 
                                Tank:{' '} 
                                {entry.previousTankAmount.toFixed( 
                                  1 
                                )} 
                                L →{' '} 
                                {entry.newTankAmount?.toFixed( 
                                  1 
                                )} 
                                L 
                              </span> 
                            )} 
 
                            {entry.capacityInfo && ( 
                              <span className="text-sm text-purple-600 font-medium"> 
                                {entry.capacityInfo} 
                              </span> 
                            )} 
                          </div> 
                        </div> 
                      ); 
                    } 
                  ) 
                ) : ( 
                  <div 
                    className={`text-center py-8 ${ 
                      userBackground === 
                      'dark' 
                        ? 'text-gray-400' 
                        : 'text-gray-500' 
                    }`} 
                  > 
                    No import activities found 
                  </div> 
                )} 
              </div> 
            </div> 
          </div> 
        )} 
 
 
        {/* ==================================================== 
            DRIVER FUEL ACTIVITY LOG 
        ==================================================== */} 
 
        {driverFuelActivities.length > 
          0 && ( 
          <div 
            className={`rounded-xl shadow-sm p-6 border ${ 
              userBackground === 
              'dark' 
                ? 'border-gray-700' 
                : 'border-gray-200' 
            } ${getCardClass()}`} 
          > 
            <div className="flex items-center justify-between mb-4"> 
              <h2 
                className={`text-xl font-semibold ${ 
                  userBackground === 
                  'dark' 
                    ? 'text-white' 
                    : 'text-gray-900' 
                }`} 
              > 
                🚛 Driver Fuel Activity 
                <span 
                  className={`text-base font-normal ml-2 ${ 
                    userBackground === 
                    'dark' 
                      ? 'text-gray-400' 
                      : 'text-gray-500' 
                  }`} 
                > 
                  ({driverFuelActivities.length} driver top-ups) 
                </span> 
              </h2> 
 
              {hasMoreDriverFuel && ( 
                <button 
                  onClick={() => 
                    setShowAllDriverFuel( 
                      !showAllDriverFuel 
                    ) 
                  } 
                  className="text-base text-blue-600 hover:text-blue-800 font-medium transition" 
                > 
                  {showAllDriverFuel 
                    ? 'Show Less' 
                    : 'See All Driver Top-ups'} 
                </button> 
              )} 
            </div> 
 
            <div className="max-h-96 overflow-y-auto"> 
              <div className="space-y-2"> 
                {displayDriverFuel.length > 
                0 ? ( 
                  displayDriverFuel.map( 
                    ( 
                      entry, 
                      index 
                    ) => { 
                      return ( 
                        <div 
                          key={`driver-log-${index}`} 
                          className={`p-3 rounded-lg text-base ${ 
                            userBackground === 
                            'dark' 
                              ? 'bg-gray-800/50' 
                              : 'bg-orange-50' 
                          }`} 
                        > 
                          <div className="flex items-center justify-between gap-3"> 
                            <div className="flex items-center space-x-3 min-w-0"> 
                              <span 
                                className={`px-2 py-1 rounded-full text-sm font-medium whitespace-nowrap bg-orange-100 text-orange-700`} 
                              > 
                                Given to Driver 
                              </span> 
 
                              <span 
                                className={`min-w-0 text-base ${ 
                                  userBackground === 
                                  'dark' 
                                    ? 'text-gray-300' 
                                    : 'text-gray-600' 
                                }`} 
                              > 
                                {entry.amount} 
                                L{' '} 
                                {entry.fuelType} 
                                {entry.driverName && 
                                  ` - Driver: ${entry.driverName}`} 
                                {(entry.adminName || entry.updatedBy) && 
                                  ` (Admin: ${entry.adminName || entry.updatedBy})`} 
                                {entry.reason && 
                                  ` - ${entry.reason}`} 
                              </span> 
                            </div> 
 
                            <span 
                              className={`text-sm whitespace-nowrap ${ 
                                userBackground === 
                                'dark' 
                                  ? 'text-gray-400' 
                                  : 'text-gray-400' 
                              }`} 
                            > 
                              {entry.date} 
                            </span> 
                          </div> 
 
                          <div className="mt-2 flex flex-wrap gap-2"> 
                            {entry.driverId && ( 
                              <span className="text-sm bg-gray-100 text-gray-700 rounded px-2 py-1"> 
                                Driver ID: {entry.driverId.substring(0, 12)}... 
                              </span> 
                            )} 
 
                            {entry.deliveryId && ( 
                              <span className="text-sm bg-gray-100 text-gray-700 rounded px-2 py-1"> 
                                Delivery: {entry.deliveryId} 
                              </span> 
                            )} 
 
                            {entry.saleId && ( 
                              <span className="text-sm bg-gray-100 text-gray-700 rounded px-2 py-1"> 
                                Sale: {entry.saleId} 
                              </span> 
                            )} 
 
                            {entry.customerName && ( 
                              <span className="text-sm bg-gray-100 text-gray-700 rounded px-2 py-1"> 
                                Customer: {entry.customerName} 
                              </span> 
                            )} 
 
                            {entry.truckNumber && ( 
                              <span className="text-sm bg-gray-100 text-gray-700 rounded px-2 py-1"> 
                                Truck: {entry.truckNumber} 
                              </span> 
                            )} 
 
                            {entry.previousTankAmount !== 
                              undefined && ( 
                              <span 
                                className={`text-sm ${ 
                                  userBackground === 
                                  'dark' 
                                    ? 'text-gray-400' 
                                    : 'text-gray-400' 
                                }`} 
                              > 
                                Tank:{' '} 
                                {entry.previousTankAmount.toFixed( 
                                  1 
                                )} 
                                L →{' '} 
                                {entry.newTankAmount?.toFixed( 
                                  1 
                                )} 
                                L 
                              </span> 
                            )} 
 
                            {entry.capacityInfo && ( 
                              <span className="text-sm text-purple-600 font-medium"> 
                                {entry.capacityInfo} 
                              </span> 
                            )} 
                          </div> 
                        </div> 
                      ); 
                    } 
                  ) 
                ) : ( 
                  <div 
                    className={`text-center py-8 ${ 
                      userBackground === 
                      'dark' 
                        ? 'text-gray-400' 
                        : 'text-gray-500' 
                    }`} 
                  > 
                    No driver fuel activities found 
                  </div> 
                )} 
              </div> 
            </div> 
          </div> 
        )} 
 
 
        {/* ==================================================== 
            FULL ACTIVITY LOG (Combined - Keep for reference) 
        ==================================================== */} 
 
        {activityLog.length > 
          0 && ( 
          <div 
            className={`rounded-xl shadow-sm p-6 border ${ 
              userBackground === 
              'dark' 
                ? 'border-gray-700' 
                : 'border-gray-200' 
            } ${getCardClass()}`} 
          > 
            <div className="flex items-center justify-between mb-4"> 
              <h2 
                className={`text-xl font-semibold ${ 
                  userBackground === 
                  'dark' 
                    ? 'text-white' 
                    : 'text-gray-900' 
                }`} 
              > 
                Full Activity Log 
                <span 
                  className={`text-base font-normal ml-2 ${ 
                    userBackground === 
                    'dark' 
                      ? 'text-gray-400' 
                      : 'text-gray-500' 
                  }`} 
                > 
                  ({totalActivities} of{' '} 
                  {activityLog.length}{' '} 
                  activities) 
                </span> 
              </h2> 
 
              {hasMoreActivities && ( 
                <button 
                  onClick={() => 
                    setShowAllActivities( 
                      !showAllActivities 
                    ) 
                  } 
                  className="text-base text-blue-600 hover:text-blue-800 font-medium transition" 
                > 
                  {showAllActivities 
                    ? 'Show Less' 
                    : 'See All Activities'} 
                </button> 
              )} 
            </div> 
 
 
            {showAllActivities && ( 
              <div 
                className={`mb-4 p-4 rounded-lg border ${ 
                  userBackground === 
                  'dark' 
                    ? 'border-gray-700 bg-gray-800/50' 
                    : 'border-gray-200 bg-gray-50' 
                }`} 
              > 
                <div className="flex flex-wrap items-end gap-3"> 
                  <div> 
                    <label 
                      className={`block text-sm font-medium ${ 
                        userBackground === 
                        'dark' 
                          ? 'text-gray-400' 
                          : 'text-red-800' 
                      } mb-1`} 
                    > 
                      Date From 
                    </label> 
 
                    <input 
                      type="date" 
                      value={ 
                        dateFrom 
                      } 
                      onChange={e => 
                        setDateFrom( 
                          e.target 
                            .value 
                        ) 
                      } 
                      className={`px-3 py-1.5 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${ 
                        userBackground === 
                        'dark' 
                          ? 'bg-gray-700 text-white border-gray-600' 
                          : 'bg-white border-gray-300' 
                      }`} 
                    /> 
                  </div> 
 
                  <div> 
                    <label 
                      className={`block text-sm font-medium ${ 
                        userBackground === 
                        'dark' 
                          ? 'text-gray-500' 
                          : 'text-red-800' 
                      } mb-1`} 
                    > 
                      Date To 
                    </label> 
 
                    <input 
                      type="date" 
                      value={ 
                        dateTo 
                      } 
                      onChange={e => 
                        setDateTo( 
                          e.target 
                            .value 
                        ) 
                      } 
                      className={`px-3 py-1.5 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${ 
                        userBackground === 
                        'dark' 
                          ? 'bg-gray-700 text-white border-gray-600' 
                          : 'bg-white border-gray-300' 
                      }`} 
                    /> 
                  </div> 
 
                  <button 
                    onClick={ 
                      filterActivitiesByDate 
                    } 
                    disabled={ 
                      isFiltering || 
                      (!dateFrom && 
                        !dateTo) 
                    } 
                    className={`px-4 py-1.5 text-base font-medium text-white rounded-lg transition ${ 
                      isFiltering || 
                      (!dateFrom && 
                        !dateTo) 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600' 
                    }`} 
                  > 
                    {isFiltering 
                      ? 'Filtering...' 
                      : 'Filter'} 
                  </button> 
 
                  {(dateFrom || 
                    dateTo) && ( 
                    <button 
                      onClick={ 
                        resetDateFilter 
                      } 
                      className={`px-4 py-1.5 text-base font-medium rounded-lg transition ${ 
                        userBackground === 
                        'dark' 
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
 
 
            <div className="max-h-96 overflow-y-auto"> 
              <div className="space-y-2"> 
                {displayActivities.length > 
                0 ? ( 
                  displayActivities.map( 
                    ( 
                      entry, 
                      index 
                    ) => { 
                      const importPrice = 
                        isFuelImportEntry( 
                          entry 
                        ) && !isDriverFuelEntry(entry) 
                          ? getImportPricePerLiter( 
                              entry 
                            ) 
                          : 0; 
 
                      const importCost = 
                        isFuelImportEntry( 
                          entry 
                        ) && !isDriverFuelEntry(entry) 
                          ? getImportTotalCost( 
                              entry 
                            ) 
                          : 0; 
 
                      const isDriverFuel = isDriverFuelEntry(entry) || entry.action === 'remove'; 
 
                      return ( 
                        <div 
                          key={`log-${index}`} 
                          className={`p-3 rounded-lg text-base ${ 
                            userBackground === 
                            'dark' 
                              ? 'bg-gray-800/50' 
                              : isDriverFuel 
                                ? 'bg-orange-50' 
                                : 'bg-blue-50' 
                          }`} 
                        > 
                          <div className="flex items-center justify-between gap-3"> 
                            <div className="flex items-center space-x-3 min-w-0"> 
                              <span 
                                className={`px-2 py-1 rounded-full text-sm font-medium whitespace-nowrap ${ 
                                  isDriverFuel 
                                    ? 'bg-orange-100 text-orange-700' 
                                    : 'bg-green-100 text-green-700' 
                                }`} 
                              > 
                                {isDriverFuel ? 'Driver' : 'Import'} 
                              </span> 
 
                              <span 
                                className={`min-w-0 text-base ${ 
                                  userBackground === 
                                  'dark' 
                                    ? 'text-gray-300' 
                                    : 'text-gray-600' 
                                }`} 
                              > 
                                {entry.actionType}:{' '} 
                                {entry.amount} 
                                L{' '} 
                                {entry.fuelType} 
 
                                {entry.reason && 
                                  ` - ${entry.reason}`} 
 
                                {entry.driverName && 
                                  ` (${entry.driverName})`} 
 
                                {(entry.adminName || entry.updatedBy) && 
                                  ` (Admin: ${entry.adminName || entry.updatedBy})`} 
                              </span> 
                            </div> 
 
                            <span 
                              className={`text-sm whitespace-nowrap ${ 
                                userBackground === 
                                'dark' 
                                  ? 'text-gray-400' 
                                  : 'text-gray-400' 
                              }`} 
                            > 
                              {entry.date} 
                            </span> 
                          </div> 
 
 
                          {/* IMPORT PRICE DETAILS - Only for imports */} 
                          {!isDriverFuel && isFuelImportEntry(entry) && ( 
                            <div className="mt-2 ml-0 flex flex-wrap gap-2"> 
                              <span className="text-sm bg-blue-100 text-blue-700 rounded px-2 py-1"> 
                                Imported:{' '} 
                                {Number( 
                                  entry.amount || 
                                    0 
                                ).toLocaleString()}{' '} 
                                L 
                              </span> 
 
                              <span className="text-sm bg-purple-100 text-purple-700 rounded px-2 py-1"> 
                                Price/L:{' '} 
                                {importPrice > 
                                0 
                                  ? `KSh ${importPrice.toFixed( 
                                      2 
                                    )}` 
                                  : 'Not recorded'} 
                              </span> 
 
                              <span className="text-sm bg-green-100 text-green-700 rounded px-2 py-1"> 
                                Total:{' '} 
                                {importCost > 
                                0 
                                  ? `KSh ${importCost.toLocaleString( 
                                      undefined, 
                                      { 
                                        maximumFractionDigits: 2 
                                      } 
                                    )}` 
                                  : 'Not recorded'} 
                              </span> 
 
                              {entry.importReference && ( 
                                <span className="text-sm bg-gray-100 text-gray-700 rounded px-2 py-1"> 
                                  Ref:{' '} 
                                  { 
                                    entry.importReference 
                                  } 
                                </span> 
                              )} 
                            </div> 
                          )} 
 
 
                          {/* Driver fuel details */} 
                          {isDriverFuel && ( 
                            <div className="mt-2 ml-0 flex flex-wrap gap-2"> 
                              {entry.driverId && ( 
                                <span className="text-sm bg-gray-100 text-gray-700 rounded px-2 py-1"> 
                                  Driver ID: {entry.driverId.substring(0, 12)}... 
                                </span> 
                              )} 
 
                              {entry.deliveryId && ( 
                                <span className="text-sm bg-gray-100 text-gray-700 rounded px-2 py-1"> 
                                  Delivery: {entry.deliveryId} 
                                </span> 
                              )} 
 
                              {entry.saleId && ( 
                                <span className="text-sm bg-gray-100 text-gray-700 rounded px-2 py-1"> 
                                  Sale: {entry.saleId} 
                                </span> 
                              )} 
 
                              {entry.customerName && ( 
                                <span className="text-sm bg-gray-100 text-gray-700 rounded px-2 py-1"> 
                                  Customer: {entry.customerName} 
                                </span> 
                              )} 
 
                              {entry.truckNumber && ( 
                                <span className="text-sm bg-gray-100 text-gray-700 rounded px-2 py-1"> 
                                  Truck: {entry.truckNumber} 
                                </span> 
                              )} 
                            </div> 
                          )} 
 
 
                          <div className="mt-2 flex flex-wrap gap-2"> 
 
                            {(entry.adminName || entry.updatedBy) && (
                              <span className="text-sm bg-indigo-100 text-indigo-700 rounded px-2 py-1">
                                Admin: {entry.adminName || entry.updatedBy}
                              </span>
                            )}
                            {entry.previousTankAmount !== 
                              undefined && ( 
                              <span 
                                className={`text-sm ${ 
                                  userBackground === 
                                  'dark' 
                                    ? 'text-gray-400' 
                                    : 'text-gray-400' 
                                }`} 
                              > 
                                Tank:{' '} 
                                {entry.previousTankAmount.toFixed( 
                                  1 
                                )} 
                                L →{' '} 
                                {entry.newTankAmount?.toFixed( 
                                  1 
                                )} 
                                L 
                              </span> 
                            )} 
 
                            {entry.capacityInfo && ( 
                              <span className="text-sm text-purple-600 font-medium"> 
                                {entry.capacityInfo} 
                              </span> 
                            )} 
                          </div> 
                        </div> 
                      ); 
                    } 
                  ) 
                ) : ( 
                  <div 
                    className={`text-center py-8 ${ 
                      userBackground === 
                      'dark' 
                        ? 'text-gray-400' 
                        : 'text-gray-500' 
                    }`} 
                  > 
                    No activities found 
                  </div> 
                )} 
              </div> 
            </div> 
          </div> 
        )} 
 
 
        {/* Legend */} 
        <div 
          className={`rounded-lg p-4 border ${ 
            userBackground === 
            'dark' 
              ? 'border-gray-700 bg-gray-800/50' 
              : 'border-blue-200 bg-blue-50' 
          }`} 
        > 
          <div className="flex flex-wrap items-center justify-between gap-2"> 
            <div className="flex items-center space-x-4"> 
              <span 
                className={`text-base font-medium ${ 
                  userBackground === 
                  'dark' 
                    ? 'text-gray-300' 
                    : 'text-blue-800' 
                }`} 
              > 
                Legend: 
              </span> 
 
              <span 
                className={`text-base ${ 
                  userBackground === 
                  'dark' 
                    ? 'text-gray-300' 
                    : 'text-blue-700' 
                }`} 
              > 
                🟢 Full (80%+) 
              </span> 
 
              <span 
                className={`text-base ${ 
                  userBackground === 
                  'dark' 
                    ? 'text-gray-300' 
                    : 'text-blue-700' 
                }`} 
              > 
                🟡 Moderate (50-80%) 
              </span> 
 
              <span 
                className={`text-base ${ 
                  userBackground === 
                  'dark' 
                    ? 'text-gray-300' 
                    : 'text-blue-700' 
                }`} 
              > 
                🟠 Low (20-50%) 
              </span> 
 
              <span 
                className={`text-base ${ 
                  userBackground === 
                  'dark' 
                    ? 'text-gray-300' 
                    : 'text-blue-700' 
                }`} 
              > 
                🔴 Critical (0-20%) 
              </span> 
            </div> 
 
            <div className="flex items-center gap-3"> 
              <span 
                className={`text-base ${ 
                  userBackground === 
                  'dark' 
                    ? 'text-gray-300' 
                    : 'text-blue-700' 
                }`} 
              > 
                📦 Import = Fuel added to main tank 
              </span> 
              <span 
                className={`text-base ${ 
                  userBackground === 
                  'dark' 
                    ? 'text-gray-300' 
                    : 'text-orange-700' 
                }`} 
              > 
                🚛 Driver = Fuel given to drivers 
              </span> 
            </div> 
          </div> 
        </div> 
      </div> 
 
 
      {/* CSS Animations */} 
      <style jsx>{` 
        @keyframes wave { 
          0% { 
            transform: translateX(-100%) rotate(0deg); 
          } 
 
          100% { 
            transform: translateX(100%) rotate(0deg); 
          } 
        } 
 
        @keyframes shimmer { 
          0% { 
            opacity: 0.3; 
          } 
 
          50% { 
            opacity: 0.6; 
          } 
 
          100% { 
            opacity: 0.3; 
          } 
        } 
 
        @keyframes pulse-slow { 
          0% { 
            opacity: 1; 
          } 
 
          50% { 
            opacity: 0.9; 
          } 
 
          100% { 
            opacity: 1; 
          } 
        } 
 
        @keyframes pulse { 
          0% { 
            opacity: 1; 
          } 
 
          50% { 
            opacity: 0.5; 
          } 
 
          100% { 
            opacity: 1; 
          } 
        } 
 
        .animate-wave { 
          animation: wave 4s linear infinite; 
        } 
 
        .animate-shimmer { 
          animation: shimmer 3s ease-in-out infinite; 
        } 
 
        .animate-pulse-slow { 
          animation: pulse-slow 1s ease-in-out; 
        } 
 
        .animate-pulse { 
          animation: pulse 1.5s ease-in-out infinite; 
        } 
      `}</style> 
    </div> 
  ); 
}