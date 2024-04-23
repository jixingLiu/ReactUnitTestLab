// todos.js

// Mock 数据
let todoList = [
  {
    id: 1,
    title: '学习 TypeScript',
    content: '了解 TypeScript 基础',
    status: '待开始',
  },
  { id: 2, title: '阅读文档', content: '熟悉 UMI 文档', status: '进行中' },
];

// 导出处理请求的函数
export default async function handler(req, res) {
  // 根据请求方法调用相应的处理函数
  switch (req.method) {
    case 'GET':
      getTodos(req, res);
      break;
    case 'POST':
      addTodo(req, res);
      break;
    case 'PUT':
      updateTodo(req, res);
      break;
    case 'DELETE':
      deleteTodo(req, res);
      break;
    default:
      res.status(405).end(); // 返回不允许的方法
  }
}

// 处理 GET 请求
export async function getTodos(req, res) {
  res.status(200).json({ success: true, data: todoList });
}

// 处理 POST 请求
export async function addTodo(req, res) {
  const { title, content, status } = req.body;
  if (!title || !content || !status) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const newTodo = {
    id: todoList.length + 1,
    title,
    content,
    status,
  };

  todoList.push(newTodo);
  res.status(201).json({ success: true, data: newTodo });
}

// 处理 PUT 请求
export async function updateTodo(req, res) {
  const { id } = req.params;
  const { title, content, status } = req.body;

  const todoIndex = todoList.findIndex((todo) => todo.id === parseInt(id));
  if (todoIndex === -1) {
    return res.status(404).json({ success: false, message: 'Todo not found' });
  }

  todoList[todoIndex] = {
    ...todoList[todoIndex],
    title: title || todoList[todoIndex].title,
    content: content || todoList[todoIndex].content,
    status: status || todoList[todoIndex].status,
  };

  res.status(200).json({ success: true, data: todoList[todoIndex] });
}

// 处理 DELETE 请求
export async function deleteTodo(req, res) {
  const { id } = req.params;
  const initialLength = todoList.length;

  todoList = todoList.filter((todo) => todo.id !== parseInt(id));
  if (todoList.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Todo not found' });
  }

  res.status(200).json({ success: true, message: 'Todo deleted successfully' });
}
