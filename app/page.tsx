"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import DaySelector from "./Components/DaySelector";
import StatsContainer from "./Components/StatsContainer";
import GoalsManager from "./Components/Goals/GoalsManager";
import StreakComponent from "./Components/StreakComponent/StreakComponent";
import { getAllDaysData, getChartData, getCurrentDay } from "../firebase/StatsService";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<string>(getCurrentDay());
  const [dayData, setDayData] = useState<Record<string, DayData>>({});
  const [chartData, setChartData] = useState<Record<string, DayData>>({});
  const [loading, setLoading] = useState(true);
  const [streakKey, setStreakKey] = useState(0); 

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setDayData({});
        setChartData({});
        setLoading(false);
        return;
      }      
      try {
        const [daySelectorData, chartGraphData] = await Promise.all([
          getAllDaysData(user.uid), 
          getChartData(user.uid)      
        ]);
        
        setDayData(daySelectorData);
        setChartData(chartGraphData);
        setSelectedDay(getCurrentDay());
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const goalsManager = GoalsManager({ selectedDay });

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
  };

  const handleDataUpdate = (day: string, newData: DayData) => {
    setDayData(prev => ({
      ...prev,
      [day]: newData
    }));
    setStreakKey(prev => prev + 1);
  };

  const handleChartDataUpdate = (day: string, newData: DayData) => {
    setChartData(prev => ({
      ...prev,
      [day]: newData
    }));
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-[#D9DCDB] to-[#83A2DB] items-center justify-center">
        <div className="text-black text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#D9DCDB] to-[#83A2DB]">
      
      <Header />
      {/* Header */}
      <div className="flex flex-col h-full sm:flex-row sm:items-center sm:justify-between px-5 py-3 text-lg gap-2">
        
        <div>
          <p className='text-black'>Hi {user.displayName || 'User'},</p>
          <p className="text-base text-gray-600">Keep track of your daily goals!</p>
        </div>
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <DaySelector 
            onDayChange={handleDayChange} 
            selectedDay={selectedDay}
          />
        </div>
      </div>

      <div className="px-3 md:px-6 lg:px-5">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
          <div className="col-span-3 flex flex-col gap-2">
            <StatsContainer
              selectedDay={selectedDay}
              dayData={dayData}
              chartData={chartData}
              onDataUpdate={handleDataUpdate}
              onChartDataUpdate={handleChartDataUpdate}
            />
            <goalsManager.GoalsList />
          </div>

          <div className="col-span-2 flex flex-col gap-2">
            <goalsManager.GoalsForm />
            <StreakComponent key={streakKey} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}