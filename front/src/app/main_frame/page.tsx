"use client"

import { useState, useEffect } from 'react';

import Main from './containers';
import ChatSocket  from './socket_provider';
import ChatBlockProvider from './shared_state';
import StatusContextProvider from './status_context';


export default function MainFrame () {

  return (
        <ChatSocket>
          <ChatBlockProvider>
            <StatusContextProvider>
              <Main />
            </StatusContextProvider>
          </ChatBlockProvider>
        </ChatSocket>
  );
}
