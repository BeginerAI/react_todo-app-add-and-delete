/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useState } from 'react';

interface Prop {
  todo: Todo;
  allActive: boolean;
  handleDelete: (id: number) => void;
  isLoading: boolean;
  isTemp?: boolean;
}

export const TodoItem: React.FC<Prop> = ({
  todo,
  allActive,
  handleDelete,
  isLoading,
  isTemp = false,
}) => {
  const [isChecked, setIsChecked] = useState(todo.completed);
  const { title } = todo;

  useEffect(() => {
    if (allActive) {
      setIsChecked(true);
    } else {
      setIsChecked(todo.completed);
    }
  }, [allActive, todo.completed]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const a = +event.currentTarget.id;

    handleDelete(a);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', {
          completed: isChecked,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={isChecked}
            onChange={handleCheckboxChange}
            disabled={isTemp}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        {!isTemp && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            id={todo.id.toString()}
            onClick={handleClick}
            disabled={isLoading}
          >
            ×
          </button>
        )}

        {isLoading && (
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </>
  );
};
