import React from 'react';

export const TestDashboard: React.FC = () => {
  console.log('TestDashboard is rendering!');
  
  return (
    <div className="py-16 bg-blue-100">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          TEST DASHBOARD - This Should Show!
        </h1>
        <p className="text-xl text-blue-700">
          If you can see this, the component system is working!
        </p>
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Content Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
              <h3 className="font-bold">Blog Posts</h3>
              <p className="text-2xl font-bold">2</p>
              <button className="bg-white text-blue-500 px-4 py-2 rounded mt-2">
                New Post
              </button>
            </div>
            <div className="bg-purple-500 text-white p-4 rounded-lg text-center">
              <h3 className="font-bold">Photo Gallery</h3>
              <p className="text-2xl font-bold">0</p>
              <button className="bg-white text-purple-500 px-4 py-2 rounded mt-2">
                New Gallery
              </button>
            </div>
            <div className="bg-red-500 text-white p-4 rounded-lg text-center">
              <h3 className="font-bold">Videos</h3>
              <p className="text-2xl font-bold">0</p>
              <button className="bg-white text-red-500 px-4 py-2 rounded mt-2">
                New Video
              </button>
            </div>
            <div className="bg-yellow-500 text-white p-4 rounded-lg text-center">
              <h3 className="font-bold">Quotes</h3>
              <p className="text-2xl font-bold">0</p>
              <button className="bg-white text-yellow-500 px-4 py-2 rounded mt-2">
                New Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
