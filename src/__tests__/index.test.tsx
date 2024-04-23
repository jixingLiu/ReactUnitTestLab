import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import axios from 'axios';

import App from '../pages/index'; // 替换成你的组件的实际路径

// Mock axios module for HTTP requests
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Todo List App', () => {
  it('should display fetched todos', async () => {
    const todos = [
      { id: 1, title: 'Test Todo 1', content: 'Content 1', status: '待开始' },
    ];
    mockedAxios.get.mockResolvedValue({ data: { data: todos } });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      todos.forEach((todo) => {
        expect(screen.getByText(todo.title)).toBeInTheDocument();
      });
    });
  });

  it('should open a modal to add a new todo', async () => {
    await act(async () => {
      render(<App />);
    });
    fireEvent.click(screen.getByText('新增待办事项'));
    expect(screen.getByText('新增待办')).toBeInTheDocument();
  });

  it('should allow users to create a new todo', async () => {
    mockedAxios.post.mockResolvedValue({});

    await act(async () => {
      render(<App />);
    });

    fireEvent.click(screen.getByText('新增待办事项'));
    fireEvent.change(screen.getByLabelText('标题'), {
      target: { value: 'New Todo' },
    });
    fireEvent.change(screen.getByLabelText('内容'), {
      target: { value: 'New content' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('OK'));
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/todos', {
        title: 'New Todo',
        content: 'New content',
        status: '待开始', // 默认选项
      });
    });
  });

  // ... 其他测试用例
  it('should open a modal to edit an existing todo', async () => {
    const todos = [
      { id: 1, title: 'Test Todo 1', content: 'Content 1', status: '待开始' },
    ];
    mockedAxios.get.mockResolvedValue({ data: { data: todos } });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('编 辑')[0]);
      expect(screen.getByText('编辑待办')).toBeInTheDocument();
    });
  });

  it('should allow users to edit an existing todo', async () => {
    const todos = [
      { id: 1, title: 'Test Todo 1', content: 'Content 1', status: '待开始' },
      // ... more todos
    ];
    mockedAxios.get.mockResolvedValue({ data: { data: todos } });
    mockedAxios.put.mockResolvedValue({});

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('编 辑')[0]);
    });

    fireEvent.change(screen.getByLabelText('标题'), {
      target: { value: 'Updated Todo' },
    });
    fireEvent.change(screen.getByLabelText('内容'), {
      target: { value: 'Updated content' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('OK'));
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(`/api/todos/1`, {
        title: 'Updated Todo',
        content: 'Updated content',
        status: '待开始', // 默认选项
      });
    });
  });

  it('should allow users to delete a todo', async () => {
    const todos = [
      { id: 1, title: 'Test Todo 1', content: 'Content 1', status: '待开始' },
      // ... more todos
    ];
    mockedAxios.get.mockResolvedValue({ data: { data: todos } });
    mockedAxios.delete.mockResolvedValue({});

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('删 除')[0]);
    });

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(`/api/todos/1`);
    });
  });
});
