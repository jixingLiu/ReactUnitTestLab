interface Todo {
  id: number;
  title: string;
  content: string;
  status: string;
}
export const todoList: Todo[] = [
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
    console.log('/api/todos---');
    res.json({ success: true, data: todoList });
  },

  'POST /api/todos': (req: any, res: any) => {
    if (!req.body.title || !req.body.content || !req.body.status) {
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
