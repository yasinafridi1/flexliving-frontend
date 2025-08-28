import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maincomponents/components/ui/card';
import React from 'react';

const ChartCard = ({ title, description, children }) => {
  return (
    <Card className='col-span-1'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='pl-2'>{children}</CardContent>
    </Card>
  );
};

export default ChartCard;
