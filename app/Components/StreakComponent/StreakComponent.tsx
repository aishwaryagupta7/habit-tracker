"use client";
import { useState, useEffect } from "react";
import DayBox from "./DayBox";
import StreakBubble from "./StreakBubble";
import { getAllDaysData, formatDate, getDayFromDate } from "../../../firebase/StatsService";
import { useAuth } from "../../../context/authContext";

interface DayDisplayData {
  day: number;
  completed: boolean;
  highlighted?: boolean;
}
const StreakComponent = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [recentDays, setRecentDays] = useState<DayDisplayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      loadStreakData();
    } else if (!authLoading && !user) {
      // Reset data if no user is logged in
      setCurrentStreak(0);
      setBestStreak(0);
      setRecentDays([]);
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadStreakData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get comprehensive data for streak calculation (last 30 days)
      const streakData = await getExtendedStreakData();
      
      const { current, best } = calculateStreaks(streakData);
      setCurrentStreak(current);
      setBestStreak(best);
    
      const recentDaysData = generateRecentDays(streakData);
      setRecentDays(recentDaysData);
      
    } catch (error) {
      console.error('Error loading streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExtendedStreakData = async (): Promise<Record<string, boolean>> => {
    if (!user) return {};
    
    const streakData: Record<string, boolean> = {};
    const today = new Date();
    
    // Get data for last 30 days to calculate accurate streaks
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = formatDate(date);
      const dayName = getDayFromDate(date);
      
      try {
        // Check if we have any check-in data for this day
        const dayData = await getDayDataForDate(dayName, dateStr);
        streakData[dateStr] = hasValidCheckIn(dayData);
      } catch (error) {
        streakData[dateStr] = false;
      }
    }
    
    return streakData;
  };

  const getDayDataForDate = async (dayName: string, targetDate: string): Promise<DayData | null> => {
    if (!user) return null;
    
    try {
      const allDaysData = await getAllDaysData(user.uid);
      const dayData = allDaysData[dayName];
      
      if (!dayData) return null;
      
      const hasCheckInForDate = dayData.checkInHistory.some(entry => entry.date === targetDate);
      
      if (hasCheckInForDate) {
        return dayData;
      }
      
      const hasCurrentStats = dayData.stats.sleep > 0 || dayData.stats.water > 0 || dayData.stats.screenTime > 0;
      if (hasCurrentStats) {
        return dayData;
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting data for ${dayName} on ${targetDate}:`, error);
      return null;
    }
  };

  const hasValidCheckIn = (dayData: DayData | null): boolean => {
    if (!dayData) return false;
    
    // Consider it a valid check-in if any of these conditions are met:
    // 1. Has check-in history entries
    // 2. Has meaningful stats (sleep > 0, water > 0, or screenTime recorded)
    const hasHistory = dayData.checkInHistory && dayData.checkInHistory.length > 0;
    const hasStats = dayData.stats.sleep > 0 || dayData.stats.water > 0 || dayData.stats.screenTime > 0;
    
    return hasHistory || hasStats;
  };

  const calculateStreaks = (streakData: Record<string, boolean>): { current: number, best: number } => {
    const sortedDates = Object.keys(streakData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    // Calculate current streak (from today backwards)
    let current = 0;
    const today = formatDate(new Date());
    
    for (const date of sortedDates) {
      if (streakData[date]) {
        current++;
      } else {
        // If it's today and no check-in yet, don't break the streak
        if (date === today) {
          continue;
        }
        break;
      }
    }
    
    // Calculate best streak (all time)
    let best = 0;
    let tempStreak = 0;
    
    // Reverse the dates to go chronologically
    const chronologicalDates = [...sortedDates].reverse();
    
    for (const date of chronologicalDates) {
      if (streakData[date]) {
        tempStreak++;
        best = Math.max(best, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    return { current: Math.max(current - 1, 0), best: Math.max(best - 1, current) };
  };

  const generateRecentDays = (streakData: Record<string, boolean>): DayDisplayData[] => {
    const recentDaysData: DayDisplayData[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = formatDate(date);
      const isToday = i === 0;
      
      recentDaysData.push({
        day: date.getDate(),
        completed: streakData[dateStr] || false,
        highlighted: isToday
      });
    }
    
    return recentDaysData;
  };

  const getStreakMessage = (): string => {
    if (currentStreak === 0) {
      return "Start your journey today! Every expert was once a beginner.";
    } else if (currentStreak < 3) {
      return "Great start! You're building momentum.";
    } else if (currentStreak < 7) {
      return "Fantastic progress! Keep the momentum going.";
    } else if (currentStreak < 14) {
      return "Excellent work! You're forming a strong habit.";
    } else if (currentStreak < 21) {
      return "Amazing commitment! You have built a life-changing habit.";
    } else if (currentStreak < 50) {
      return "Incredible dedication! You're truly consistent.";
    } else {
      return "Outstanding achievement! You're an inspiration to others.";
    }
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="bg-[#FDF5FF]/40 backdrop-blur-lg rounded-xl p-4">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // Show message if no user is logged in
  if (!user) {
    return (
      <div className="bg-[#FDF5FF]/40 backdrop-blur-lg rounded-xl p-4">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Please log in to view your streaks</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#FDF5FF]/40 backdrop-blur-lg rounded-xl p-4">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading streak data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF5FF]/40 backdrop-blur-lg rounded-xl p-4">
      <h3 className="font-semibold text-lg mb-2 text-black">Streak Tracker</h3>
      <div className="flex justify-center min-h-[17vh] max-h-[17vh] gap-12">
        <StreakBubble 
          value={currentStreak} 
          label="Current Streak" 
          bgColor="bg-black" 
        />
        <StreakBubble 
          value={bestStreak} 
          label="Best Streak" 
          bgColor="bg-[#83A2DB]" 
        />
      </div>
      
      <div className="flex justify-between mb-3 px-2">
        {recentDays.map((d, idx) => (
          <div key={idx} className="relative">
            <DayBox 
              day={d.day} 
              completed={d.completed} 
              highlighted={d.highlighted} 
            />
          </div>
        ))}
      </div>
      
      <p className="text-center text-sm text-gray-700 font-medium">
        {getStreakMessage()}
      </p>
    </div>
  );
};

export default StreakComponent;