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
  
//   export interface Goal {
//     id?: string;
//     title: string;
//     description: string;
//     deadline: string;
//     completed: boolean;
//     day: string; // 'Mon', 'Tues', 'Wed', etc.
//     createdAt?: Timestamp;
//     updatedAt?: Timestamp;
//   }
  
  // Create a new goal
  export const createGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, GOALS_COLLECTION), {
        ...goalData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating goal:", error);
      throw error;
    }
  };
  
  // Get goals for a specific day
  export const getGoalsForDay = async (day: string): Promise<Goal[]> => {
    try {
      const q = query(
        collection(db, GOALS_COLLECTION),
        where("day", "==", day),
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
  
  // Update a goal
  export const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      const goalDoc = doc(db, GOALS_COLLECTION, goalId);
      await updateDoc(goalDoc, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Error updating goal:", error);
      throw error;
    }
  };
  
  // Delete a goal
  export const deleteGoal = async (goalId: string) => {
    try {
      const goalDoc = doc(db, GOALS_COLLECTION, goalId);
      await deleteDoc(goalDoc);
    } catch (error) {
      console.error("Error deleting goal:", error);
      throw error;
    }
  };
  
  // Mark goal as completed
  export const completeGoal = async (goalId: string) => {
    try {
      await updateGoal(goalId, { completed: true });
    } catch (error) {
      console.error("Error completing goal:", error);
      throw error;
    }
  };
  
  // Real-time listener for goals by day
  export const subscribeToGoals = (
    day: string,
    callback: (goals: Goal[]) => void
  ) => {
    console.log("Setting up subscription for day:", day); // Debug log
    
    // Simplified query without orderBy to avoid index issues initially
    const q = query(
      collection(db, GOALS_COLLECTION),
      where("day", "==", day)
    );
  
    return onSnapshot(q, 
      (querySnapshot) => {
        console.log("Firebase snapshot received, size:", querySnapshot.size); // Debug log
        const goals: Goal[] = [];
        querySnapshot.forEach((doc) => {
          const goalData = doc.data();
          console.log("Goal data:", goalData); // Debug log
          goals.push({
            id: doc.id,
            ...goalData
          } as Goal);
        });
        
        // Sort goals by deadline in JavaScript instead of Firestore
        goals.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        
        console.log("Processed goals:", goals); // Debug log
        callback(goals);
      }, 
      (error) => {
        console.error("Error listening to goals:", error);
      }
    );
  };