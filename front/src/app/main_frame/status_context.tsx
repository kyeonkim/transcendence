import React, { createContext, useState, useContext } from 'react';


const StatusContext = createContext<any>(null);

const StatusContextProvider = ({ children }: any) => {
	const [status, setStatus] = useState('login');
	// 'login', 'online', 'inGame'

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