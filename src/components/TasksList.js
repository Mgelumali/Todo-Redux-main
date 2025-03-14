
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask } from '../actions/taskActions';
import { AiFillDelete } from "react-icons/ai";
import { toggleTask } from '../actions/taskActions';

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  const handleToggle = (id) => {
    dispatch(toggleTask(id));
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <div className='check-text'>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggle(task.id)}
          />
          <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.text}
          </span>
          </div>
          <button onClick={() => handleDelete(task.id)}><AiFillDelete size={28} /></button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
