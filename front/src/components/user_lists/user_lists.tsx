"use client"

import { useEffect, useRef, useState } from 'react';
import { axiosToken } from '@/util/token';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import Paper from '@mui/material/Paper';

import FriendListPanel from './friend_list_panal';
import AlarmListPanal from './alarm_list_panal';

import Badge from '@mui/material/Badge';  
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import GroupIcon from '@mui/icons-material/Group';

import { useCookies } from 'next-client-cookies';

import { useChatSocket } from "../../app/main_frame/socket_provider"
import { useFriendList } from './friend_status';
import { useChatBlockContext } from '@/app/main_frame/shared_state';
import { Grid } from '@mui/material';	
import styles from '@/app/main_frame/frame.module.css';

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
	const [alarmRerender, setAlarmRerender] = useState(false);
	const [alarmCount, setAlarmCount] = useState(0);
	const [alarmList, setAlarmList] = useState<any>([]);
	const [dmOpenId, setDmOpenId] = useState(-1);
	const [dmOpenNickname, setDmOpenNickname] = useState('');
	const [dmAlarmList, setDmAlarmList] = useState([]);
	const cookies = useCookies();
	const socket = useChatSocket();
	const tabsRef = useRef(null);
	const { handleRenderDmBlock } = useChatBlockContext();
	const friendList = useFriendList(cookies.get('user_id'));
	
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const handleAlarmRerender = () => {
		if (alarmRerender === true)
			setAlarmRerender(false);
		else
			setAlarmRerender(true);
	};

	const handleAlarmGetAgain = () => {
		// alarmList.clear();

	};

	const handleDmAlarmCount = (user_id :number, is_add :boolean) => {

		if (is_add === true)
		{
			console.log('handleDmAlarmCount - add to list', user_id, is_add);
			dmAlarmList.map((user :any) => {
				if (user === user_id)
				{
					return ;
				}
			})

			setDmAlarmList((prevDmAlarmList :any) => [...prevDmAlarmList, user_id]);
		}
		else
		{
			console.log('handleDmAlarmCount - delete from list', user_id, is_add);
			var tmp_list :any = [];

			dmAlarmList.map((user :any) => {
				if (user !== user_id)
				{
					tmp_list.push(user_id);
				}
			})

			setDmAlarmList(tmp_list);
		}

	}

	useEffect(() => {
		console.log('dmAlarmList - ', dmAlarmList);
	}, [dmAlarmList]);
	

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
		setAlarmList((prevalarmList :any) => 
			[...prevalarmList, alarm]);
	}

	const setAlarmListRemover = (alarm :any) => {
		const newAlarmList = alarmList.filter(
			(listAlarm :any) => listAlarm.idx != alarm.idx
		);

		setAlarmList(newAlarmList);
	}; 


	const fetchAlarms = async () => {
		await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}event/getalarms/${cookies.get('user_id')}`,{
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cookies.get('access_token')}`
			  },
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
			
			console.log('sseEvents occured!! - ', parsedData );

			setAlarmCountHandler(true);
			setAlarmListAdd(parsedData);
		}

		socket.emit('status', { user_id: Number(cookies.get('user_id')), status: 'online' });

		return () => {
			sseEvents.close();
		};
	}, []);


	useEffect(() => {
		handleAlarmGetAgain();
		fetchAlarms();
		setValue(1);
	}, [alarmRerender]);

	const handleChatTarget = (from_id :any, from_nickname: any) => {

		console.log('in handleChatTarget', dmOpenId, from_id);
		if (dmOpenId === from_id)
		{
			console.log('dm closed');
			setDmOpenId(-1);
			setDmOpenNickname('');
		}
		else
		{
			console.log("dm to - ", from_id, from_nickname);
			setDmOpenId(from_id);
			setDmOpenNickname(from_nickname);
			handleRenderDmBlock();
		}

	};

	return (
		<Grid className={styles.userlist}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
				<Paper elevation={6}>
				<Tabs value={value} ref={tabsRef} onChange={handleChange} centered aria-label="basic tabs example">
					<Tab icon={
						<Badge color="error" badgeContent={dmAlarmList.length ? "!" : 0}>
						<GroupIcon sx={{}}/>
						</Badge>
						} {...a11yProps(0)} />
					<Tab icon={
					<Badge color="error" badgeContent={alarmCount}>
						<NotificationsRoundedIcon/>
					</Badge>
						} {...a11yProps(1)} />
				</Tabs>
				</Paper>
			</Box>
			<CustomTabPanel value={value} index={0}>
				<FriendListPanel
					dmOpenId={dmOpenId}
					dmOpenNickname={dmOpenNickname}
					handleDmAlarmCount={handleDmAlarmCount}
					handleChatTarget={handleChatTarget}
					setMTbox={setMTbox}
					list={friendList}
					myId={cookies.get('user_id')}
					tapref={tabsRef}
				/>
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<AlarmListPanal
					alarmList={alarmList}
					alarmListRemover={setAlarmListRemover}
					alarmCountHandler={setAlarmCountHandler}
					handleAlarmRerender={handleAlarmRerender}
					setMTbox={setMTbox}/>
			</CustomTabPanel>
		</Grid>
	);
}