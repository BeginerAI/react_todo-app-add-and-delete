import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  filtredItems: Todo[];
  allActive: boolean;
  handleDelete: (id: number) => void;
  isLoading: boolean;
  tempTodo: Todo | null;
  deletingTodoId: number[];
}

export const Main: React.FC<Props> = ({
  filtredItems,
  allActive,
  handleDelete,
  deletingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filtredItems.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          allActive={allActive}
          handleDelete={handleDelete}
          isLoading={todo.id === 0}
          isDelete={deletingTodoId.includes(todo.id)}
        />
      ))}
    </section>
  );
};
