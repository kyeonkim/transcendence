import React, { useEffect, useState } from 'react';
import { Avatar, Box, Divider, List, ListItem, ListItemButton, Paper, Popper, Typography } from "@mui/material";
import axios from "axios";
import { useCookies } from "next-client-cookies"

export default function UserList(props: any) {
	const { handleDrawerClose, imageLoader, style, pop, setPop, setAnchorEl,
		anchorEl , roominfo, socket, setMTbox} = props;
	const [list, setList] = useState([]);
	const [targetData, setTargetData] = useState<any>(null);
	const [isOwner, setIsOwner] = useState(false);
	const cookies = useCookies();
	const token = cookies.get("access_token");
	const my_id = cookies.get("user_id");

	
	useEffect(() => {
		const fetchUserList = async () => {
			await axios.get(`${process.env.NEXT_PUBLIC_API_URL}chat/roominfo/${roominfo.idx}`)
			.then((res) => {
				const userList = res.data.room.roomusers || [];
				setList(userList);
			})
			.catch((err) => {
				console.error("Error fetching user list:", err);
			})
		}
		
		fetchUserList();
		socket.on("notice", fetchUserList);
	}, []);

	const handlePopup = (event: any, userData: any) => {
	console.log("in pop<", userData);
	if (anchorEl === event.currentTarget) {
		setPop(!pop);
	} else {
		setAnchorEl(event.currentTarget);
		setPop(true);
	}
	setTargetData(userData);
	};

	const handleMute = async () => {
	await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/muteuser`, {
		user_id: Number(my_id),
		room_id: Number(roominfo.idx),
		target_id: Number(targetData.user_id),
		target_nickname: targetData.user_nickname,
	},
	{
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	)
	}

	const handleOP = async () => {
	await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/setmanager`, {
		user_id: Number(my_id),
		room_id: Number(roominfo.idx),
		target_id: Number(targetData.user_id),
		target_nickname: targetData.user_nickname,
		},
		{
			headers: {
			Authorization: `Bearer ${token}`,
			},
		}
		)
	}

	const handleKick = async () => {
	await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/kickuser`, {
		user_id: Number(my_id),
		room_id: Number(roominfo.idx),
		target_id: Number(targetData.user_id),
		target_nickname: targetData.user_nickname,
		},
		{
			headers: {
			Authorization: `Bearer ${token}`,
			},
		}
		)
	}

	const handleProfile = () => {	
		setMTbox(1, targetData.user_nickname);
	}

	console.log("userlist", list);
	console.log("my", my_id);
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
					<ListItemButton>
						<Typography variant="inherit">프로필</Typography>
					</ListItemButton>
					<Divider />
					<ListItemButton>
						<Typography variant="inherit">게임초대</Typography>
					</ListItemButton>
					<Divider />
					{isOwner && targetData?.user_id !== Number(my_id) && (
					<>
					<ListItemButton onClick={handleOP}>
						<Typography variant="inherit">권한부여</Typography>
					</ListItemButton>
					<Divider />
					<ListItemButton onClick={handleMute}>
						<Typography variant="inherit">뮤트</Typography>
					</ListItemButton>	
					<Divider />
					<ListItemButton onClick={handleKick}>
						<Typography variant="inherit">강퇴</Typography>
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
