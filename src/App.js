
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import TaskInput from './components/TaskInput';
import TaskList from './components/TasksList';
import './App.css'

const App = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <h1>My To-Do App</h1>
        <TaskInput />
        <TaskList />
      </div>
    </Provider>
  );
};

export default App;
