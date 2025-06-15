interface DateTimeSelectorProps  {
    value: string; // format: "YYYY-MM-DD HH:mm"
    onChange: (value: string) => void;
    disabled?: boolean;
};


interface FormInputProps  {
    label: string;
    name: string;
    placeholder?: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    className?: string;
    textarea?: boolean;
    disabled?: boolean;
};

interface Goal {
    id: string;
    title: string;
    userId: string;
    description: string;
    deadline: string;
    completed: boolean;
    day?: string;
}

interface GoalItemProps {
    goal: Goal;
    onComplete: (id: string) => void;
    onEdit: (goal: Goal) => void;
    onDelete: (id: string) => void;
}

interface GoalListProps {
    goals: Goal[];
    onComplete: (id: string) => void;
    onEdit: (goal: Goal) => void;
    onDelete: (id: string) => void;
}

interface GoalsManagerProps {
    selectedDay: string;
}

interface GoalFormProps {
      selectedDay: string;
      onGoalCreate: (goal: Omit<Goal, 'id'>) => void;
      onGoalUpdate: (goalId: string, updatedGoal: Omit<Goal, 'id'>) => void;
      editingGoal: Goal | null;
      onEditCancel: () => void;
}

interface DayBoxProps  {
    day: number;
    completed: boolean;
    highlighted?: boolean;
};


interface StatProps {
    type: string;
    value: number | string;
    unit?: string;
};

interface StreakBubbleProps {
    value: number;
    label: string;
    bgColor: string;
};

interface CheckInEntry {
  date: string;
  sleep: number;
  water: number;
  screenTime: number;
}
 interface DayStats {
  sleep: number;
  water: number;
  screenTime: number;
}

interface DayData {
  stats: DayStats;
  checkInHistory: CheckInEntry[];
  userId?: string;
}


