interface DateTimeSelectorProps  {
    value: string; // format: "YYYY-MM-DD HH:mm"
    onChange: (value: string) => void;
};

type Weekday = "Mon" | "Tues" | "Wed" | "Thurs" | "Fri" | "Sat" | "Sun";
type AvailableDay = 'Mon' | 'Tues' | 'Wed';


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

interface DayBoxProps  {
    day: number;
    completed: boolean;
    highlighted?: boolean;
};

type CheckInEntry = {
    date: string; // e.g. "2025-05-06"
    water: number;
    sleep: number;
    screenTime: number;
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