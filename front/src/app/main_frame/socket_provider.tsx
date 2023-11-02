"use client"
import React, { createContext, useContext } from 'react';
import socket from './socket'
import { Socket } from "socket.io-client"

const WebSocketContext = createContext<Socket>(null);


export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

const WebSocketProvider = ({ children } :any) => {


    return (
    <WebSocketContext.Provider value={socket}>
        {children}
    </WebSocketContext.Provider>
    );
};

export default WebSocketProvider;