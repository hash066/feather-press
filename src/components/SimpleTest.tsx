import React from 'react';

export const SimpleTest: React.FC = () => {
  return (
    <div className="p-8 bg-red-100 text-center">
      <h1 className="text-3xl font-bold text-red-800">
        SIMPLE TEST - This Should Show!
      </h1>
      <p className="text-xl text-red-600 mt-4">
        If you can see this red box, React is working!
      </p>
    </div>
  );
};
