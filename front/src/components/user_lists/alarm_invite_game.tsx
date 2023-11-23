'use client'

import { Avatar, IconButton, ListItem, ListItemButton, Typography } from "@mui/material";
import { axiosToken } from "@/util/token";
import { useCookies } from "next-client-cookies";

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

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
			console.log('acceptInviteGame - res', res)
			alarmReducer(alarm);
		})
	}
	return (
		<div>
			<ListItem disablePadding>
				<ListItemButton onClick={handleProfile(alarm)}>
					<Avatar src={alarm.from_nickname ? imageLoader({src: alarm.from_nickname}) : null} />
					<Typography>{alarm.from_nickname}</Typography>
				</ListItemButton>
				<IconButton onClick={acceptInviteGame(alarm)}>
					<CheckCircleOutlineRoundedIcon />
				</IconButton>
				<IconButton onClick={denyRequest(alarm)}>
					<ClearRoundedIcon />
				</IconButton>
			</ListItem>
		</div>
	)
}