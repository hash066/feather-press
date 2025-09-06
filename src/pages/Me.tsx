import React from 'react';
import { Navigation } from '@/components/Navigation';
import { UserContentDashboard } from '@/components/UserContentDashboard';

const Me: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <UserContentDashboard userId="me" />
      </div>
    </div>
  );
};

export default Me;


