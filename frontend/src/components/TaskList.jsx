import React, { useState,useEffect } from 'react';
import '../App.css';

const TaskList = ({onToggle, onDelete, onEdit }) => {
    const [tasks, setTasks] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch('http://localhost:4000/api/tasks')
            .then(response => response.json())
            .then(data => setTasks(data));
    }, []);
 
    useEffect(() => {
    if (tasks.length === 0) return;

    const interval = setInterval(() => {
      next();
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex, tasks]);

    const next = () => {
        if (currentIndex === tasks.length - 1) {
        setCurrentIndex(0);
        } else {
        setCurrentIndex(currentIndex+1);
        }
    };
    const prev = () => {
        if (currentIndex === 0) {
        setCurrentIndex(tasks.length - 1);
        } else {
        setCurrentIndex(currentIndex-1);
        }
    };
  const Delete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      fetch(`http://localhost:4000/api/tasks/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          const updatedTasks = tasks.filter((t) => t.id !== id);
          setTasks(updatedTasks);
          if (currentIndex >= updatedTasks.length && updatedTasks.length > 0) {
            setCurrentIndex(updatedTasks.length - 1);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const Toggle = (id) => {
    fetch(`http://localhost:4000/api/tasks/${id}/toggle`, {
      method: 'PATCH',
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        const updatedTasks = tasks.map((t) => (t.id === id ? updatedTask : t));
        setTasks(updatedTasks);
      })
      .catch((err) => console.error(err));
  };

   if (tasks.length === 0) {
        return <div className="no-tasks">No tasks to display</div>;
    }

 return (
    <div>
      <button onClick={prev}>Previous</button>
      
      <div >
        <div 
          style={{ 
            display: 'flex', 
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {tasks.map((task) => (
            <div className="task-item" key={task.id} style={{ minWidth: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
              <h3>{task.id}</h3>
              <p>{task.description}</p>
              <button onClick={() => Toggle(task.id)}>Toggle</button>
              <button onClick={() => onEdit(task.id)}>Edit</button>
              <button onClick={() => Delete(task.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={next}>Next</button>
    </div>
  );
};

export default TaskList;