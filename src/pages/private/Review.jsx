import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maincomponents/components/ui/card';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Review = () => {
  const {data:userData} = useSelector((state)=>state.auth);



  async function checkDataSyncStatus(){

  }


  async function syncData(){

  }


  async function getReviewsData(){
    
  }


  useEffect(()=>{
    if(!userData?.hostAwayConnection){
      return;
    }else{
      checkDataSyncStatus();
    }
  },[])

  return (
    <div>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Reviews</h2>
        <p className='text-muted-foreground'>Manage your reviews here</p>
      </div>
      {
        data?.clientId && !data?.hostAwayConnection ? <Card>
          <CardHeader>
            <CardTitle>
              <h1>OOPs! Hostway not connected</h1>
            </CardTitle>
            </CardHeader>
            <CardContent>
            <CardDescription>
                  Looks like you have not added hostaway keys or connected to hostaway. Please go to integration page and add your hostaway keys and connect to hostaway to manage your reviews or  <Link to='/integration' className='font-semibold text-primary hover:underline'>
              Click here
            </Link>
            </CardDescription>
            </CardContent>
        </Card>
        : <h1>Hello data </h1>
      }
    </div>
  );
};

export default Review;
