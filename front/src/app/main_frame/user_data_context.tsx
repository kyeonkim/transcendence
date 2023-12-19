"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useCookies } from 'next-client-cookies';
import { axiosToken } from '@/util/token';

const UserDataContext = createContext<any>(null);

const UserDataContextProvider = ({ children,my_name, my_id}: any) => {
	const [nickname, setNickname] = useState(my_name);
	const [user_id, setUserId] = useState(my_id);
    const cookies = useCookies();

    const [userData, setUserData] = useState({});
    const [fetchDone, setFetchDone] = useState(false);

    // useEffect(() => {
    //     // api 요청 - 토큰 가지고
    //     const fetchUserData = async () => {
    //         await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/mydata`,{
    //           headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${cookies.get('access_token')}`
    //             },        
    //         }) 
    //         .then((res :any) => {
    //             if (res.data.status === true)
    //             {
    //                 setFetchDone(true);
    //                 setUserData(res.data.userData);
    //             }
    //         })
    //     }

    //     fetchUserData();

    // }, []);
    
    // useEffect(() => {
    //     if (fetchDone)
    //     {
    //         setNickname(userData.nick_name);
    //         setUserId(userData.user_id);
    //     }
    // }, [fetchDone]);



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