interface Todo {
  id: number;
  title: string;
  content: string;
  status: string;
}

export let todoList: Todo[] = [
  {
    id: 1,
    title: '学习 TypeScript',
    content: '了解 TypeScript 基础',
    status: '待开始',
  },
  { id: 2, title: '阅读文档', content: '熟悉 UMI 文档', status: '进行中' },
];

export default {
  'GET /api/todos': (req: any, res: any) => {
    res.json({ success: true, data: todoList });
  },

  'POST /api/todos': (req: any, res: any) => {
    const { title, content, status } = req.body;
    // 检查是否存在相同标题的 todo
    const existingTodo = todoList.find(
      (todo) => todo.title?.trim() === title?.trim(),
    );
    if (existingTodo) {
      // 如果存在相同标题的 todo，则返回错误消息
      return res.json({ success: false, message: 'Title already exists' });
    }

    // 如果缺少必要的字段，返回错误消息
    if (!title || !content || !status) {
      return res.json({ success: false, message: 'Missing fields' });
    }

    const newTodo: Todo = {
      id: todoList.length + 1,
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
    };

    todoList.push(newTodo);
    res.json({ success: true, data: newTodo });
  },

  'PUT /api/todos/:id': (req: any, res: any) => {
    const { id } = req.params;
    const index = todoList.findIndex((todo) => todo.id === parseInt(id));

    if (index === -1) {
      return res.json({ success: false, message: 'Todo not found' });
    }

    todoList[index] = { ...todoList[index], ...req.body };
    res.json({ success: true, data: todoList[index] });
  },

  'DELETE /api/todos/:id': (req: any, res: any) => {
    const { id } = req.params;
    const initialLength = todoList.length;
    todoList = todoList.filter((todo) => todo.id !== parseInt(id));

    if (todoList.length === initialLength) {
      return res.json({ success: false, message: 'Todo not found' });
    }

    res.json({ success: true, message: 'Todo deleted successfully' });
  },
};
