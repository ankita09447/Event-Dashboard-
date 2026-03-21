import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import Events from './pages/Event';
import MyRegistrations from './pages/MyRegistrations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events" element={<Events />} />
        <Route path="/my-registrations" element={<MyRegistrations />} />
      </Routes>
    </Router>
  );
}

export default App;