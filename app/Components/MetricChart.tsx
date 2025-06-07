import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


  
const dummyDataByDay: Record<AvailableDay, {
    stats: {
      sleep: number,
      water: number,
      screenTime: number
    },
    checkInHistory: CheckInEntry[],
    goals: Goal[]
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
      ],
      goals: [
        { id: '1', title: 'Drink 2L Water', description: 'Stay hydrated', deadline: '2025-05-30', completed: false },
        { id: '2', title: 'Sleep 8 Hours', description: 'Improve sleep quality', deadline: '2025-05-20', completed: true },
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
      ],
      goals: [
        { id: '1', title: 'Drink 2.5L Water', description: 'Increase hydration', deadline: '2025-05-25', completed: true },
        { id: '2', title: 'Learn React', description: 'Complete online course', deadline: '2025-06-01', completed: false }
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
      ],
      goals: [
        { id: '1', title: 'Meditate Daily', description: '15 minutes each morning', deadline: '2025-05-20', completed: false },
        { id: '2', title: 'Complete Project', description: 'Finish React dashboard', deadline: '2025-05-10', completed: false }
      ]
    }
};

const MetricChart = ({
    metricKey,
    label,
    unit,
    gradientId,
    startColor,
    endColor,
    selectedDay
  }: {
    metricKey: 'sleep' | 'water' | 'screenTime';
    label: string;
    unit: string;
    gradientId: string;
    startColor: string;
    endColor: string;
    selectedDay: AvailableDay; 
  }) => {
    const getDayOfWeek = (date: string) => {
      const day = new Date(date);
      const options: Intl.DateTimeFormatOptions = { weekday: 'short' }; // Explicitly typed options
      return day.toLocaleDateString('en-US', options); // "Mon", "Tues", etc.
    };
    const filteredData = dummyDataByDay[selectedDay].checkInHistory.map((entry) => ({
      date: getDayOfWeek(entry.date), // Format the date as a day of the week
      value: entry[metricKey], // Value based on the selected metric (sleep, water, screenTime)
    }));
  
    // const history = dummyDataByDay[selectedDay].checkInHistory;
    // const selectedDate = new Date(); // We can use current date since we're using dummy data
    
    return (
      <div className="w-full h-full ">
        <ResponsiveContainer width="100%" height='100%'>
    
            <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 30, bottom: 5 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={startColor} stopOpacity={1} />
                  <stop offset="100%" stopColor={endColor} stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: unit, angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="value" fill={`url(#${gradientId})`} radius={[5, 5, 0, 0]} />
            </BarChart>
            {/* {data.every(d => d.value === 0) && (
              <div className="text-sm text-center text-gray-500 mt-2">
                No data yet. Complete a check-in to see your progress!
              </div>
            )} */}
          
        </ResponsiveContainer>
        
      </div>
    ); 
};

export default MetricChart;