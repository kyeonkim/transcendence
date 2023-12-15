import React, { createContext, useState, useContext } from 'react';


const StatusContext = createContext<any>(null);

const StatusContextProvider = ({ children }: any) => {
	const [Status, setStatus] = useState('login');
	// 'lo';

	return (
	  <StatusContext.Provider value={{ Status, setStatus }}>
			{children}
		</StatusContext.Provider>
	);
};


export const useStatusContext = () => {
	return useContext(StatusContext);
};

export default StatusContextProvider;