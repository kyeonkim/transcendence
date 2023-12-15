'use client'

import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { axiosToken } from "@/util/token";
import { useCookies } from "next-client-cookies";

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

export default function AlarmInviteGame (props: any) {
	const { alarm, handleProfile, imageLoader, denyRequest, cookies, alarmReducer} = props;

	const acceptInviteGame = (alarm: any) => async () => {
		console.log ('acceptInviteGame - ', alarm)
		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}game/joinroom`, {
			user1_id: alarm.chatroom_id,
			user1_nickname: alarm.from_nickname,
			user2_id: Number(cookies.get('user_id')),
			user2_nickname: cookies.get('nick_name'),
			event_id: alarm.idx,
		},
		{
			headers: {
				'Authorization': `Bearer ${cookies.get('access_token')}`,
			}
		})
		.then((res) => {
			alarmReducer(alarm);
		})
	}
	const labelId = `comment-list-secondary-label-${alarm.from_nickname}`;

	return (
		<div>
			<ListItem disablePadding>
				<SportsEsportsIcon sx={{color: 'white'}}/>
				<ListItemButton onClick={handleProfile(alarm)}>
					<ListItemAvatar>
						<Avatar src={alarm.from_nickname ? imageLoader({src: alarm.from_nickname}) : null} />
					</ListItemAvatar>
					<ListItemText id={labelId} sx={{color: 'white'}} primary={`${alarm.from_nickname}`} />
				</ListItemButton>
				<IconButton sx={{color: 'green'}}onClick={acceptInviteGame(alarm)}>
					<CheckCircleOutlineRoundedIcon />
				</IconButton>
				<IconButton sx={{color: 'red'}}onClick={denyRequest(alarm)}>
					<ClearRoundedIcon />
				</IconButton>
			</ListItem>
		</div>
	)
}