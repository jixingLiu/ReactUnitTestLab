let todoList = [
  {
    id: 1,
    title: '学习 TypeScript',
    content: '了解 TypeScript 基础',
    status: '待开始',
  },
  { id: 2, title: '阅读文档', content: '熟悉 UMI 文档', status: '进行中' },
];

// 获取所有 Todo
export async function getTodos(req, res) {
  try {
    res.status(200).json({ success: true, data: todoList });
  } catch (error) {
    console.error('Error getting todos:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// 添加新的 Todo
export async function addTodo(req, res) {
  try {
    const { title, content, status } = req.body;
    if (!title || !content || !status) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing fields' });
    }

    const newTodo = {
      id: todoList.length + 1,
      title,
      content,
      status,
    };

    todoList.push(newTodo);
    res.status(201).json({ success: true, data: newTodo });
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// 更新 Todo
export async function updateTodo(req, res) {
  try {
    const { id } = req.params;
    const { title, content, status } = req.body;

    const todoIndex = todoList.findIndex((todo) => todo.id === parseInt(id));
    if (todoIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: 'Todo not found' });
    }

    todoList[todoIndex] = {
      ...todoList[todoIndex],
      title: title || todoList[todoIndex].title,
      content: content || todoList[todoIndex].content,
      status: status || todoList[todoIndex].status,
    };

    res.status(200).json({ success: true, data: todoList[todoIndex] });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// 删除 Todo
export async function deleteTodo(req, res) {
  try {
    const { id } = req.params;
    const initialLength = todoList.length;

    todoList = todoList.filter((todo) => todo.id !== parseInt(id));
    if (todoList.length === initialLength) {
      return res
        .status(404)
        .json({ success: false, message: 'Todo not found' });
    }

    res
      .status(200)
      .json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
