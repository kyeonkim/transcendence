import React from 'react';
import Test1 from './mainbox/test1';
import Test2 from './mainbox/test2';
import Test3 from './mainbox/test3';

const MainBox = (props: any) => {
  const value = props.mod;

  const handleRender = () => {
    if (value === 1)
		return <Test1 />;
    else if (value === 2)
		return <Test2 />;
    else
		return <Test3 />;
  };	

  return <div>{handleRender()}</div>;
};

export default MainBox;