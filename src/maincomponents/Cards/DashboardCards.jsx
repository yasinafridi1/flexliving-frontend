import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@maincomponents/components/ui/card';

const DashboardCards = ({ title, value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-200 text-blue-800',
    green: 'bg-green-200 text-green-800',
    pink: 'bg-pink-200 text-pink-800',
    yellow: 'bg-yellow-200 text-yellow-800',
    teal: 'bg-teal-200 text-teal-800'
  };
  return (
    <Card className={`border-none ${colorClasses[color]}`}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium capitalize'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
      </CardContent>
    </Card>
  );
};

export default DashboardCards;
