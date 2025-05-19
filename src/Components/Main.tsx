import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  SortItems: Todo[];
  allActive: boolean;
  handleDelete: (id: number) => void;
  isLoading: boolean;
  tempTodo: Todo | null;
}

export const Main: React.FC<Props> = ({
  SortItems,
  allActive,
  handleDelete,
  isLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {SortItems.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          allActive={allActive}
          handleDelete={handleDelete}
          isLoading={isLoading && todo.id === 0}
          isTemp={todo.id === 0}
        />
      ))}
    </section>
  );
};
