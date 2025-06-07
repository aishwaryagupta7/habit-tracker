import { Calendar, Clock } from "lucide-react";
import { useRef } from "react";


const DateTimeSelector = ({ value, onChange }: DateTimeSelectorProps) => {
    const [date, time] = value.split(" ");
    const dateInputRef = useRef<HTMLInputElement>(null);
    const timeInputRef = useRef<HTMLInputElement>(null);
  
    const handleDateChange = (newDate: string) => {
      onChange(`${newDate} ${time || "00:00"}`);
    };
  
    const handleTimeChange = (newTime: string) => {
      onChange(`${date || ""} ${newTime}`);
    };
  
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black">Deadline</label>
        <div className="flex gap-4">
          {/* Date Picker */}
          <div className="relative w-full">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black cursor-pointer"
              onClick={() => dateInputRef.current?.showPicker?.()}
            >
              <Calendar size={18} />
            </span>
            <input
              ref={dateInputRef}
              type="date"
              value={date || ""}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full pl-10 pr-2 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm text-[#a6a5a5] [&::-webkit-calendar-picker-indicator]:appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
            />
          </div>
  
          {/* Time Picker */}
          <div className="relative w-full">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black cursor-pointer"
              onClick={() => timeInputRef.current?.showPicker?.()}
            >
              <Clock size={18} />
            </span>
            <input
              ref={timeInputRef}
              type="time"
              value={time || "00:00"}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm text-[#a6a5a5] [&::-webkit-calendar-picker-indicator]:appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
            />
          </div>
        </div>
      </div>
    );
}
  export default DateTimeSelector;