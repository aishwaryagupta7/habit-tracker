import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Helper to get day name from date
export const getDayFromDate = (date: Date): string => {
  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  return days[date.getDay()];
};

// Helper to format date as YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get available days (current day and past 6 days) - for day selector
export const getAvailableDays = (): string[] => {
  const today = new Date();
  const days = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(getDayFromDate(date));
  }
  
  return days;
};

// Get available dates (current day and past 6 days) - for day selector
export const getAvailableDates = (): string[] => {
  const today = new Date();
  const dates = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(formatDate(date));
  }
  
  return dates;
};

// Get chart days (previous 7 days from today) - for graph data
export const getChartDays = (): string[] => {
  const today = new Date();
  const days = [];
  
  // Get previous 7 days from today (including today)
  for (let i = 7; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(getDayFromDate(date));
  }
  
  return days;
};

// Check if day is selectable (today or in the past)
export const isDaySelectable = (dayName: string): boolean => {
  const today = new Date();
  const todayName = getDayFromDate(today);
  const availableDays = getAvailableDays();
  const todayIndex = availableDays.indexOf(todayName);
  const dayIndex = availableDays.indexOf(dayName);
  
  return dayIndex !== -1 && dayIndex <= todayIndex;
};

// Get the day that represents "yesterday" (the day we're checking in for)
export const getYesterdayDay = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate()-1);
  return getDayFromDate(yesterday);
};

// Get current day name
export const getCurrentDay = (): string => {
  return getDayFromDate(new Date());
};

// Generate user-specific document ID
const getUserDayDocId = (userId: string, dayName: string): string => {
  return `${userId}_${dayName}`;
};

// Get today's display data (shows yesterday's actual data in today's card) - NOW USER-SPECIFIC
export const getTodayDisplayData = async (userId: string): Promise<DayData> => {
  const yesterdayDay = getYesterdayDay();
  const yesterdayData = await getDayData(yesterdayDay, userId);
  
  // If yesterday has data, use it. Otherwise return empty data.
  if (yesterdayData.checkInHistory.length > 0 || 
      yesterdayData.stats.sleep > 0 || 
      yesterdayData.stats.water > 0 || 
      yesterdayData.stats.screenTime > 0) {
    return yesterdayData;
  }
  
  return {
    stats: { sleep: 0, water: 0, screenTime: 0 },
    checkInHistory: []
  };
};

// Get data for a specific day - NOW USER-SPECIFIC
export const getDayData = async (dayName: string, userId: string): Promise<DayData> => {
  try {
    const docId = getUserDayDocId(userId, dayName);
    const docRef = doc(db, 'dailyStats', docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as DayData;
    } else {
      // Return default data if no data exists
      return {
        stats: { sleep: 0, water: 0, screenTime: 0 },
        checkInHistory: []
      };
    }
  } catch (error) {
    console.error('Error getting day data:', error);
    return {
      stats: { sleep: 0, water: 0, screenTime: 0 },
      checkInHistory: []
    };
  }
};

// Save check-in data - NOW USER-SPECIFIC
export const saveCheckIn = async (dayName: string, checkInData: CheckInEntry, userId: string): Promise<void> => {
  try {
    const docId = getUserDayDocId(userId, dayName);
    const docRef = doc(db, 'dailyStats', docId);
    const docSnap = await getDoc(docRef);
    
    // Add userId to the data structure
    const dataToSave = {
      userId, // Include userId in the document
      stats: {
        sleep: checkInData.sleep,
        water: checkInData.water,
        screenTime: checkInData.screenTime
      },
      checkInHistory: [checkInData]
    };
    
    if (docSnap.exists()) {
      const existingData = docSnap.data() as DayData;
      
      // Remove existing entry for the same date if it exists
      const filteredHistory = existingData.checkInHistory.filter(
        entry => entry.date !== checkInData.date
      );
      
      // Update the document
      await updateDoc(docRef, {
        userId, // Ensure userId is always present
        stats: {
          sleep: checkInData.sleep,
          water: checkInData.water,
          screenTime: checkInData.screenTime
        },
        checkInHistory: [...filteredHistory, checkInData]
      });
    } else {
      // Create new document
      await setDoc(docRef, dataToSave);
    }
  } catch (error) {
    console.error('Error saving check-in:', error);
    throw error;
  }
};

// Get all days data (for day selector) with special handling for today - NOW USER-SPECIFIC
export const getAllDaysData = async (userId: string): Promise<Record<string, DayData>> => {
  const availableDays = getAvailableDays();
  const allData: Record<string, DayData> = {};
  const todayDay = getCurrentDay();
  
  for (const day of availableDays) {
    if (day === todayDay) {
      // For today, show yesterday's data in the stat cards
      allData[day] = await getTodayDisplayData(userId);
    } else {
      allData[day] = await getDayData(day, userId);
    }
  }
  
  return allData;
};

// Get chart data (for graph - previous 7 days including today) - NOW USER-SPECIFIC
export const getChartData = async (userId: string): Promise<Record<string, DayData>> => {
  const chartDays = getChartDays();
  const chartData: Record<string, DayData> = {};
  
  for (const day of chartDays) {
    chartData[day] = await getDayData(day, userId);
  }
  
  return chartData;
};

// Optional: Bulk get user's stats data using query (more efficient for large datasets)
export const getUserStatsData = async (userId: string): Promise<Record<string, DayData>> => {
  try {
    const q = query(
      collection(db, 'dailyStats'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const userData: Record<string, DayData> = {};
    
    querySnapshot.forEach((doc) => {
      const docId = doc.id;
      // Extract day name from document ID (format: userId_dayName)
      const dayName = docId.split('_')[1];
      if (dayName) {
        userData[dayName] = doc.data() as DayData;
      }
    });
    
    return userData;
  } catch (error) {
    console.error('Error getting user stats data:', error);
    return {};
  }
};