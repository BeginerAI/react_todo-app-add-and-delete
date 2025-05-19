/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { AddTodos, DeleteTodos, getTodos, USER_ID } from './api/todos';
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
  const [shouldReload, setShouldReload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [InputValue, setInputValue] = useState('');

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
        setErrorMessage('');
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, [shouldReload]);

  useEffect(() => {
    setDisableBtn(!todos.some(item => item.completed));
  }, [todos]);

  const reloadTodos = () => {
    setShouldReload(prev => !prev);
  };

  const handleAdd = (newTodo: AddTodo) => {
    const temp = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(temp);
    setIsLoading(true);
    setErrorMessage('');
    AddTodos(newTodo)
      .then(() => {
        reloadTodos();
        setTempTodo(null);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage('Failed to add todo');
        setTempTodo(null);
      })
      .finally(() => setIsLoading(false));
  };

  const handleDelete = async (id: number) => {
    DeleteTodos(id)
      .then(() => reloadTodos())
      .catch(() => {
        setErrorMessage('Failed to delete todo');
      });
  };

  const SortItems = [
    ...todos.filter(todo => {
      switch (filter) {
        case FiltredValue.Active:
          return !todo.completed;
        case FiltredValue.Completed:
          return todo.completed;
        default:
          return true;
      }
    }),
    ...(tempTodo ? [tempTodo] : []),
  ];

  const handleAllActive = () => {
    setAllActive(prev => !prev);
  };

  const sum = todos.filter(todo => !todo.completed);

  const handleComletedDelete = async () => {
    const completed = [...SortItems.filter(todo => todo.completed)];

    for (const todo of completed) {
      handleDelete(todo.id);
    }
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
          InputValue={InputValue}
          setInputValue={setInputValue}
        />
        <Main
          SortItems={SortItems}
          allActive={allActive}
          handleDelete={handleDelete}
          isLoading={isLoading}
          tempTodo={tempTodo}
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
