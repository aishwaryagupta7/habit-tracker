"use client";
import { useState, useEffect } from "react";
import GoalList from "./GoalList";
import GoalForm from "./GoalsForm";
import {
  createGoal,
  updateGoal,
  deleteGoal,
  completeGoal,
  subscribeToGoals,

} from "../../firebase/goalService";

// type AvailableDay = 'Mon' | 'Tues' | 'Wed' | 'Thurs' | 'Fri' | 'Sat' | 'Sun';

interface GoalsManagerProps {
  selectedDay: AvailableDay;
}

const GoalsManager = ({ selectedDay }: GoalsManagerProps) => {
  // Goals states
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time goals updates when day changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    setEditingGoal(null);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToGoals(selectedDay, (updatedGoals) => {
      setGoals(updatedGoals);
      setLoading(false);
    });

    // Cleanup subscription on unmount or day change
    return () => unsubscribe();
  }, [selectedDay]);

  // Handler functions
  const handleGoalCreate = async (goalData: Omit<Goal, 'id'>) => {
    try {
      setError(null);
      await createGoal({
        ...goalData,
        day: selectedDay
      });
      // Goals will be updated automatically via real-time listener
    } catch (error) {
      console.error("Failed to create goal:", error);
      setError("Failed to create goal. Please try again.");
    }
  };

  const handleGoalUpdate = async (goalId: string, updatedGoal: Omit<Goal, 'id'>) => {
    try {
      setError(null);
      await updateGoal(goalId, {
        ...updatedGoal,
        day: selectedDay
      });
      setEditingGoal(null);
      // Goals will be updated automatically via real-time listener
    } catch (error) {
      console.error("Failed to update goal:", error);
      setError("Failed to update goal. Please try again.");
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      setError(null);
      await completeGoal(goalId);
      // Goals will be updated automatically via real-time listener
    } catch (error) {
      console.error("Failed to complete goal:", error);
      setError("Failed to complete goal. Please try again.");
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      setError(null);
      await deleteGoal(goalId);
      // Goals will be updated automatically via real-time listener
    } catch (error) {
      console.error("Failed to delete goal:", error);
      setError("Failed to delete goal. Please try again.");
    }
  };

  const handleEditCancel = () => {
    setEditingGoal(null);
  };

  return {
    // Goals List Component
    GoalsList: () => (
      <div className="bg-[#FDF5FF]/50 backdrop-blur-lg rounded-xl p-4 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 text-black">Your Goals</h3>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2 text-sm">
            {error}
          </div>
        )}
        
        <div className='flex-1 overflow-y-auto min-h-[16vh] max-h-[16vh] flex flex-col gap-3 custom-scrollbar pr-2'>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-600">Loading goals...</div>
            </div>
          ) : goals.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-600">No goals for {selectedDay}. Create your first goal!</div>
            </div>
          ) : (
            <GoalList 
              goals={goals} 
              onComplete={handleCompleteGoal}  
              onEdit={handleEditGoal} 
              onDelete={handleDeleteGoal} 
            />
          )}
        </div>
      </div>
    ),
    
    // Goals Form Component
    GoalsForm: () => (
      <GoalForm
        selectedDay={selectedDay}
        onGoalCreate={handleGoalCreate}
        onGoalUpdate={handleGoalUpdate}
        editingGoal={editingGoal}
        onEditCancel={handleEditCancel}
      />
    )
  };
};

export default GoalsManager;