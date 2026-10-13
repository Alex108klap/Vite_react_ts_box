
import { useState } from 'react';
import TaskForm from './TaskForm';

export function ParentApp() {
  const [tasks, setTasks] = useState([]);
  
  // 3. Эта функция будет вызвана ИЗНУТРИ компонента TaskForm
  const handleAddTask = (newTaskText) => {
    const newTask = {
      id: Date.now(),
      text: newTaskText
    };
    // Обновляем состояние родителя данными, пришедшими от ребенка
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };
  
  return (
<div>
    <h1 style={{
      color: '#ccd2d9',
      fontSize: '24px',
      // textAlign: 'center',
      marginBottom: '20px'
    }}>Мой список задач</h1>
    
    {/*/!* 4. Передаем функцию handleAddTask под именем onAddTask *!/*/}
    {/*<TaskForm onAddTask={handleAddTask} />*/}
    
    <ul>
      {tasks.map(task => (
        <li key={task.id}>{task.text}</li>
      ))}
    </ul>
  
  {/* 4. Передаем функцию handleAddTask под именем onAddTask */}
  <TaskForm onAddTask={handleAddTask} />
  </div>
  
);
}




