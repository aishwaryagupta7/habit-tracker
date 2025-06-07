"use client";
import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import FormButton from "./FormButton";
import DateTimeSelector from "./DateTimeSelector";

interface GoalFormProps {
  selectedDay: AvailableDay;
  onGoalCreate: (goal: Omit<Goal, 'id'>) => void;
  onGoalUpdate: (goalId: string, updatedGoal: Omit<Goal, 'id'>) => void;
  editingGoal: Goal | null;
  onEditCancel: () => void;
}

const GoalsForm = ({ 
  selectedDay, 
  onGoalCreate, 
  onGoalUpdate, 
  editingGoal, 
  onEditCancel 
}: GoalFormProps) => {
  // Form states
  const [formData, setFormData] = useState({
    goalTitle: editingGoal?.title || '',
    goalDescription: editingGoal?.description || '',
    deadline: editingGoal?.deadline || '',
  });

  // Constants
  const currentDay = 'Wed';
  const isGoalFormDisabled = selectedDay !== currentDay;

  // Update form when editing goal changes
  useEffect(() => {
    if (editingGoal) {
      setFormData({
        goalTitle: editingGoal.title,
        goalDescription: editingGoal.description,
        deadline: editingGoal.deadline,
      });
    } else {
      setFormData({
        goalTitle: '',
        goalDescription: '',
        deadline: '',
      });
    }
  }, [editingGoal]);

  // Handler functions
  const handleCreateOrUpdateGoal = () => {
    if (!formData.goalTitle || !formData.deadline) return;

    const goalData = {
      title: formData.goalTitle,
      description: formData.goalDescription,
      deadline: formData.deadline,
      completed: false,
    };

    if (editingGoal) {
      onGoalUpdate(editingGoal.id, { ...goalData, completed: editingGoal.completed });
    } else {
      onGoalCreate(goalData);
    }

    // Reset the form
    setFormData({ goalTitle: "", goalDescription: "", deadline: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDeadlineChange = (value: string) => {
    setFormData({
      ...formData,
      deadline: value,
    });
  };

  const handleCancel = () => {
    setFormData({ goalTitle: "", goalDescription: "", deadline: "" });
    onEditCancel();
  };

  return (
    <div className="bg-[#FDF5FF]/40 backdrop-blur-lg rounded-xl p-4">
      <h3 className="font-semibold text-lg mb-2 text-black">Set Your Goals</h3>
      <FormInput  
        label="Title" 
        name="goalTitle" 
        placeholder="Enter your goal title" 
        value={formData.goalTitle} 
        onChange={handleInputChange} 
        disabled={isGoalFormDisabled}
      />
      <FormInput  
        label="Description" 
        name="goalDescription" 
        placeholder="Enter your goal description" 
        value={formData.goalDescription} 
        onChange={handleInputChange} 
        textarea={true} 
        disabled={isGoalFormDisabled} 
      />
      <div className='flex items-center justify-between'>
        <DateTimeSelector value={formData.deadline} onChange={handleDeadlineChange} />
        <div className="flex gap-2">
          {editingGoal && (
            <FormButton  
              label="Cancel" 
              onClick={handleCancel} 
              className="bg-gray-200 text-black mt-6 cursor-pointer" 
            />
          )}
          <FormButton  
            label={editingGoal ? "Update Goal" : "Create Goal"} 
            onClick={handleCreateOrUpdateGoal} 
            className={`bg-[#83A2DB] mt-6 cursor-pointer text-black ${isGoalFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={isGoalFormDisabled} 
          />
        </div>
      </div>
    </div>
  );
};

export default GoalsForm;