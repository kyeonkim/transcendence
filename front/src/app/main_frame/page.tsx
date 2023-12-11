"use client"

import { useState, useEffect } from 'react';

import Main from './containers';
import ChatSocket  from './socket_provider';
import ChatBlockProvider from './shared_state';


export default function MainFrame () {

  return (

        <ChatSocket>
          <ChatBlockProvider>
              <Main />
          </ChatBlockProvider>
        </ChatSocket>

  );
}
