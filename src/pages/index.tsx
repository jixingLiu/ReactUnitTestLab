import { Todo } from '@/types/todo';
import { Button, Form, Input, List, Modal, Select } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [form] = Form.useForm();
  const [filter, setFilter] = useState<string>('所有');

  useEffect(() => {
    fetchTodos();
  }, [filter]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get<{ data: Todo[] }>('/api/todos');
      const data = response.data.data;
      const filteredData =
        filter === '所有'
          ? data
          : data.filter((todo) => todo.status === filter);
      setTodos(filteredData);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const showModal = (todo: Todo | null) => {
    setCurrentTodo(todo);
    setIsModalVisible(true);
    form.setFieldsValue(todo ? todo : { status: '待开始' });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (currentTodo) {
        await axios.put(`/api/todos/${currentTodo.id}`, values);
      } else {
        await axios.post('/api/todos', values);
      }
      fetchTodos();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const deleteTodo = async (id: number) => {
    await axios.delete(`/api/todos/${id}`);
    fetchTodos();
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <Select
          defaultValue="所有"
          style={{ width: 120 }}
          onChange={(value) => setFilter(value)}
        >
          <Option value="所有">所有</Option>
          <Option value="待开始">待开始</Option>
          <Option value="进行中">进行中</Option>
          <Option value="已完成">已完成</Option>
        </Select>
        <Button
          type="primary"
          onClick={() => showModal(null)}
          style={{ marginLeft: '16px' }}
        >
          新增待办事项
        </Button>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item
            actions={[
              <Button key="edit" onClick={() => showModal(todo)}>
                编辑
              </Button>,
              <Button key="delete" danger onClick={() => deleteTodo(todo.id)}>
                删除
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={todo.title}
              description={`${todo.content} - ${todo.status}`}
            />
          </List.Item>
        )}
      />
      <Modal
        title={currentTodo ? '编辑待办' : '新增待办'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select>
              <Option value="待开始">待开始</Option>
              <Option value="进行中">进行中</Option>
              <Option value="已完成">已完成</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
