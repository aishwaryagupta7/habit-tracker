"use client";
import { useEffect, useState } from "react";
import DaySelector from "./Components/DaySelector";
import FormButton from "./Components/FormButton";
import StatCard from "./Components/StatCard";
import MetricChart from "./Components/MetricChart";
import GoalsManager from "./Components/GoalsManager";
import StreakComponent from "./Components/StreakComponent/StreakComponent";
import SliderComponent from "./Components/SliderComponent";

const dummyDataByDay: Record<AvailableDay, {
    stats: {
      sleep: number,
      water: number,
      screenTime: number
    },
    checkInHistory: CheckInEntry[]
  }> = {
    'Mon': {
      stats: {
        sleep: 6,
        water: 7,
        screenTime: 6
      },
      checkInHistory: [
        { date: '2025-04-28', sleep: 5, water: 6, screenTime: 5 },
        { date: '2025-04-29', sleep: 6, water: 5, screenTime: 4 },
        { date: '2025-04-30', sleep: 7, water: 8, screenTime: 3 },
        { date: '2025-05-01', sleep: 6, water: 7, screenTime: 2 },
        { date: '2025-05-02', sleep: 5, water: 6, screenTime: 5 },
        { date: '2025-05-03', sleep: 4, water: 5, screenTime: 7 },
        { date: '2025-05-04', sleep: 2, water: 3, screenTime: 8 },
      ]
    },
    'Tues': {
      stats: {
        sleep: 7,
        water: 8,
        screenTime: 5
      },
      checkInHistory: [
        { date: '2025-04-29', sleep: 6, water: 7, screenTime: 3 },
        { date: '2025-04-30', sleep: 7, water: 6, screenTime: 2 },
        { date: '2025-05-01', sleep: 8, water: 7, screenTime: 4 },
        { date: '2025-05-02', sleep: 7, water: 8, screenTime: 3 },
        { date: '2025-05-03', sleep: 6, water: 7, screenTime: 2 },
        { date: '2025-05-04', sleep: 5, water: 6, screenTime: 1 },
        { date: '2025-05-05', sleep: 6, water: 8, screenTime: 6 },
      ]
    },
    'Wed': {
      stats: {
        sleep: 8,
        water: 6,
        screenTime: 4
      },
      checkInHistory: [
        { date: '2025-04-30', sleep: 7, water: 5, screenTime: 3 },
        { date: '2025-05-01', sleep: 8, water: 6, screenTime: 4 },
        { date: '2025-05-02', sleep: 7, water: 7, screenTime: 3 },
        { date: '2025-05-03', sleep: 8, water: 6, screenTime: 2 },
        { date: '2025-05-04', sleep: 7, water: 5, screenTime: 3 },
        { date: '2025-05-05', sleep: 8, water: 6, screenTime: 4 },
        { date: '2025-05-06', sleep: 7, water: 6, screenTime: 5 },
      ]
    }
};

export default function Home() {
  // Core app states
  const [selectedDay, setSelectedDay] = useState<AvailableDay>('Wed');
  const [selectedMetric, setSelectedMetric] = useState<'sleep' | 'water' | 'screenTime'>('sleep');
  
  // Check-in modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sleepHours, setSleepHours] = useState(dummyDataByDay['Wed'].stats.sleep);
  const [waterIntake, setWaterIntake] = useState(dummyDataByDay['Wed'].stats.water);
  const [screenTime, setScreenTime] = useState(dummyDataByDay['Wed'].stats.screenTime);
  const [checkInHistory, setCheckInHistory] = useState<CheckInEntry[]>(dummyDataByDay['Wed'].checkInHistory);

  // Initialize Goals Manager
  const goalsManager = GoalsManager({ selectedDay });

  // Computed values
  const latestSleep = dummyDataByDay[selectedDay]?.stats.sleep ?? 0;
  const latestWater = dummyDataByDay[selectedDay]?.stats.water ?? 0;
  const latestScreenTime = dummyDataByDay[selectedDay]?.stats.screenTime ?? 0;

  useEffect(() => {
    console.log("Updated checkIns", checkInHistory);
  }, [checkInHistory]);

  // Handler functions
  const handleDaySelect = (day: Weekday) => {
    if (day === 'Mon' || day === 'Tues' || day === 'Wed') {
        setSelectedDay(day);
        setCheckInHistory(dummyDataByDay[day].checkInHistory);
        setSleepHours(dummyDataByDay[day].stats.sleep);
        setWaterIntake(dummyDataByDay[day].stats.water);
        setScreenTime(dummyDataByDay[day].stats.screenTime);
    }
  };
  
  const handleCheckInClick = () => {
    setIsModalOpen(true);
  };

  const handleCheckInSubmit = () => {
    const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const newEntry: CheckInEntry = {
      date: todayDate,
      sleep: sleepHours,
      water: waterIntake,
      screenTime: screenTime,
    };
    
    // Replace existing entry for today or append
    setCheckInHistory(prev => {
      const filtered = prev.filter(e => e.date !== todayDate);
      return [...filtered, newEntry];
    });

    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#D9DCDB] to-[#83A2DB]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-3 text-lg gap-2">
        <div>
          <p className='text-black'>Hi Aishwarya,</p>
          <p className="text-base text-gray-600">Keep track of your daily goals!</p>
        </div>
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <DaySelector selectedDay={selectedDay} onSelect={handleDaySelect} />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 md:px-6 lg:px-5">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
          {/* Left Column - Stats & Goals List */}
          <div className="col-span-3 flex flex-col gap-2">
            {/* Personal Stats */}
            <div className="bg-[#FDF5FF]/50 backdrop-blur-lg rounded-xl px-5 py-4">
              <div className='flex items-center justify-between mb-2'>
                <h3 className="font-semibold text-lg text-black">Personal Stats</h3>
                <FormButton 
                  label="Daily Check-In" 
                  onClick={handleCheckInClick} 
                  className="border-2 border-[#83A2DB] shadow-sm p-2 cursor-pointer text-black" 
                />
              </div>

              <div className='flex items-center gap-4 mb-2'>
                <StatCard stat={{type: "Sleep", value: latestSleep, unit: "hours"}} />
                <StatCard stat={{type: "Water", value: latestWater, unit: "glasses"}} />
                <StatCard stat={{type: "Screen Time", value: latestScreenTime, unit: "hours"}} />
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
                  />
                </div>
              </div>
            </div>

            {/* Goals List Section */}
            <goalsManager.GoalsList />
          </div>

          {/* Right Column - Goal Form & Streak */}
          <div className="col-span-2 flex flex-col gap-2">
            {/* Goal Form */}
            <goalsManager.GoalsForm />
            
            {/* Streak Tracker */}
            <div className="bg-[#FDF5FF]/40 backdrop-blur-lg rounded-xl p-4">
              <h3 className="font-semibold text-lg mb-2 text-black">Streak Tracker</h3>
              <StreakComponent />
            </div>
          </div>
        </div>
      </div>

      {/* Check-In Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gradient-to-b from-[#D9DCDB] to-[#83A2DB] p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-black">Daily Check-In</h2>
            <SliderComponent
              onSleepChange={setSleepHours}
              onWaterChange={setWaterIntake}
              onScreenTimeChange={setScreenTime}
            />
            <div className="flex justify-end mt-6 gap-2">
              <FormButton
                label="Cancel"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-black"
              />
              <FormButton
                label="Save Progress"
                onClick={handleCheckInSubmit}
                className="bg-[#465775] hover:bg-[#6f91c8] text-black"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}