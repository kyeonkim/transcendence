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

import { useUserDataContext } from '@/app/main_frame/user_data_context';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
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

export default function BasicTabs() {
	const [value, setValue] = useState(0);
	const [alarmRerender, setAlarmRerender] = useState(false);
	const [alarmCount, setAlarmCount] = useState(0);
	const [alarmList, setAlarmList] = useState<any>([]);
	const [dmOpenId, setDmOpenId] = useState(-1);
	const [dmOpenNickname, setDmOpenNickname] = useState('');
	const [dmAlarmList, setDmAlarmList] = useState([]);
	const [render, setRender] = useState('');

	const tabsRef = useRef(null);

	const [dmCountList, setDmCountList] = useState([]);

	const dmOpenIdRef = useRef(dmOpenId);
	const dmCountListRef = useRef(dmCountList);

	const cookies = useCookies();
	const socket = useChatSocket();
	const { handleRenderDmBlock } = useChatBlockContext();
	const { user_id, nickname } = useUserDataContext();
	const friendList = useFriendList(user_id);

	let		getDmEmitted = false;

	
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const handleAlarmRerender = (data: any) => {
		setRender(data);
	};

	useEffect(() => {
		if (alarmRerender === true)
		setAlarmRerender(false);
	else
		setAlarmRerender(true);
	}, [render]);

	const handleAlarmGetAgain = () => {
		setAlarmList([]);
		setAlarmCount(0);
	};

	const handleDmAlarmCount = (user_id :number, is_add :boolean) => {

		setDmAlarmList((prevDmAlarmList: any) => {

			if (is_add === true)
			{

			  if (!prevDmAlarmList.includes(user_id))
			  {
				return [...prevDmAlarmList, user_id];
			  }

			}
			else
			{
			  return prevDmAlarmList.filter((user: any) => user !== user_id);
			}
		
			return prevDmAlarmList;
		  });

	}

	const setAlarmCountHandler = (increment :boolean) => {
		if (increment === true)
			setAlarmCount((prevAlarmCount) => prevAlarmCount + 1);
		else
		{
			if (alarmCount !== 0)
				setAlarmCount((prevAlarmCount) => prevAlarmCount === 0 ? 0 :  prevAlarmCount - 1);
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
		await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}event/getalarms/${user_id}`,{
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cookies.get('access_token')}`
			  },
		})
	}


	useEffect(() => {
		const sseEvents = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}event/alarmsse/${user_id}`);

		sseEvents.onopen = function() {
		}

		sseEvents.onerror = function (error) {
		}

		sseEvents.onmessage = function (stream) {
			const parsedData = JSON.parse(stream.data);
			
			setAlarmCountHandler(true);
			setAlarmListAdd(parsedData);
		}

		socket.emit('status', { user_id: Number(user_id), status: 'online' });

		return () => {
			sseEvents.close();
		};
	}, []);


	useEffect(() => {

		const dmAlarmListener = (data :any) => {

			if (dmOpenIdRef.current === Number(data.from_id))
				return ;

			setDmCountList((prevDmCountList) => {
				const newDmCountList = prevDmCountList.map((countList) => {
					
						if (countList.id === data.from_id)
						{
							const newCountList = {...countList}; 
							handleDmAlarmCount(data.from_id, true);
							
							newCountList.count += 1;

							return newCountList;
						}
						return countList;

				});
		  
				// console.log('newDmCountList - ', newDmCountList);
				return newDmCountList;
			  });
		  
		};

		socket.on('dm', dmAlarmListener);

		if (getDmEmitted == false)
		{
			socket.emit('getdm', { user_id: Number(user_id) });
			getDmEmitted = true;
		}

		return () => {
			socket.off('dm', dmAlarmListener);
		}
	}, [socket, setDmCountList, setDmAlarmList]);


	useEffect(() => {
		dmOpenIdRef.current = dmOpenId;
	}, [dmOpenId])

	useEffect(() => {
		dmCountListRef.current = dmCountList;
	}, [dmCountList]);

	useEffect(() => {
		handleAlarmGetAgain();
		fetchAlarms();
		setValue(0);
	}, [alarmRerender]);


	const handleChatTarget = (from_id :any, from_nickname: any) => {
		// console.log(from_id, from_nickname);
		if (dmOpenId === from_id)
		{
			// console.log("set dm out111===", );
			setDmOpenId(-1);
			setDmOpenNickname('');
		}
		else
		{
			// console.log("set dm out222===", );
			setDmOpenId(from_id);
			setDmOpenNickname(from_nickname);
			handleRenderDmBlock();
		}

	};

	useEffect(() => {
		if (dmOpenId === -1)
			return ;
		else {
			let flag = false;

			friendList.map((friend :any) => {
				if (friend.followed_user_id === dmOpenId)
				{
					flag = true;	
					return ;
				}
			})
			if (flag === false)
				setDmOpenId(-1);
		}
	}, [friendList]);

	return (
		<Grid className={styles.userlist}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
				<Paper elevation={6}>
				<Tabs value={value} ref={tabsRef} onChange={handleChange} centered aria-label="basic tabs example">
					<Tab icon={
						<Badge color="error" badgeContent={(dmAlarmList.length) ? "!" : 0}>
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
					setDmOpenId={setDmOpenId}
					dmCountList={dmCountList}
					setDmCountList={setDmCountList}
					dmOpenIdRef={dmOpenIdRef}
					dmCountListRef={dmCountListRef}
					dmOpenNickname={dmOpenNickname}
					handleDmAlarmCount={handleDmAlarmCount}
					handleChatTarget={handleChatTarget}
					list={friendList}
					tapref={tabsRef}
				/>
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<AlarmListPanal
					alarmList={alarmList}
					alarmListRemover={setAlarmListRemover}
					alarmCountHandler={setAlarmCountHandler}
					handleDmAlarmCount={handleDmAlarmCount}
					handleAlarmRerender={handleAlarmRerender}
					// setDm={setAlarmDM}
				/>
			</CustomTabPanel>
		</Grid>
	);
}