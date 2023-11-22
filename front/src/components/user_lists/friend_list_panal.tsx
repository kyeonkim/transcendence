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
import { useEffect, useState } from 'react';
import { useCookies } from 'next-client-cookies';
import axios from 'axios';
import { useChatSocket } from "../../app/main_frame/socket_provider"
import { Skeleton } from '@mui/material';
import { send } from 'process';
import Divider from '@mui/material/Divider';
import DirectMessage from './direct_message';

export default function FriendListPanel(props: any) {
	const [apiResponse, setApiResponse] = useState([]);
	const [loading, setloading] = useState(true);
	const socket = useChatSocket();
	const { setMTbox, dmAlarmCount, dmAlarmCountList, dmAlarmRemover, dmOpenId, dmOpenNickname, handleChatTarget, list, myId, tapref} = props;

	useEffect(() => {
		if (list && JSON.stringify(list) === JSON.stringify(apiResponse)) {
			return;
		  }
		if (list) {	
			console.log('friend list panel===========', list);
			socket.emit('status', { user_id: myId, status: 'login' });
			setApiResponse(list);
		}
		else
			setloading(true);
	}, [list]);

	useEffect(() => {
		setloading(false);
	}, [apiResponse]);


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
	
	// 조건부로 DM 알람 렌더링하게 될 예정임

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
							<IconButton edge="end" aria-label="comments" onClick={handleChatTarget(user.followed_user_id, user.followed_user_nickname)}>
								<Badge color="secondary" badgeContent={1}>
									<CommentIcon />
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
						dmAlarmCount={dmAlarmCount}
						dmAlarmCountList={dmAlarmCountList}
						dmAlarmRemover={dmAlarmRemover}
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
