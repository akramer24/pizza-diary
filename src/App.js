import React from 'react';
import { Routes } from './components';

function App() {
  return (
    [
      <div id="modal-root" key="modal" />,
      <Routes key="routes" />
    ]
  );
}

export default App;
