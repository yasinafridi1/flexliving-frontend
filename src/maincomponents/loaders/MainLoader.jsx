import React from 'react';
import logoFull from '@assets/logo.webp';

const MainLoader = () => {
  return (
    <div className='bg-primary flex justify-center items-center w-screen h-screen flex-col overflow-hidden'>
      <img src={logoFull} />
      <div className='flex justify-center items-center flex-col h-[200px] w-full'>
        <div className='w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin' />
        <h3 className='text-background mt-2'>Please wait</h3>
      </div>
    </div>
  );
};

export default MainLoader;
