import DayBox from "./DayBox";
import StreakBubble from "./StreakBubble";


const StreakComponent = () => {
    const currentStreak = 14;
    const bestStreak = 21;
  
    const recentDays = [
      { day: 1, completed: true },
      { day: 2, completed: true },
      { day: 3, completed: true },
      { day: 4, completed: true },
      { day: 5, completed: true },
      { day: 6, completed: true },
      { day: 7, completed: false, highlighted: true },
    ];
  
    return (
      <div className="w-full">
        <div className="flex justify-center gap-12 mb-3">
          <StreakBubble value={currentStreak} label="Current Streak" bgColor="bg-black" />
          <StreakBubble value={bestStreak} label="Best Streak" bgColor="bg-[#83A2DB]" />
        </div>
        <div className="flex justify-between mb-3 px-2">
          {recentDays.map((d, idx) => (
            <div key={idx} className="relative">
              <DayBox day={d.day} completed={d.completed} highlighted={d.highlighted} />
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-700 font-medium">
          Amazing commitment! You have built a life-changing habit.
        </p>
      </div>
    );
};
export default StreakComponent;