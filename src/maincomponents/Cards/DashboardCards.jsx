import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@maincomponents/components/ui/card';

const DashboardCards = ({ title, value, icon: Icon }) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {Icon && <Icon className='h-5 w-5 text-muted-foreground' />}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
      </CardContent>
    </Card>
  );
};

export default DashboardCards;
