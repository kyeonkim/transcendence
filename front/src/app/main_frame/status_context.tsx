"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';

import { useUserDataContext } from './user_data_context';
import { useChatSocket } from './socket_provider';

const StatusContext = createContext<any>(null);

const StatusContextProvider = ({ children }: any) => {
	const [status, setStatus] = useState('online');
	const { user_id } = useUserDataContext();
	const socket = useChatSocket();
	// 'online', 'inGame' 
		// 'update'
	
	useEffect(() => {
		socket.emit('status', { user_id: user_id, status: 'update' });
	}, [status]);

	return (
	  <StatusContext.Provider value={{ status, setStatus }}>
			{children}
		</StatusContext.Provider>
	);
};


export const useStatusContext = () => {
	return useContext(StatusContext);
};

export default StatusContextProvider;