import FormButton from "./FormButton";


const DaySelector = ({
    selectedDay,
    onSelect,
  }: {
    selectedDay: Weekday;
    onSelect: (day: Weekday) => void;
  }) => {
    const days: Weekday[] = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
    const selectableDays: AvailableDay[] = ["Mon", "Tues", "Wed"];
  
    // Helper to check if a day is selectable
    const isSelectable = (day: Weekday): boolean =>
      (selectableDays as string[]).includes(day);
  
    return (
      <div className="flex justify-center p-4">
        <div className="flex rounded-full bg-[#F2F2F2] p-1">
          {days.map((day) => (
            <FormButton
              key={day}
              label={day}
              onClick={() => {
                if (isSelectable(day)) onSelect(day);
              }}
              className={`px-6 py-2 text-sm font-medium transition-all duration-200 ${
                selectedDay === day
                  ? "bg-black text-white rounded-l-4xl rounded-r-4xl"
                  : "bg-transparent text-gray-600 hover:bg-gray-200 rounded-l-3xl rounded-r-3xl"
              } ${!isSelectable(day) ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          ))}
        </div>
      </div>
    );
};
export default DaySelector;