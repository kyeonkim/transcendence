'use client'
import React, { useMemo, createContext, useState, useContext } from 'react';

interface MainBoxState {
    clicked: number;
    setClick: React.Dispatch<React.SetStateAction<number>>;
    id: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
	profile: string;
    setProfile: React.Dispatch<React.SetStateAction<string>>;

	setMTBox: (value: number, searchTarget?: string) => void;
  }

 export const MainBoxContext = createContext<MainBoxState | undefined>(undefined);

const MainBoxContextProvider = ({ children }: any) => {

    const [clicked, setClick] = useState(0);
    const [id, setSearch] = useState('');
    const [profile, setProfile] = useState('');
	
	const setMTBox = (value: number, searchTarget?: string) => {
		setClick(value);
		setSearch(searchTarget || '');
	};
    

	const value :MainBoxState = useMemo(() => ({
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



