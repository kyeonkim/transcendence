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
			socket.emit('status', { user_id: myId, status: 'login' });

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
			if (dmOpenIdRef.current === Number(data.from_id))
				return ;

			const newDmCountList = dmCountListRef.current.map((countList :any) => {
				
					if (countList.id === data.from_id)
					{
						const newCountList = {...countList}; 
						handleDmAlarmCount(data.from_id, true);
						
						newCountList.count += 1;

						return newCountList;
					}
					return countList;
				})
			setDmCountList(newDmCountList);
		}

		socket.on('dm', dmAlarmListener);

		socket.emit('getdm', { user_id: Number(myId) });

		return () => {
			socket.off('dm', dmAlarmListener);
		}
	}, [socket]);

	useEffect(() => {
		dmOpenIdRef.current = dmOpenId;
	}, [dmOpenId])


	useEffect(() => {
		dmCountListRef.current = dmCountList;
	}, [apiResponse, dmCountList]);


	const handleProfile = (id: any) => () => {
		setMTbox(1, id);
	}

	const getStatusColor = (status: string) => {
		if (status === 'ingame')
			return 'red';
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
										src={`${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${user.followed_user_nickname}`}
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
