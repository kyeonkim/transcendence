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
import { Skeleton } from '@mui/material';
import { send } from 'process';
import Divider from '@mui/material/Divider';
import DirectMessage from './direct_message';

export default function FriendListPanel(props: any) {
	
	const [apiResponse, setApiResponse] = useState([]);

	const [dmCountList, setDmCountList] = useState([]);

	const [loading, setloading] = useState(true);
	const socket = useChatSocket();
	const { setMTbox, dmOpenId, dmOpenNickname, handleDmAlarmCount, handleChatTarget, list, myId, tapref} = props;

	const dmOpenIdRef = useRef(dmOpenId);

	useEffect(() => {
		if (list && JSON.stringify(list) === JSON.stringify(apiResponse)) {
			return;
		}
		if (list) {	
			console.log('friend list panel===========', list, apiResponse);
			socket.emit('status', { user_id: myId, status: 'login' });
			
			// const newList = list.map((user: any) => {
			// 	const findUser = apiResponse.find((item: any) => item.followed_user_id === user.followed_user_id);
			// 	return findUser ? {...user, count: findUser.count} : user;
			// });

			
			// List를 순회해서 인원을 복사해서 넣는다. 현재 count를 설정한다.
			

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

			if (dmOpenIdRef.current === Number(data.from_id))
			{
				console.log('pass count');
				return ;
			}

			setApiResponse((prevState) =>
				prevState.map((user: any) => {
			  		if (user.followed_user_id == Number(data.from_id)) {
						console.log('dm event from===', user);
						handleDmAlarmCount(data.from_id, true);
						return { ...user, count: (user.count || 0 ) + 1 };
			  		}
			  		return user;
				})
		  	);
			

			// array search

			// const resUser = dmCountList.find((element) => (element.id === data.from_id));
				

			// if (resUser === undefined)
			// {
			// 	// 없으면 user를 추가하고 count를 추가
			// 	setDmCountList((prevDmCountList) => [...prevDmCountList, { id: data.from_id, count: 1 }]);
			// }
			// else
			// {
			// 	// 있으면 count를 추가
			// 	// resUser.id
			// 	setDmCountList((prevState) =>
			// 			prevState.map((user: any) => {
			// 				if (user.id == resUser.id) {
			// 					console.log('dm event from===', user);
			// 					handleDmAlarmCount(data.from_id, true);
			// 					return { ...user, count: (user.count || 0 ) + 1 };
			// 				}
			// 				return user;
			// 			})
			// 		);
			// }

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

	// useEffect(() => {
	// 	console.log('apiResponse===', apiResponse);
	// }, [apiResponse]);


	useEffect(() => {
		console.log('apiResponse===', apiResponse);
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

		const newList = apiResponse.map((user: any) => {
			if (user.followed_user_id === Number(from)) {
				return { ...user, count: 0 };
			}
			return user;
		});

		setApiResponse(newList);
		handleChatTarget(from, name);
		console.log('call handleDmAlarmCount in handlerClear - ', from, name);
		handleDmAlarmCount(from, false);
	}
	
	const handleBadgeCount = (id :number) => {
		
	}

	return (
		<div>
			<List dense sx={{ width: '100%', maxWidth: 400, maxHeight: 580, bgcolor: 'background.paper', overflow: 'auto'}}>
				{apiResponse?.length > 0 ? (
					apiResponse.map((user: any) => (
						<ListItem key={user.followed_user_id}>
							<ListItemButton onClick={handleProfile(user.followed_user_nickname)} sx={{width: "10px"}}>
								<ListItemAvatar>
									<Avatar src={`${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${user.followed_user_nickname}`} />
								</ListItemAvatar>
								<ListItemText primary={user.followed_user_nickname}/>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div style={{
										width: '10px',
										height: '10px',
										borderRadius: '50%',
										border: '1px solid #000',
										backgroundColor: getStatusColor(user.status),
										marginRight: '8px'
										}}>
									</div>
									<div>{user.status === 'online' || user.status === 'login' ? 'ON' : 'OFF'}</div>
								</div>
							</ListItemButton>
							<IconButton edge="end" aria-label="comments" onClick={() => {handlerClear(user.followed_user_id, user.followed_user_nickname)}}>
								<Badge color="error" badgeContent={user.count ? user.count : 0}>
									<CommentIcon/>
								</Badge>
							</IconButton>
						</ListItem>
					))
				) : (
					<div>친구없음</div>
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
