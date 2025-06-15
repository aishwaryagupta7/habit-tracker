"use client";
import { useState, useEffect } from "react";
import FormButton from "./FormButton";
import StatCard from "./StatCard";
import MetricChart from "./MetricChart";
import SliderComponent from "./SliderComponent";
import { saveCheckIn, formatDate, getYesterdayDay, getDayFromDate } from "../../firebase/StatsService";
import { useAuth } from "../../context/authContext"; // Import your auth context

interface StatsContainerProps {
  selectedDay: string;
  dayData: Record<string, DayData>;
  chartData: Record<string, DayData>; // New prop for chart data
  onDataUpdate: (day: string, newData: DayData) => void;
  onChartDataUpdate: (day: string, newData: DayData) => void; // New prop for chart data updates
}

const StatsContainer = ({ 
  selectedDay, 
  dayData,
  chartData,
  onDataUpdate,
  onChartDataUpdate
}: StatsContainerProps) => {
  const { user, loading: authLoading } = useAuth(); // Get current user
  
  // Check-in modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sleepHours, setSleepHours] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [screenTime, setScreenTime] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState<'sleep' | 'water' | 'screenTime'>('sleep');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentData = dayData[selectedDay] || { stats: { sleep: 0, water: 0, screenTime: 0 }, checkInHistory: [] };
  const currentStats = currentData.stats;
  const checkInHistory = currentData.checkInHistory;

  useEffect(() => {
    setSleepHours(currentStats.sleep);
    setWaterIntake(currentStats.water);
    setScreenTime(currentStats.screenTime);
  }, [selectedDay, currentStats]);

  const handleCheckInClick = () => {
    if (!user) {
      setError("You must be logged in to check in.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setIsModalOpen(true);
  };

  const handleCheckInSubmit = async () => {
    if (!user) {
      setError("You must be logged in to save check-in data.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get yesterday's date (the day we're checking in for)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDateStr = formatDate(yesterday);
      const yesterdayDay = getYesterdayDay();
      
      const newEntry: CheckInEntry = {
        date: yesterdayDateStr,
        sleep: sleepHours,
        water: waterIntake,
        screenTime: screenTime,
      };
      
      // Save to Firebase using yesterday's day name and user ID
      await saveCheckIn(yesterdayDay, newEntry, user.uid);
      
      // Update local state for yesterday's day (both in dayData and chartData)
      const yesterdayData = dayData[yesterdayDay] || { stats: { sleep: 0, water: 0, screenTime: 0 }, checkInHistory: [] };
      const filteredHistory = yesterdayData.checkInHistory.filter(e => e.date !== newEntry.date);
      const updatedData: DayData = {
        stats: {
          sleep: newEntry.sleep,
          water: newEntry.water,
          screenTime: newEntry.screenTime
        },
        checkInHistory: [...filteredHistory, newEntry]
      };
      
      // Update both day selector data and chart data
      onDataUpdate(yesterdayDay, updatedData);
      onChartDataUpdate(yesterdayDay, updatedData);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving check-in:', error);
      setError('Failed to save check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if it's today to show check-in button
  const isToday = selectedDay === getDayFromDate(new Date());

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="bg-[#FDF5FF]/40 backdrop-blur-lg rounded-xl px-5 py-4">
        <div className='flex items-center justify-center py-8'>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="bg-[#FDF5FF]/40 backdrop-blur-lg rounded-xl px-5 py-4">
        <h3 className="font-semibold text-lg text-black mb-4">Personal Stats</h3>
        <div className='flex items-center justify-center py-8'>
          <div className="text-gray-600">Please log in to view your personal stats.</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#FDF5FF]/40 backdrop-blur-lg rounded-xl px-5 py-4">
        <div className='flex items-center justify-between mb-2'>
          <h3 className="font-semibold text-lg text-black">Personal Stats</h3>
          {isToday && (
            <FormButton 
              label="Daily Check-In" 
              onClick={handleCheckInClick} 
              className="border-2 border-[#83A2DB] shadow-sm p-2 cursor-pointer text-black" 
            />
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2 text-sm">
            {error}
          </div>
        )}

        <div className='flex items-center gap-4 mb-2'>
          <StatCard stat={{type: "Sleep", value: currentStats.sleep, unit: "hours"}} />
          <StatCard stat={{type: "Water", value: currentStats.water, unit: "glasses"}} />
          <StatCard stat={{type: "Screen Time", value: currentStats.screenTime, unit: "hours"}} />
        </div>

        {/* Weekly Report */}
        <div>
          <div className='flex items-center justify-between mb-2'>
            <h3 className="font-semibold text-lg mb-2 text-black">Weekly Report</h3>
            <div className="mb-4">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as 'sleep' | 'water' | 'screenTime')}
                className="bg-[#F2F2F2] rounded-lg p-2 w-full text-black cursor-pointer"
              >
                <option value="sleep">Sleep</option>
                <option value="water">Water Intake</option>
                <option value="screenTime">Screen Time</option>
              </select>
            </div>
          </div>
          <div className='h-40 w-full'>
            <MetricChart
              metricKey={selectedMetric}
              label={`${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Intake`}
              unit={selectedMetric === 'sleep' ? 'hours' : selectedMetric === 'water' ? 'glasses' : 'hours'}
              gradientId={`${selectedMetric}Gradient`}
              startColor={selectedMetric === 'sleep'? '#B4CFFF': selectedMetric === 'water'? '#A8E6CF': '#FFBF69'}
              endColor={selectedMetric === 'sleep'? '#83A2DB': selectedMetric === 'water'? '#56C596': '#FF6F61'}
              selectedDay={selectedDay}
              dayData={dayData}
              chartData={chartData}
            />
          </div>
        </div>
      </div>

      {/* Check-In Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gradient-to-b from-[#D9DCDB] to-[#83A2DB] p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-black">Daily Check-In</h2>
            <p className="text-sm text-gray-700 mb-4">
              Enter your stats for yesterday ({getYesterdayDay()})
            </p>
            <SliderComponent
              onSleepChange={setSleepHours}
              onWaterChange={setWaterIntake}
              onScreenTimeChange={setScreenTime}
              initialValues={{
                sleep: sleepHours,
                water: waterIntake,
                screenTime: screenTime
              }}
            />
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            <div className="flex justify-end mt-6 gap-2">
              <FormButton
                label="Cancel"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-black"
                disabled={isSubmitting}
              />
              <FormButton
                label={isSubmitting ? "Saving..." : "Save Progress"}
                onClick={handleCheckInSubmit}
                className="bg-[#465775] hover:bg-[#6f91c8] text-white"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatsContainer;