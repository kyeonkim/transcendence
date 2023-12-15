import React, { useEffect, useState } from 'react';
import { Avatar, Box, Divider, List, ListItem, ListItemButton, Paper, Popper, Typography } from "@mui/material";
import { useCookies } from "next-client-cookies"
import { axiosToken } from '@/util/token';

export default function UserList(props: any) {
	const { handleDrawerClose, imageLoader, style, pop, setPop, setAnchorEl,
		anchorEl , roominfo, socket, setMTbox} = props;
	const [list, setList] = useState([]);
	const [targetData, setTargetData] = useState<any>(null);
	const [isOwner, setIsOwner] = useState(false);
	const [Creater, setCreater] = useState(0);
	const cookies = useCookies();
	const token = cookies.get("access_token");
	const my_id = cookies.get("user_id");

	useEffect(() => {
		const fetchUserList = async () => {
			await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}chat/roominfo/${roominfo.idx}`, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${cookies.get('access_token')}`
				  },
			})
			.then((res) => {
				const userList = res.data.room.roomusers || [];

				setCreater(res.data.room.owner_id);
				setList(userList);
			})
			.catch((err) => {

			})
		}
		
		fetchUserList();
		socket.on("notice", fetchUserList);

		return () => {
			socket.off("notice", fetchUserList);
		}

	}, []);

	const handlePopup = (event: any, userData: any) => {

		if (anchorEl === event.currentTarget) {
			setPop(!pop);
		} else {
			setAnchorEl(event.currentTarget);
			setPop(true);
		}
		setTargetData(userData);
	};

	const handleMute = async () => {
		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/muteuser`, {
			user_id: Number(my_id),
			room_id: Number(roominfo.idx),
			target_id: Number(targetData.user_id),
			target_nickname: targetData.user_nickname,
		},
		{
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`,
			},
		})
		.then((res) => {
			setPop(false);
		})
	}

	const handleOP = async () => {
		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/setmanager`, {
			user_id: Number(my_id),
			room_id: Number(roominfo.idx),
			target_id: Number(targetData.user_id),
			target_nickname: targetData.user_nickname,
		},
		{
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`,
			},
		})
		.then((res) => {
			setPop(false);
		})
	}

	const handleban = async () => {
		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/banuser`, {
			user_id: Number(my_id),
			room_id: Number(roominfo.idx),
			target_id: Number(targetData.user_id),
			target_nickname: targetData.user_nickname,
		},
		{
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`,
			},
		})
		.then((res) => {
			setPop(false);
		})
	}

	const handleUnOP = async () => {
		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/unsetmanager`, {
			user_id: Number(my_id),
			room_id: Number(roominfo.idx),
			target_id: Number(targetData.user_id),
			target_nickname: targetData.user_nickname,
		},
		{
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`,
			},
		})
		.then((res) => {
			setPop(false);
		})
	}

	const handleKick = async () => {
		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/kickuser`, {
			user_id: Number(my_id),
			room_id: Number(roominfo.idx),
			target_id: Number(targetData.user_id),
			target_nickname: targetData.user_nickname,
		},
		{
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`,
			},
		})
		.then((res) => {
			setPop(false);
		})
	}

	const handleProfile = () => {	
		setMTbox(1, targetData.user_nickname);
	}

	const handleInviteGame = async () => {
		await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}game/inviteroom`, {
			user1_id: Number(my_id),
			user1_nickname: cookies.get("nick_name"),
			user2_id: Number(targetData.user_id),
			user2_nickname: targetData.user_nickname,
		},
		{
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`,
			},
		})
		.then((res) => {

		})
	}
	return (
	<Box
		sx={{ width: '300px' }}
		role="presentation"
		onKeyDown={handleDrawerClose}
	>
		<List>
		<Typography variant="inherit" align="center">
			참여자 목록
		</Typography>
		<Divider />
		{list.map((user: any) => {
			if (user.user_id === Number(my_id))
			{
				if (user.is_manager && !isOwner)
					setIsOwner(true)
				else if (!user.is_manager && isOwner)
					setIsOwner(false)
			}
			return (
				<div key={user.user_id}>
					<ListItemButton onClick={(event) => handlePopup(event, user)}>
					<Avatar src={imageLoader({ src: user.user_nickname })} />
					<ListItem style={{ paddingTop: '1px', marginLeft: '1px', width: '200px' }}>
						<Typography variant="inherit" noWrap>
							{user.user_nickname}
						</Typography>
					</ListItem>
					</ListItemButton>
				<Divider />
				</div>
			);
			})}
		</List>
		<Popper open={pop} anchorEl={anchorEl} placement="left-start" style={{ zIndex: 9999 }}>
		{targetData?.user_id === Number(my_id) ? (
			<List className={style}>
				<Paper elevation={16}>
					<ListItemButton onClick={handleProfile}>
						<Typography variant="inherit">프로필</Typography>
					</ListItemButton>
				</Paper>
			</List>
			) : (
			<List className={style}>
				<Paper elevation={16}>
					<ListItemButton onClick={handleProfile}>
						<Typography variant="inherit">프로필</Typography>
					</ListItemButton>
					<Divider />
					<ListItemButton onClick={handleInviteGame}>
						<Typography variant="inherit">게임초대</Typography>
					</ListItemButton>
					<Divider />
					{Number(my_id) === Creater && !targetData?.is_manager && (
						<>
						<ListItemButton onClick={handleOP}>
							<Typography variant="inherit">권한부여</Typography>
						</ListItemButton>
						<Divider />
						</>
					)}
					{Number(my_id) === Creater && targetData?.is_manager && (
						<>
						<ListItemButton onClick={handleUnOP}>
							<Typography variant="inherit">권한해제</Typography>
						</ListItemButton>
						<Divider />
						</>
					)}
					{isOwner && targetData?.user_id !== Number(my_id) && targetData?.user_id !== Creater && (
					<>
					<ListItemButton onClick={handleMute}>
						<Typography variant="inherit">뮤트</Typography>
					</ListItemButton>	
					<Divider />
					<ListItemButton onClick={handleKick}>
						<Typography variant="inherit">강퇴</Typography>
					</ListItemButton>
					<ListItemButton onClick={handleban}>
						<Typography variant="inherit">밴</Typography>
					</ListItemButton>
					</>
					)}
				</Paper>
			</List>
		)}
		</Popper>
	</Box>
	);
}
