

const DayBox = ({ day, completed, highlighted }: DayBoxProps) =>{ 
    return (
        <div
        className={`w-12 h-10 flex flex-col items-center justify-center rounded-md text-sm font-medium text-black ${
            highlighted ? "bg-[#465775] text-white" : "bg-[#83A2DB]/50"
        }`}
        >
        <span>{day}</span>
        {completed && (
            <span className=" w-2 h-2 rounded-full bg-[#00ff00] " />
        )}
        </div>
    );
}
export default DayBox;