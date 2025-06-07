import { CircleHelp, Droplet, Monitor, Moon } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
    Sleep: <Moon className="w-10 h-10 fill-current text-white" />,
    Water: <Droplet className="w-10 h-10 fill-current text-white" />,
    'Screen Time': <Monitor className="w-10 h-10 fill-current text-white" />,
};

const StatCard = ({stat}:{stat:StatProps}) => {
    const icon = iconMap[stat.type] ?? <CircleHelp className="text-gray-400" />;
    return (
      <div className="flex items-center py-2 px-3 bg-transparent rounded-xl border-2 border-[#c3c2c2] w-full md:w-1/3 lg:w-1/3 ">
        <div className=" bg-[#6193ED] p-2 rounded-sm ">{icon}</div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-[#7D7D7D] whitespace-nowrap">{stat.type}</h3>
          <p className="text-sm text-black">
            {stat.value} {stat.unit}
          </p>
        </div>
      </div>
    )
}
export default StatCard;