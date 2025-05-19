/* eslint-disable no-console */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2564;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const DeleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const AddTodos = (newTodo: object) => {
  return client.post(`/todos?userId=${USER_ID}`, newTodo);
};

// Add more methods here
