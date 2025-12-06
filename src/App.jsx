import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ReportForm from './pages/ReportForm';
import MapView from './pages/MapView';
// import SocialFeed from './pages/SocialFeed';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/map-view" element={<MapView />} />
          {/* <Route path="/social-feed" element={<SocialFeed/>} /> */}

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/submit-report" element={<ReportForm />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;