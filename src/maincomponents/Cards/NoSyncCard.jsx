import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maincomponents/components/ui/card';
import React from 'react';
import { Link } from 'react-router-dom';

const NoSyncCard = () => {
  return (
    <Card className={'mt-4'}>
      <CardHeader>
        <CardTitle>
          <h1 className='text-red-500'>OOPs! Hostway not connected</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Looks like you have not added hostaway keys or connected to hostaway. Please go to integration page and add
          your hostaway keys and connect to hostaway to manage your reviews or{' '}
          <Link to='/integration' className='font-semibold text-blue-600 hover:underline'>
            Click here
          </Link>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default NoSyncCard;
