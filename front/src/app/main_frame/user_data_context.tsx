"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';

const UserDataContext = createContext<any>(null);

const UserDataContextProvider = ({ children,my_name, my_id}: any) => {
	const [nickname, setNickname] = useState(my_name);
	const [user_id, setUserId] = useState(my_id);


	return (
	    <UserDataContext.Provider value={{ nickname, user_id }}>
			{children}
		</UserDataContext.Provider>
	);
};


export const useUserDataContext = () => {
	return useContext(UserDataContext);
};

export default UserDataContextProvider;