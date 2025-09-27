// LoadingScreen.tsx
import React from 'react';
import "./LoadingScreen.css"; // optional CSS file

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading, please wait...</p>
    </div>
  );
};
