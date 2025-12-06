import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold text-white">
              SafeTogether
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</NavLink>
              <NavLink to="/submit-report" className="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Submit Report</NavLink>
              <NavLink to="/map-view" className="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Map View</NavLink>
              <NavLink to="/social-feed" className="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Social Feed</NavLink>
              {token ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white font-medium">Hi, {userName || 'User'}</span>
                  <button onClick={handleLogout} className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-md hover:bg-gray-100 text-sm">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <NavLink to="/login" className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-md hover:bg-gray-100 text-sm">
                    Login
                  </NavLink>
                  <NavLink to="/signup" className="border border-white text-white font-semibold py-2 px-4 rounded-md hover:bg-white hover:text-blue-600 text-sm">
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-blue-600 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className="text-gray-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</NavLink>
            <NavLink to="/submit-report" className="text-gray-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Submit Report</NavLink>
            <NavLink to="/map-view" className="text-gray-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Map View</NavLink>
            <NavLink to="/social-feed" className="text-gray-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Social Feed</NavLink>
            <div className="border-t border-gray-700 pt-4 mt-4">
              {token ? (
                <div className="flex flex-col items-start space-y-2 px-2">
                  <span className="text-white font-medium">Hi, {userName || 'User'}</span>
                  <button onClick={handleLogout} className="w-full text-left bg-white text-blue-600 font-semibold py-2 px-3 rounded-md hover:bg-gray-100 text-sm">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <NavLink to="/login" className="bg-white text-blue-600 font-semibold py-2 px-3 rounded-md hover:bg-gray-100 text-sm text-center">
                    Login
                  </NavLink>
                  <NavLink to="/signup" className="border border-white text-white font-semibold py-2 px-3 rounded-md hover:bg-white hover:text-blue-600 text-sm text-center">
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;