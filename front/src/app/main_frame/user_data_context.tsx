"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';


const UserDataContext = createContext<any>(null);

const UserDataContextProvider = ({ children }: any) => {
	const [nickname, setNickname] = useState('');
	const [userId, setUserId] = useState(-1);

    useEffect(() => {
        // api 요청 - 토큰 가지고
        const fetchUserData = async () => {
            await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}apiToGetUserData`,{
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.get('access_token')}`
                },        
            }) 
            .then((res) => {
                if (res.data.userData)
                {
                    setNickname(data.nickname);
                    setUserId(data.userId);
                }
            })
        }

        fetchUserData();

    }, []);

	return (
	  <UserDataContext.Provider value={{ nickname, userId }}>
			{children}
		</UserDataContext.Provider>
	);
};


export const useUserDataContext = () => {
	return useContext(UserDataContext);
};

export default UserDataContextProvider;