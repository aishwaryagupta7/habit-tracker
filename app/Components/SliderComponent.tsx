import { useState } from "react";


const SliderComponent = ({
    onSleepChange,
    onWaterChange,
    onScreenTimeChange,
  }: {
    onSleepChange: (value: number) => void;
    onWaterChange: (value: number) => void;
    onScreenTimeChange: (value: number) => void;
  }) => {
    const [sleepHours, setSleepHours] = useState(7);
    const [waterIntake, setWaterIntake] = useState(2);
    const [screenTime, setScreenTime] = useState(4);

    const handleSleepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setSleepHours(value);
      onSleepChange(value);
    };

    const handleWaterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setWaterIntake(value);
      onWaterChange(value);
    };

    const handleScreenTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setScreenTime(value);
      onScreenTimeChange(value);
    };

    return (
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sleep Hours: {sleepHours} hours
          </label>
          <input
            type="range"
            min="0"
            max="24"
            step="0.5"
            value={sleepHours}
            onChange={handleSleepChange}
            className="w-full mt-2 accent-[#465775]"
          />
        </div>

        {/* Water Intake Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Water Intake: {waterIntake} glasses
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={waterIntake}
            onChange={handleWaterChange}
            className="w-full mt-2 accent-[#465775]"
          />
        </div>

        {/* Screen Time Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Screen Time: {screenTime} hours
          </label>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={screenTime}
            onChange={handleScreenTimeChange}
            className="w-full mt-2 accent-[#465775] "
          />
        </div>
      </div>
    );
};
export default SliderComponent;