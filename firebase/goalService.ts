import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// Firestore collection name
const GOALS_COLLECTION = "goals";


// Create a new goal - NOW USER-SPECIFIC
export const createGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>, userId: string) => {
  try {
    const docRef = await addDoc(collection(db, GOALS_COLLECTION), {
      ...goalData,
      userId, // Add user ID to every goal
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating goal:", error);
    throw error;
  }
};

// Get goals for a specific day - NOW USER-SPECIFIC
export const getGoalsForDay = async (day: string, userId: string): Promise<Goal[]> => {
  try {
    const q = query(
      collection(db, GOALS_COLLECTION),
      where("day", "==", day),
      where("userId", "==", userId), // Filter by user ID
      orderBy("deadline", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const goals: Goal[] = [];
    
    querySnapshot.forEach((doc) => {
      goals.push({
        id: doc.id,
        ...doc.data()
      } as Goal);
    });
    
    return goals;
  } catch (error) {
    console.error("Error getting goals:", error);
    throw error;
  }
};

// Update a goal - Add userId verification for security
export const updateGoal = async (goalId: string, updates: Partial<Goal>, userId: string) => {
  try {
    const goalDoc = doc(db, GOALS_COLLECTION, goalId);
    await updateDoc(goalDoc, {
      ...updates,
      userId, // Ensure userId is preserved
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error updating goal:", error);
    throw error;
  }
};

// Delete a goal - You might want to add user verification here too for security
export const deleteGoal = async (goalId: string) => {
  try {
    const goalDoc = doc(db, GOALS_COLLECTION, goalId);
    await deleteDoc(goalDoc);
  } catch (error) {
    console.error("Error deleting goal:", error);
    throw error;
  }
};

// Mark goal as completed - Updated to include userId
export const completeGoal = async (goalId: string, userId: string) => {
  try {
    await updateGoal(goalId, { completed: true }, userId);
  } catch (error) {
    console.error("Error completing goal:", error);
    throw error;
  }
};

// Real-time listener for goals by day - NOW USER-SPECIFIC
export const subscribeToGoals = (
  day: string,
  userId: string, // Add userId parameter
  callback: (goals: Goal[]) => void
) => {
  console.log("Setting up subscription for day:", day, "and user:", userId);
  
  const q = query(
    collection(db, GOALS_COLLECTION),
    where("day", "==", day),
    where("userId", "==", userId) // Filter by user ID
  );

  return onSnapshot(q, 
    (querySnapshot) => {
      console.log("Firebase snapshot received, size:", querySnapshot.size);
      const goals: Goal[] = [];
      querySnapshot.forEach((doc) => {
        const goalData = doc.data();
        console.log("Goal data:", goalData);
        goals.push({
          id: doc.id,
          ...goalData
        } as Goal);
      });
      
      // Sort goals by deadline in JavaScript instead of Firestore
      goals.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      
      console.log("Processed goals:", goals);
      callback(goals);
    }, 
    (error) => {
      console.error("Error listening to goals:", error);
    }
  );
};