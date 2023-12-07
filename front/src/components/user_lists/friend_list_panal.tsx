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
import { useEffect, useState, useRef } from 'react';
import { useCookies } from 'next-client-cookies';
import axios from 'axios';
import { useChatSocket } from "../../app/main_frame/socket_provider"
import { Skeleton, Typography } from '@mui/material';
import { send } from 'process';
import Divider from '@mui/material/Divider';
import DirectMessage from './direct_message';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { axiosToken } from '@/util/token';

export default function FriendListPanel(props: any) {
	
	const [apiResponse, setApiResponse] = useState([]);

	const [dmCountList, setDmCountList] = useState([]);

	const [loading, setloading] = useState(true);
	const socket = useChatSocket();
	const { setMTbox, dmOpenId, dmOpenNickname, handleDmAlarmCount, handleChatTarget, list, myId, tapref} = props;

	const dmOpenIdRef = useRef(dmOpenId);
	const dmCountListRef = useRef(dmCountList);

	const cookies = useCookies();

	useEffect(() => {
		if (list && JSON.stringify(list) === JSON.stringify(apiResponse)) {
			return;
		}
		if (list) {	
			console.log('friend list panel===========', list, apiResponse);
			socket.emit('status', { user_id: myId, status: 'login' });
			
			// dmCountList를 순회하여 list에 없는 '인원'을 제거한다.
			// list를 순회하여 dmCountList에 없는 '인원'을 추가한다.

			list.map((user :any) => {
				const target = dmCountListRef.current.find((countList :any) => countList.id === user.followed_user_id) 
				if (target === undefined)
				{
					// 없을 경우 인원 추가
					console.log('add friend to dmCountList, id - ', user.followed_user_id);
					setDmCountList((prevDmCountList :any) => [...prevDmCountList, { id: user.followed_user_id, count: 0 }]);
				}
			})

			dmCountListRef.current.map((countList :any) => {
				// 
				const target = list.find((user :any) => user.followed_user_id === countList.id) 
				if (target === undefined)
				{
					// 없을 경우 인원 제거
					console.log('delete friend from dmCountList, id - ', countList.id);
					const newCountList = dmCountListRef.current.filter((searchList :any) => {
						return searchList.id !== countList.id
					})
					setDmCountList(newCountList);
				}
			})
			

			setApiResponse(list);

		}
		else
			setloading(true);
	}, [list]);

	useEffect(() => {
		setloading(false);
	}, [apiResponse]);

	useEffect(() => {

		const dmAlarmListener = (data :any) => {
			console.log('dm event!!===', data);
			

			console.log('dmAlarm dmOpenId - ', dmOpenIdRef.current);
			console.log('dmAlarm data.from_id - ', data.from_id);

			console.log('dmCountList - ', dmCountListRef.current);

			if (dmOpenIdRef.current === Number(data.from_id))
			{
				console.log('pass count');
				return ;
			}

			// dmCountList를 순회하여 count를 올린다.
			// setDmCountList에 넣어야함.

			// 이런 경우에 ref로 하는 방법도 있지만, handler 함수를 useCallback으로 빼고,
			// useCallback의 의존성을 현재 ref로 사용 중인 state로 지정하는 방법도 있다.

			const newDmCountList = dmCountListRef.current.map((countList :any) => {
				
					if (countList.id === data.from_id)
					{
						const newCountList = {...countList}; 
						handleDmAlarmCount(data.from_id, true);
						
						newCountList.count += 1;
	
						console.log('add count to friend dmCount to ,', newCountList.count);
						return newCountList;
					}
					return countList;
				})
			
			console.log('newDmCountList - ', newDmCountList);

			setDmCountList(newDmCountList);

		}

		socket.on('dm', dmAlarmListener);

		socket.emit('getdm', { user_id: Number(myId) });

		return () => {
			console.log('friend list socket dm unmounted');
			socket.off('dm', dmAlarmListener);
		}
	}, [socket]);

	useEffect(() => {
		dmOpenIdRef.current = dmOpenId;
	}, [dmOpenId])


	useEffect(() => {
		console.log('apiResponse===', apiResponse);
		console.log('dmCountList updated');
		dmCountListRef.current = dmCountList;
	}, [apiResponse, dmCountList]);


	const handleProfile = (id: any) => () => {
		console.log("profile to " + id);
		setMTbox(1, id);
	}

	const getStatusColor = (status: string) => {
		if (status === 'ingame')
			return 'red';
		else
			return status === 'online' || status === 'login' ? 'green' : 'grey';
		};

	const handlerClear = (from: any, name: any) => {
		// 열 때도 실행함

		console.log('handlerCLear - ', from, name);

		if (dmOpenIdRef.current === from)
		{
			// 끄는 동작임
			console.log('off');
			handleChatTarget(from, name);
			return ;
		}
		
		console.log('on');

		// dmCountList를 순회하여 count를 0으로 만든다.

		const newList = dmCountListRef.current.map((countList: any) => {
			
			if (countList.id === Number(from)) {
				const newCountList = {...countList};

				console.log('clear friend dmCount id - ', from);
				newCountList.count = 0;

				return newCountList;
			}
			return countList;
		});

		setDmCountList(newList);
		handleChatTarget(from, name);
		console.log('call handleDmAlarmCount in handlerClear - ', from, name);
		handleDmAlarmCount(from, false);
	}
	
	const handleFriendDmCount = (id :number) => {
		
		var res :number = 0;

		// some 구조 고려

		dmCountList.map((countList :any) => {
			
			if (countList.id === id)
			{
				console.log('count checking id - ', id, ' + count - ', countList.count);
				res = countList.count;
			}
		})

		return res;
	}

	const handleInviteGame = async (nick: any, name:any) => {
		console.log("invite game ", myId, " to ", nick)
		await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}game/inviteroom`, {
			user1_id: Number(myId),
			user1_nickname: cookies.get("nick_name"),
			user2_id: Number(nick),
			user2_nickname: name,
		},
		{
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`,
			},
		})
		.then((res: any) => {
			console.log('invite game res - ', res);
		})
	}

	return (
		<div>
			<List dense 
				sx={{
					width: '110%',
					left: '-10%',
					maxWidth: 400,
					maxHeight: 580,
					bgcolor: 'transparent',
					overflowY: 'auto',
				}}>
				{apiResponse?.length > 0 && (
					apiResponse.map((user: any) => (
						<ListItem key={user.followed_user_id}>
							<ListItemButton onClick={handleProfile(user.followed_user_nickname)} sx={{maxWidth: '300px'}}>
								<ListItemAvatar>
									<Avatar src={`${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${user.followed_user_nickname}`} style={{ width: '2vw', height: '2vw'}}/>
								</ListItemAvatar>
								<Typography sx={{ color: 'white', fontSize: '0.8vw' }}>
									{user.followed_user_nickname}
								</Typography>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div style={{
										width: '0.7vw',
										height: '0.7vw',
										borderRadius: '50%',
										border: '1px solid #000',
										marginLeft: '1.5vw',
										backgroundColor: getStatusColor(user.status),
										}}>
									</div>
									<Typography sx={{color: 'white', fontSize: '0.8vw'}}>
										{user.status === 'online' || user.status === 'login' ? 'ON' : 'OFF'}
									</Typography>
								</div>
							</ListItemButton>
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
						setMTbox={setMTbox}
						tapref={tapref}
						>
					</DirectMessage>
			) : (
				<div></div>
			)}
		</div>
	);
}
