"use client";
import { useState, useEffect } from "react";

interface SliderComponentProps {
  onSleepChange: (value: number) => void;
  onWaterChange: (value: number) => void;
  onScreenTimeChange: (value: number) => void;
  initialValues?: {
    sleep: number;
    water: number;
    screenTime: number;
  };
}

const SliderComponent = ({
  onSleepChange,
  onWaterChange,
  onScreenTimeChange,
  initialValues = { sleep: 7, water: 2, screenTime: 4 }
}: SliderComponentProps) => {
  const [sleepHours, setSleepHours] = useState(initialValues.sleep);
  const [waterIntake, setWaterIntake] = useState(initialValues.water);
  const [screenTime, setScreenTime] = useState(initialValues.screenTime);

  // Update local state when initialValues change
  useEffect(() => {
    setSleepHours(initialValues.sleep);
    setWaterIntake(initialValues.water);
    setScreenTime(initialValues.screenTime);
  }, [initialValues]);

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
          className="w-full mt-2 accent-[#465775]"
        />
      </div>
    </div>
  );
};

export default SliderComponent;