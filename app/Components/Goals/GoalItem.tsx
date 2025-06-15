import FormButton from "../FormButton";

const GoalItem = ({ goal, onComplete, onEdit, onDelete }: GoalItemProps) => {
    return (
      <div className="bg-[#83A2DB] text-white px-4 py-3 rounded-lg flex justify-between items-center shadow-sm">
        <div className="flex flex-col">
          <h3
            className={`text-md font-medium ${
              goal.completed ? "line-through opacity-60" : ""
            }`}
          >
            {goal.title} 
          </h3>
          <p className="text-xs opacity-80">
            Deadline: {goal.deadline}
          </p>
        </div>
        <div className="flex gap-3">
          {!goal.completed ? (
              <>
                <FormButton
                  label="Mark as completed ✓"
                  onClick={() => onComplete(goal.id)}
                  className="bg-[#71E871] text-white shadow-md "
                />
                <FormButton
                  label="Edit ✎"
                  onClick={() => onEdit(goal)}
                  className="bg-[#465775]/80 text-white shadow-md "
                />
              </>
            ) : (
              <FormButton
                label="Delete 🗑 "
                onClick={() => onDelete(goal.id)}
                className="bg-[#FF0000]/60 text-white shadow-md"
              />
            )}
        </div>
      </div>
    );
};

export default GoalItem;