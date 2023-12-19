'use client'
import React, { useMemo, createContext, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';

interface MainBoxState {
    clicked: number;
    setClick: React.Dispatch<React.SetStateAction<number>>;
    id: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
	profile: number;
    setProfile: React.Dispatch<React.SetStateAction<number>>;

	setMTBox: (value: number, searchTarget?: string) => void;
  }

 export const MainBoxContext = createContext<MainBoxState | undefined>(undefined);

const MainBoxContextProvider = ({ children }: any) => {

    const [clicked, setClick] = useState(0);
    const [id, setSearch] = useState('');
    const [profile, setProfile] = useState(0);

	const router = useRouter();

	const setMTBox = (value: number, searchTarget?: string) => {
		console.log('setMTBox called - value : ', value, ', target : ', searchTarget);

		setClick(value);

		if (value === 1)
		{
			setSearch(searchTarget || '');
			router.push(`/main_frame/profile?id=${searchTarget}`);
		}
		else
		{
			router.push('/main_frame/match');
		}

	};
    
	const value: MainBoxState = useMemo(() => ({
		clicked, setClick,
		id, setSearch,
		profile, setProfile,
		setMTBox
    }), [clicked, setClick,
		id, setSearch,
		profile, setProfile,
		setMTBox]);

	return (
	  <MainBoxContext.Provider value={value}>
			{children}
		</MainBoxContext.Provider>
	);
};


export const useMainBoxContext = () => {
	return useContext(MainBoxContext);
};

export default MainBoxContextProvider;



