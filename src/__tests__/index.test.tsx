import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import request from '@/utils/axios/request';
import MockAdapter from 'axios-mock-adapter';
import App from '../pages/index';

describe('App component tests', () => {
  const mock = new MockAdapter(request.service);
  const todosMock = [
    { id: 1, title: 'Test Todo 1', content: 'Content 1', status: '待开始' },
    { id: 2, title: 'Test Todo 2', content: 'Content 2', status: '进行中' },
  ];

  beforeEach(() => {
    mock.reset();
    mock.onGet('/api/todos').reply(200, { data: todosMock, success: true });
  });

  it('should display fetched todos', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(async () => {
      expect(await screen.findByText('Test Todo 1')).toBeInTheDocument();
      expect(await screen.getByText('Content 1 - 待开始')).toBeInTheDocument();
    });
  });

  it('should open a modal to add a new todo', async () => {
    await act(async () => {
      render(<App />);
    });

    const addButton = await screen.getByText('新增待办事项');
    userEvent.click(addButton);
    await waitFor(async () => {
      expect(await screen.findByText('新增待办')).toBeInTheDocument();
    });
  });

  it('should allow users to create a new todo', async () => {
    const newTodo = {
      id: 2,
      title: 'New Todo',
      content: 'New content',
      status: '待开始',
    };
    mock.onPost('/api/todos').reply(200, { data: newTodo, success: true }); // 使用 MockAdapter 模拟 POST 请求

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
      expect(mock.history.post.length).toBe(1); // 检查 POST 请求是否被调用
      expect(mock.history.post[0].data).toEqual(
        JSON.stringify({
          title: 'New Todo',
          content: 'New content',
          status: '待开始',
        }),
      );
    });
  });

  it('should open a modal to edit an existing todo', async () => {
    const todos = [
      { id: 1, title: 'Test Todo 1', content: 'Content 1', status: '待开始' },
    ];
    mock.onGet('/api/todos').reply(200, { success: true, data: todos });

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
    ];
    mock.onGet('/api/todos').reply(200, { data: todos, success: true });
    mock.onPut('/api/todos/1').reply(200, { data: {}, success: true }); // 模拟 PUT 请求

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
      expect(mock.history.put.length).toBe(1); // 检查 PUT 请求是否被调用
      expect(mock.history.put[0].data).toEqual(
        JSON.stringify({
          title: 'Updated Todo',
          content: 'Updated content',
          status: '待开始',
        }),
      );
    });
  });

  it('should allow users to delete a todo', async () => {
    const todos = [
      { id: 1, title: 'Test Todo 1', content: 'Content 1', status: '待开始' },
    ];
    mock.onGet('/api/todos').reply(200, { data: todos, success: true });
    mock.onDelete('/api/todos/1').reply(200, { success: true, data: {} }); // 模拟 DELETE 请求

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('删 除')[0]);
    });

    await waitFor(() => {
      expect(mock.history.delete.length).toBe(1); // 检查 DELETE 请求是否被调用
    });
  });
});
