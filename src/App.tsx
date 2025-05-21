/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { AddTodo, Todo } from './types/Todo';
import { ErrorNotification } from './Components/ErrorNotification';
import { Header } from './Components/Header';
import { Main } from './Components/Main';
import { Footer } from './Components/Footer';
import useError from './hooks/UseError';

export enum FiltredValue {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { errorMessage, setErrorMessage } = useError();
  const [filter, setfilter] = useState<FiltredValue>(FiltredValue.All);
  const [allActive, setAllActive] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [deletingTodoId, setDeletingTodoId] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
        setErrorMessage('');
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    setDisableBtn(!todos.some(item => item.completed));
  }, [todos]);

  const handleAdd = (newTodo: AddTodo) => {
    const temp = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(temp);
    setIsLoading(true);
    setErrorMessage('');
    addTodos(newTodo)
      .then((createTodo: Todo) => {
        // reloadTodos();
        setTodos(prevTodos => [...prevTodos, createTodo]);
        setTempTodo(null);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage('Failed to add todo');
        setTempTodo(null);
      })
      .finally(() => setIsLoading(false));
  };

  const handleDelete = (id: number) => {
    setIsLoading(true);
    setDeletingTodoId(prev => [...prev, id]);

    deleteTodos(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        setDeletingTodoId(prev => prev.filter(todoId => todoId !== id));
      })
      .catch(() => {
        setErrorMessage('Failed to delete todo');
      })
      .finally(() => setIsLoading(false));
  };

  const filtredItems = useMemo(() => {
    const filtered = todos.filter(todo => {
      switch (filter) {
        case FiltredValue.Active:
          return !todo.completed;
        case FiltredValue.Completed:
          return todo.completed;
        default:
          return true;
      }
    });

    return tempTodo ? [...filtered, tempTodo] : filtered;
  }, [todos, filter, tempTodo]);

  const handleAllActive = () => {
    setAllActive(prev => !prev);
  };

  const sum = todos.filter(todo => !todo.completed);

  const handleComletedDelete = async () => {
    const completed = filtredItems.filter(todo => todo.completed);

    if (completed.length === 0) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    await Promise.all(completed.map(todo => handleDelete(todo.id)));

    setIsLoading(false);
  };

  return USER_ID !== 2564 ? (
    <UserWarning />
  ) : (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handle={handleAllActive}
          handleAdd={handleAdd}
          setErrorMessage={setErrorMessage}
          isLoading={isLoading}
          InputValue={inputValue}
          setInputValue={setInputValue}
        />
        <Main
          filtredItems={filtredItems}
          allActive={allActive}
          handleDelete={handleDelete}
          isLoading={isLoading}
          tempTodo={tempTodo}
          deletingTodoId={deletingTodoId}
        />

        {todos.length !== 0 && (
          <Footer
            disableBtn={disableBtn}
            sum={sum}
            setfilter={setfilter}
            filter={filter}
            handleComletedDelete={handleComletedDelete}
          />
        )}
      </div>

      <ErrorNotification message={errorMessage} />
    </div>
  );
};
