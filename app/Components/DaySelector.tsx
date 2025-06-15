"use client";
import { useEffect } from "react";
import FormButton from "./FormButton";
import { getAvailableDays, isDaySelectable, getCurrentDay } from "../../firebase/StatsService";

interface DaySelectorProps {
  onDayChange: (day: string) => void;
  selectedDay: string;
}

const DaySelector = ({ onDayChange, selectedDay }: DaySelectorProps) => {
  const availableDays = getAvailableDays();
  const currentDay = getCurrentDay();

  useEffect(() => {
    if (!selectedDay) {
      onDayChange(currentDay);
    }
  }, [selectedDay, currentDay, onDayChange]);

  const handleDaySelect = (day: string) => {
    if (isDaySelectable(day)) {
      onDayChange(day);
    }
  };

  return (
    <div className="flex justify-center p-4">
      <div className="flex rounded-full bg-[#F2F2F2] p-1">
        {availableDays.map((day) => {
          const isSelectable = isDaySelectable(day);
          const isToday = day === currentDay;
          
          return (
            <FormButton
              key={day}
              label={isToday ? `${day} (Today)` : day}
              onClick={() => handleDaySelect(day)}
              className={`px-3 sm:px-6 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                selectedDay === day
                  ? "bg-black text-white rounded-l-4xl rounded-r-4xl"
                  : "bg-transparent text-gray-600 hover:bg-gray-200 rounded-l-3xl rounded-r-3xl"
              } ${!isSelectable ? "opacity-50 cursor-not-allowed" : ""} ${
                isToday ? "font-bold" : ""
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DaySelector;