"use client"

import { useEffect, useRef, useState } from 'react';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Paper from '@mui/material/Paper';

import FriendListPanel from './friend_list_panal';
import AlarmListPanal from './alarm_list_panal';

import Badge from '@mui/material/Badge';  
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import GroupIcon from '@mui/icons-material/Group';
import ForumIcon from '@mui/icons-material/Forum';
import ThreePIcon from '@mui/icons-material/ThreeP';

import { useCookies } from 'next-client-cookies';

import axios from 'axios';
import { useChatSocket } from "../../app/main_frame/socket_provider"
import { get } from 'http';
import { useFriendList } from './friend_status';

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
	const [dmOpenId, setDmOpenId] = useState(-1);
	const [dmOpenNickname, setDmOpenNickname] = useState('');
	const [dmAlarmCount, setDmAlarmCount] = useState(false);
	const [dmAlarmMessageList, setDmAlarmMessageList] = useState<any>([]);
	const [dmText, setDmText] = useState('');
	const cookies = useCookies();
	const socket = useChatSocket();
	const friendlist = useFriendList(cookies.get('user_id'));
	const tabsRef = useRef(null);

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
			(listAlarm :any) => listAlarm.idx != alarm.idx
		);

		setAlarmList(newAlarmList);
	}; 

	// alarm안에 idx 있을 것.
	const dmAlarmRemover = (alarm :any) => {

		const newDmAlarmList = dmAlarmMessageList.filter(
			(dmAlarmList :any) => dmAlarmList.idx != alarm.idx
		);

		setDmAlarmMessageList(newDmAlarmList);
	}


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

		socket.emit('status', { user_id: cookies.get('user_id'), status: 'online' });

		return () => {
			sseEvents.close();
		};
	}, []);


	if (friendlist)
	{

	}

	const handleChatTarget = (from_id :any, from_nickname: any) => () => {

		// state 변경해서 DM rendering하게 만들기
		if (dmOpenId === from_id)
		{
			console.log('dm closed');
			setDmOpenId(-1);
			setDmOpenNickname('');
		}

		else
		{
			console.log("dm to - ", from_id);
			setDmOpenId(from_id);
			setDmOpenNickname(from_nickname);
		}

	};


	// !!!!! listener 복수 열기 테스트
	useEffect(() => {

		// dm 읽는 걸 열고, emit으로 준비 되었다고 신호 줌.
		socket.on('dm', (data :any) => {
			console.log('dm listened - ', data);
			if (data.from_id === dmOpenId)
			{
				// 이미 dm 있으니 아무것도 하지 않는다.
				console.log('dm to dmOpenId');
			}
			else
			{
				console.log('dm to alarm');
				// setDmAlarmMessageList((prevDmAlarmMessageList :any) => 
				// 	[...prevDmAlarmMessageList, data]);
				
				// 알람 갯수만 관리하는게 나을지도?
					// 전체 검색 - 아이디, 갯수 묶음(배열 혹은 클래스)의 배열로 저장
					// 각 친구를 렌더할 때 자신의 것을 찾아서 렌더하기.
			}

		});

		socket.emit('getdm', { user_id: Number(cookies.get('user_id')) });

		return () => {
			socket.off('dm');
		};
	}, [socket]);




	return (
		<Box sx={{ width: '100%'}}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
				<Paper elevation={6}>
				<Tabs value={value} ref={tabsRef} onChange={handleChange} centered aria-label="basic tabs example">
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
				<FriendListPanel
					dmAlarmCount={dmAlarmCount}
					dmAlarmMessageList={dmAlarmMessageList}
					dmAlarmRemover={dmAlarmRemover}
					dmOpenId={dmOpenId}
					dmOpenNickname={dmOpenNickname}
					dmText={dmText}
					handleChatTarget={handleChatTarget}
					setMTbox={setMTbox}
					list={friendlist}
					myId={cookies.get('user_id')}
					tapref={tabsRef}
				/>
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