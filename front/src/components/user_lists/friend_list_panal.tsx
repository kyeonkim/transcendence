import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import CommentIcon from '@mui/icons-material/Comment';
import Badge from '@mui/material/Badge';  
import { useEffect, useState, useRef, useCallback } from 'react';
import { useCookies } from 'next-client-cookies';
import axios from 'axios';
import { useChatSocket } from "../../app/main_frame/socket_provider"
import { Skeleton, Typography } from '@mui/material';
import { send } from 'process';
import Divider from '@mui/material/Divider';
import DirectMessage from './direct_message';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { axiosToken } from '@/util/token';

import { useStatusContext } from "@/app/main_frame/status_context";
import { useMainBoxContext } from '@/app/main_frame/mainbox_context';
import { useUserDataContext } from '@/app/main_frame/user_data_context';

export default function FriendListPanel(props: any) {
	
	const [apiResponse, setApiResponse] = useState([]);

	// const [dmCountList, setDmCountList] = useState([]);

	const [loading, setloading] = useState(true);

	const [ready, setReady] = useState(false);

	const socket = useChatSocket();
	const { status, setStatus } = useStatusContext();
	const { setMTBox } = useMainBoxContext();

	const { dmOpenId, setDmOpenId, dmCountList, setDmCountList, dmOpenIdRef, dmOpenNickname, handleDmAlarmCount, handleChatTarget, list, tapref} = props;

	// const dmOpenIdRef = useRef(dmOpenId);
	const dmCountListRef = useRef(dmCountList);

	const cookies = useCookies();
	const { nickname, user_id } = useUserDataContext();

	useEffect(() => {
		// 처음할 때 즉시 setStatus 들어가는 것을 방지하기 위함. 다른 확실한 조건이 있을까?
		// console.log('ready set');
		// console.log('socket in friend list panal\n', socket);
		setReady(true);

		return () => {
			setDmOpenId(-1);
		}
	}, [])
		

	useEffect(() => {
		// console.log('friend list render - ', list);
		// console.log('status Context - ', status);

		if (ready === true)
		{
			if (list && JSON.stringify(list) === JSON.stringify(apiResponse)) {
				// console.log('friend list done');
				return;
			}
		}
		if (list) {

			socket.emit('status', { user_id: user_id, status: 'update' });
			// socket.emit('status', { user_id: user_id, status: status });

			list.map((user :any) => {
				const target = dmCountListRef.current.find((countList :any) => countList.id === user.followed_user_id) 
				if (target === undefined)
				{
					// 없을 경우 인원 추가
					setDmCountList((prevDmCountList :any) => [...prevDmCountList, { id: user.followed_user_id, count: 0 }]);
				}
			})

			dmCountListRef.current.map((countList :any) => {
				
				const target = list.find((user :any) => user.followed_user_id === countList.id) 
				if (target === undefined)
				{
					// 없을 경우 인원 제거
					const newCountList = dmCountListRef.current.filter((searchList :any) => {
						return searchList.id !== countList.id
					})
					setDmCountList(newCountList);
				}
			})

			// console.log('ready to update apiResponse');

			setApiResponse(list);
		}
		else
		{
			// console.log('did set loading has happened? - not in most case');
			setloading(true);
		}

	}, [list]);

	useEffect(() => {
		setloading(false);
	}, [apiResponse]);

	// useEffect(() => {

	// 	const dmAlarmListener = (data :any) => {
	// 		if (dmOpenIdRef.current === Number(data.from_id))
	// 			return ;

	// 		const newDmCountList = dmCountListRef.current.map((countList :any) => {
				
	// 				if (countList.id === data.from_id)
	// 				{
	// 					const newCountList = {...countList}; 
	// 					handleDmAlarmCount(data.from_id, true);
						
	// 					newCountList.count += 1;

	// 					return newCountList;
	// 				}
	// 				return countList;
	// 			})

	// 		setDmCountList(newDmCountList);
	// 	}

	// 	socket.on('dm', dmAlarmListener);

	// 	socket.emit('getdm', { user_id: Number(user_id) });

	// 	return () => {
	// 		socket.off('dm', dmAlarmListener);
	// 	}
	// }, [socket]);

	// useEffect(() => {
	// 	dmOpenIdRef.current = dmOpenId;
	// }, [dmOpenId])


	useEffect(() => {
		dmCountListRef.current = dmCountList;
	}, [apiResponse, dmCountList]);


	const handleProfile = (id: any) => () => {
		setMTBox(1, id);
	}

	const getStatusColor = (status: string) => {
		if (status === 'ingame')
			return 'blue';
		else
			return status === 'online' || status === 'login' ? 'green' : 'grey';
		};

	const handlerClear = (from: any, name: any) => {

		if (dmOpenIdRef.current === from)
		{
			handleChatTarget(from, name);
			return ;
		}

		const newList = dmCountListRef.current.map((countList: any) => {
			
			if (countList.id === Number(from)) {
				const newCountList = {...countList};

				newCountList.count = 0;

				return newCountList;
			}
			return countList;
		});

		setDmCountList(newList);
		handleChatTarget(from, name);
		handleDmAlarmCount(from, false);
	}
	
	const handleFriendDmCount = (id :number) => {
		
		var res :number = 0;

		dmCountList.map((countList :any) => {
			
			if (countList.id === id)
			{
				res = countList.count;
			}
		})

		return res;
	}

	const handleInviteGame = async (nick: any, name:any) => {

		await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}game/inviteroom`, {
			user1_id: Number(user_id),
			user1_nickname: nickname,
			user2_id: Number(nick),
			user2_nickname: name,
		},
		{
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`,
			},
		})
		// .then((res: any) => {
		// 	console.log('invite game res - ', res);
		// })
	}

	return (
		<div>
			<List dense 
				sx={{
					position: 'absolute',
					top: '10%',
					width: '100%',
					left: '0%',
					maxWidth: '100%',
					maxHeight: '85%',
					overflow: 'auto',
					bgcolor: 'transparent',
					'&::-webkit-scrollbar': {
						display: 'none',
					},
				}}>
				{apiResponse?.length > 0 && (
					apiResponse.map((user: any) => (
						<ListItem key={user.followed_user_id}>
							<ListItemButton onClick={handleProfile(user.followed_user_nickname)}>
								<ListItemAvatar sx={{minWidth: 'unset'}}>
									<Avatar
										src={`${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${user.followed_user_nickname}?${new Date()}`}
										style={{ width: '2vw', height: '2vw'}}
									/>
								</ListItemAvatar>
								<Typography sx={{ color: 'white', fontSize: '0.8vw', marginLeft: '0.5vw'}}>
									{user.followed_user_nickname}
								</Typography>
							</ListItemButton>
								<div>
									<div style={{
										width: '0.7vw',
										height: '0.7vw',
										borderRadius: '50%',
										border: '1px solid #000',
										backgroundColor: getStatusColor(user.status),
										marginLeft: 'auto'
										}}>
									</div>
								</div>
							<IconButton edge="end" aria-label="comments" onClick={() => {handlerClear(user.followed_user_id, user.followed_user_nickname)}}>
								<Badge color="error" badgeContent={handleFriendDmCount(user.followed_user_id)}>
									<CommentIcon sx={{ color: 'white', fontSize: '1.5vw' }}/>
								</Badge>
							</IconButton>
							<IconButton edge="end" onClick={() => {handleInviteGame(user.followed_user_id, user.followed_user_nickname)}}>
								<SportsEsportsIcon sx={{ color: 'white', fontSize: '1.5vw'  }}/>
							</IconButton>
						</ListItem>
					))
				)}
			</List>
			{(dmOpenId > -1) ? (
					<DirectMessage
						dmOpenId={dmOpenId}
						dmOpenNickname={dmOpenNickname}
						handleChatTarget={handleChatTarget}
						tapref={tapref}
						>
					</DirectMessage>
			) : (
				<div></div>
			)}
		</div>
	);
}
