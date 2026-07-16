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
    if (tasks.length === 0) {
        return <div className="no-tasks">No tasks to display</div>;
    }
    
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
    
useEffect(() => {
    if (tasks.length === 0) return;

    const interval = setInterval(() => {
      next();
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex, tasks]);

 return (
    <div>
      <button onClick={prev}>Previous</button>
      
      <div >
        <div 
          style={{ 
            display: 'flex', 
            transform: `translateX(-${currentIndex * 100}%)`, 
            // transition: 'transform 0.5s ease' 
          }}
        >
          {tasks.map((task) => (
            <div className="task-item" key={task.id} style={{ minWidth: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
              <h3>{task.id}</h3>
              <p>{task.description}</p>
              <button onClick={() => onToggle(task.id)}>Toggle</button>
              <button onClick={() => onEdit(task.id)}>Edit</button>
              <button onClick={() => onDelete(task.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={next}>Next</button>
    </div>
  );
};

export default TaskList;