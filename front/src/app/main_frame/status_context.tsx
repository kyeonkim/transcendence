import React, { createContext, useState, useContext } from 'react';


const StatusContext = createContext<any>(null);

const StatusContextProvider = ({ children }: any) => {
	const [Status, setStatus] = useState<any>([]);
	/*
	status = {
		myStatus: 'online' | 'offline' | 'ingame';
		ingameroom: boolean;
	}
	*/
	console.log("status context provider===", Status);

	return (
	  <StatusContext.Provider value={{ Status, setStatus }}>
			{children}
		</StatusContext.Provider>
	);
};


const useStatusContext = () => {
	return useContext(StatusContext);
};