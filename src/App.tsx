import React from 'react';

const App = () => {
  console.log('App component is rendering!');
  
  return (
    <div className="min-h-screen bg-green-100 p-8">
      <h1 className="text-4xl font-bold text-green-900 text-center">
        APP TEST - This Should Show!
      </h1>
      <p className="text-xl text-green-700 text-center mt-4">
        If you can see this green page, the App component is working!
      </p>
      <div className="mt-8 text-center">
        <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
          App Test Button
        </button>
      </div>
    </div>
  );
};

export default App;
