"use client"

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation'

import Matching from './match/page';

export default function MainFrame () {

  const router = useRouter();

  useEffect(() => {
     router.replace('/main_frame/match');
  }, [])
  
  return (

    <></>
      // <Matching />

  );
}
