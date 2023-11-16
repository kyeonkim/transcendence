import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import CommentIcon from '@mui/icons-material/Comment';
import { useEffect, useState } from 'react';
import { useCookies } from 'next-client-cookies';
import axios from 'axios';
import { useChatSocket } from "../../app/main_frame/socket_provider"

export default function FriendListPanel({ setMTbox }: any) {
	const [redering, setRendering] = useState('');
	const [apiResponse, setApiResponse] = useState([]);
	const cookies = useCookies();
	const socket = useChatSocket();

	// useEffect(() => {
	// 	console.log('socket', socket);
	// 	socket.on(`render-friend`, (data) => {
	// 		setRendering(data);
	// 	});
	
	// 	return () => {
	// 		socket.off("render-friend");
	// 	};
	// }, [socket]) 
	// socket is undefined 왜!!!!

	useEffect(() => {
		const fetchData = async () => {
			await axios.get(`${process.env.NEXT_PUBLIC_API_URL}social/getFriendList/${cookies.get('user_id')}`)
				.then((response) => {
				if (response.data.status) {
					console.log('friend list=======');
					console.log(response);
					setApiResponse(response.data.data);
				}
			})
		}
		fetchData();
		// socket.emit(`status`, { user_id: cookies.get('user_id'), status: `login`});
	}, [redering]);

	useEffect(() => {
		apiResponse.forEach(user => {
			socket.on(`status-${user.followed_user_id}`, (data) => {
				console.log('status update');
				if (data.status === `login`)
				{
					socket.emit(`status`, { user_id: cookies.get('user_id'), status: `online`}); // 현재상태 status안에 넣기
				}
				updateStatus(user.followed_user_id, data.status);
				});
			});

	return () => {
		apiResponse.forEach(user => {
		socket.off(`status-${user.followed_user_id}`);
		});
	};
	}, [apiResponse]);

	const updateStatus = (userId: any, status: any) => {
	setApiResponse(prevState =>
		prevState.map(user =>
		user.followed_user_id === userId ? { ...user, status } : user
		)
	);
	};

	const handleChat = (id: any) => () => {
		console.log("chat to " + id);
	}

	const handleProfile = (id: any) => () => {
		setMTbox(1, id);
	}

	const getStatusColor = (status: string) => {
		return status === 'online' || status === 'login' ? 'yellow' : 'grey';
		};

	return (
		<div>
			{apiResponse.length > 0 ? (
				<List dense sx={{ width: '100%', maxWidth: 400, maxHeight: 580, bgcolor: 'background.paper', overflow: 'auto'}}>
					{apiResponse.map((user: any) => (
						<ListItem key={user.followed_user_id} disablePadding>
							<ListItemButton onClick={handleProfile(user.followed_user_nickname)}>
								<ListItemAvatar>
									<Avatar src={`${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${user.followed_user_nickname}`} />
								</ListItemAvatar>
								<ListItemText primary={user.followed_user_nickname} />
								<div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getStatusColor(user.status), marginRight: '5px' }}></div>
								<IconButton edge="end" aria-label="comments" onClick={handleChat(user.followed_user_nickname)}>
									<CommentIcon />
								</IconButton>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			) : (
				<p>친구가 없습니다.</p>
			)}
	</div>
	);
}
