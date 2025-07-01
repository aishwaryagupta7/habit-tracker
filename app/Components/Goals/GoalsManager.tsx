"use client";
import { useState, useEffect } from "react";
import GoalList from "./GoalList";
import GoalForm from "./GoalsForm";
import {
  createGoal,
  updateGoal,
  deleteGoal,
  subscribeToGoals,
} from "../../../firebase/goalService";
import { useAuth } from "../../../context/authContext"; // Import your auth context

const GoalsManager = ({ selectedDay }: GoalsManagerProps) => {
  const { user, loading: authLoading } = useAuth(); // Get current user
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't load goals if user is not authenticated
    if (authLoading) return; // Wait for auth to load
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setEditingGoal(null);

    // Subscribe to real-time updates with user ID
    const unsubscribe = subscribeToGoals(selectedDay, user.uid, (updatedGoals) => {
      setGoals(updatedGoals);
      setLoading(false);
    });

    // Cleanup subscription on unmount or day change
    return () => unsubscribe();
  }, [selectedDay, user, authLoading]);

  // Clear editing goal when switching to a different day
  useEffect(() => {
    setEditingGoal(null);
  }, [selectedDay]);

  // Handler functions - Updated to include user ID
  const handleGoalCreate = async (goalData: Omit<Goal, 'id'>) => {
    if (!user) {
      setError("You must be logged in to create goals.");
      return;
    }

    try {
      setError(null);
      await createGoal({
        ...goalData,
        day: selectedDay
      }, user.uid); // Pass user ID
      // Goals will be updated automatically via real-time listener
    } catch (error) {
      console.error("Failed to create goal:", error);
      setError("Failed to create goal. Please try again.");
    }
  };

  const handleGoalUpdate = async (goalId: string, updatedGoal: Omit<Goal, 'id'>) => {
    if (!user) {
      setError("You must be logged in to update goals.");
      return;
    }

    try {
      setError(null);
      await updateGoal(goalId, {
        ...updatedGoal,
        day: selectedDay
      }, user.uid); // Pass user ID
      setEditingGoal(null);
      // Goals will be updated automatically via real-time listener
    } catch (error) {
      console.error("Failed to update goal:", error);
      setError("Failed to update goal. Please try again.");
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    if (!user) {
      setError("You must be logged in to complete goals.");
      return;
    }

    try {
      setError(null);

      // Find the goal to complete
      const goalToComplete = goals.find(goal => goal.id === goalId);
      if (!goalToComplete) {
        throw new Error("Goal not found");
      }
      await updateGoal(goalId, {
        ...goalToComplete,
        completed: !goalToComplete.completed,
        day: goalToComplete.day
      }, user.uid); // Pass user ID
    } catch (error) {
      console.error("Failed to complete goal:", error);
      setError("Failed to complete goal. Please try again.");
    }
  };

  const handleEditGoal = (goal: Goal) => {
    if (!user) {
      setError("You must be logged in to edit goals.");
      return;
    }

    // Only allow editing goals for the current day
    const getCurrentDay = () => {
      const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
      const today = new Date();
      return days[today.getDay()];
    };

    if (selectedDay === getCurrentDay()) {
      setEditingGoal(goal);
    } else {
      setError("You can only edit goals for today.");
      setTimeout(() => setError(null), 2000);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!user) {
      setError("You must be logged in to delete goals.");
      return;
    }

    if (!confirm("Are you sure you want to delete this goal?")) {
      return;
    }
    try {
      setError(null);
      await deleteGoal(goalId);
    } catch (error) {
      console.error("Failed to delete goal:", error);
      setError("Failed to delete goal. Please try again.");
    }
  };

  const handleEditCancel = () => {
    setEditingGoal(null);
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return {
      GoalsList: () => (
        <div className="bg-[#FDF5FF]/40 backdrop-blur-lg rounded-xl p-4 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 text-black">Your Goals</h3>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-600">Loading...</div>
          </div>
        </div>
      ),
      GoalsForm: () => <div></div>
    };
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return {
      GoalsList: () => (
        <div className="bg-[#FDF5FF]/40 backdrop-blur-lg rounded-xl p-4 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 text-black">Your Goals</h3>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-600">Please log in to view your goals.</div>
          </div>
        </div>
      ),
      GoalsForm: () => <div></div>
    };
  }

  return {
    GoalsList: () => (
      <div className="bg-[#FDF5FF]/40 backdrop-blur-lg rounded-xl p-4 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 text-black">Your Goals</h3>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2 text-sm">
            {error}
          </div>
        )}

        <div className='flex-1 overflow-y-auto min-h-[22vh] max-h-[22vh] flex flex-col gap-3 custom-scrollbar pr-2'>
          {loading ? (
            <div className="flex items-center justify-center text-center">
              <div className="text-gray-600">Loading goals...</div>
            </div>
          ) : goals.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-center">
              <div className="text-gray-600">
                {selectedDay === (() => {
                  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
                  return days[new Date().getDay()];
                })()
                  ? "No goals for today. Create your first goal!"
                  : `No goals for ${selectedDay}. Switch to today to create goals.`
                }
              </div>
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

    GoalsForm: () => (
      <GoalForm
        selectedDay={selectedDay}
        onGoalCreate={handleGoalCreate}
        onGoalUpdate={handleGoalUpdate}
        editingGoal={editingGoal}
        onEditCancel={handleEditCancel}
        userId={user.uid}
      />
    )
  };
};

export default GoalsManager;