

const DayBox = ({ day, completed, highlighted }: DayBoxProps) =>{ 
    return (
        <div
        className={`w-15 h-15 flex flex-col items-center justify-center rounded-md text-sm font-medium text-black ${
            highlighted ? "bg-[#465775] text-white" : "bg-[#83A2DB]/50"
        }`}
        >
        <span>{day}</span>
        {completed && (
            <span className=" w-3 h-3 rounded-full bg-[#26b726] " />
        )}
        </div>
    );
}
export default DayBox;