import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import PostForm from '@/components/PostForm';
import PostList from '@/components/PostList';

const TestMySQL = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking...');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await apiClient.healthCheck();
      setConnectionStatus('Connected to MySQL database!');
      setIsConnected(true);
    } catch (error) {
      setConnectionStatus('Failed to connect to MySQL database. Make sure the server is running.');
      setIsConnected(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'white', 
      color: 'black',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>MySQL Database Test Page</h1>
      
      <div className="mb-6 p-4 border rounded" style={{ 
        backgroundColor: isConnected ? '#f0f9ff' : '#fef2f2',
        borderColor: isConnected ? '#0ea5e9' : '#f87171'
      }}>
        <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
        <p className={isConnected ? 'text-green-600' : 'text-red-600'}>
          {connectionStatus}
        </p>
        <button 
          onClick={checkConnection}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Connection
        </button>
      </div>

      {isConnected && (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
            <PostForm />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">All Posts</h2>
            <PostList />
          </div>
        </>
      )}

      {!isConnected && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold text-yellow-800">Setup Instructions:</h3>
          <ol className="list-decimal list-inside mt-2 text-yellow-700 space-y-1">
            <li>Make sure MySQL is installed and running</li>
            <li>Create a database named 'feather_press'</li>
            <li>Copy env.example to .env and update with your MySQL credentials</li>
            <li>Run the database setup: <code>mysql -u root -p feather_press &lt; database-setup.sql</code></li>
            <li>Start the backend server: <code>npm run dev:server</code></li>
            <li>Start the frontend: <code>npm run dev</code></li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default TestMySQL;
