"use client"

import { useEffect, useState } from 'react';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import FriendListPanel from './friend_list_panal';
import AlarmListPanal from './alarm_list_panal';

import Badge from '@mui/material/Badge';  
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import GroupIcon from '@mui/icons-material/Group';
import ForumIcon from '@mui/icons-material/Forum';
import ThreePIcon from '@mui/icons-material/ThreeP';

import { useCookies } from 'next-client-cookies';

import axios from 'axios';
import Paper from '@mui/material/Paper';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

interface SearchUserProps {
	setMTbox: (num: number, searchTarget: string) => void;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 4 }}>
						{children}
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export default function BasicTabs({ setMTbox }: SearchUserProps) {
	const [value, setValue] = useState(0);
	const [alarmCount, setAlarmCount] = useState(0);
	const [AlarmList, setAlarmList] = useState<any>([]);
	const cookies = useCookies();

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};
	
	const setAlarmCountHandler = (increment :boolean) => {
		if (increment === true)
		{
			setAlarmCount((prevAlarmCount) => prevAlarmCount + 1);
			console.log('it increased!!!');
		}
		else
		{
			if (alarmCount !== 0)
			{
				setAlarmCount((prevAlarmCount) => prevAlarmCount - 1);
				console.log('it decreased!!!');
			}
		}

	};

	const setAlarmListAdd = (alarm: any) => {
		setAlarmList((prevAlarmList :any) => 
			[...prevAlarmList, alarm]);
	}

	const setAlarmListRemover = (alarm :any) => {
		const newAlarmList = AlarmList.filter(
			(listAlarm :any) => listAlarm.idx != alarm.idx);

		setAlarmList(newAlarmList);
	}; 

		// 초기 알람 목록 설정하기 (api)
	const fetchAlarms = async () => {
		await axios.get(`${process.env.NEXT_PUBLIC_API_URL}event/getalarms/${cookies.get('user_id')}`)
		.then((response) => {
			if (response.data.status)
				console.log('alarmList success - ', response.data);
			else
				console.log('alarmList fail - ', response.data);
		})
		.catch((err) => {
			console.log('getalarm error');
		})

	}

	useEffect(() => {
		const sseEvents = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}event/alarmsse/${cookies.get('user_id')}`);

		sseEvents.onopen = function() {
			fetchAlarms();
			// 알람 종류(type)는 game, chat, friend
		}

		sseEvents.onerror = function (error) {
		}

		sseEvents.onmessage = function (stream) {
			const parsedData = JSON.parse(stream.data);

			setAlarmCountHandler(true);
			setAlarmListAdd(parsedData);
		}

		return () => {
			sseEvents.close();
		};
}, []);

	return (
		<Box sx={{ width: '100%'}}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
				<Paper elevation={6}>
				<Tabs value={value} onChange={handleChange} centered aria-label="basic tabs example">
					<Tab icon={<GroupIcon/>} {...a11yProps(0)} />
					{/* <Tab icon={<ForumIcon/>} {...a11yProps(1)} />
					<Tab icon={<ThreePIcon/>} {...a11yProps(2)} /> */}
					<Tab icon={
					<Badge color="secondary" badgeContent={alarmCount}>
						<NotificationsRoundedIcon/>
					</Badge>
						} {...a11yProps(1)} />
				</Tabs>
				</Paper>
			</Box>
			<CustomTabPanel value={value} index={0}>
				<FriendListPanel setMTbox={setMTbox}/>
			</CustomTabPanel>
			{/* <CustomTabPanel value={value} index={1}>
				Channel list
			</CustomTabPanel>
			<CustomTabPanel value={value} index={2}>
				User list
			</CustomTabPanel> */}
			<CustomTabPanel value={value} index={1}>
				<AlarmListPanal
					alarmList={AlarmList}
					alarmListRemover={setAlarmListRemover}
					alarmCountHandler={setAlarmCountHandler}
					setMTbox={setMTbox}/>
			</CustomTabPanel>
		</Box>
	);
}