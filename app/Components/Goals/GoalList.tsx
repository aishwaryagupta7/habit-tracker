import GoalItem from "./GoalItem";

const GoalList = ({ goals, onComplete, onEdit,onDelete }: GoalListProps) => {
    return (
      <div className="flex flex-col gap-4">
        {goals.length === 0 ? (""
        ) : (
          goals.map((goal) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              onComplete={onComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    );
};
export default GoalList;