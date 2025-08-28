import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@maincomponents/components/ui/card';
import { Skeleton } from '@maincomponents/components/ui/skeleton';
import React from 'react';

const ChartSkeleton = () => {
  return (
    <Card className='col-span-1'>
      <CardHeader>
        <Skeleton className='h-5 w-1/2 rounded-md mb-1' /> {/* Title placeholder */}
        <Skeleton className='h-4 w-3/4 rounded-md' /> {/* Description placeholder */}
      </CardHeader>
      <CardContent className='pl-2'>
        <div className='w-full h-64'>
          <Skeleton className='w-full h-full rounded-xl' /> {/* Chart placeholder */}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartSkeleton;
