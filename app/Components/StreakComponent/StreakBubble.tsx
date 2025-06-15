

const StreakBubble = ({ value, label, bgColor }: StreakBubbleProps) =>{ 
    return (
        <div className="flex flex-col items-center gap-1">
        <div className={`w-18 h-18 rounded-full flex items-center justify-center text-white text-3xl font-semibold ${bgColor}`}>
            {value}
        </div>
        <span className="text-sm text-black font-medium">{label}</span>
        </div>
    );
}
export default StreakBubble;