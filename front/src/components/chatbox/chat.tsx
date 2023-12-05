import React, { useState, useRef, useEffect ,useCallback} from 'react';
import { useChatSocket } from "../../app/main_frame/socket_provider"
import { useCookies } from 'next-client-cookies';
import {Paper, Grid, Box, Divider, TextField, Typography, List,	IconButton, 
		AppBar, Toolbar, Drawer, Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import styles from './chat.module.css';
import TextSend from './text_send';
import UserList from './chat_user_list';
import { axiosToken } from '@/util/token';

export default function Chat(props: any) {
	const messageAreaRef = useRef(null);
	const [message, setMessage] = useState('');
	const [drawer, setDrawer] = useState(false);
	const [pop, setPop] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [inviteTarget, setInviteTarget] = useState('');
	const [open, setOpen] = useState(false);

	const { setMTbox, handleRenderMode, roominfo } = props;
	const socket = useChatSocket();
	const cookies = useCookies();
	
	const my_name = cookies.get('nick_name');
	const my_id = Number(cookies.get('user_id'));
	
	useEffect (() => {
		const handleKick = (data :any) => {
			handleRenderMode('chatList');
		};
		socket.on("kick", handleKick);
	}, []);

	const handleSendMessage = () => {
		console.log('send message:==== \n', message);
		if (message.trim() === '') {
			return;
		}
		
		const newMessage = {
			from: my_id,
			user_name: my_name,
			room_id: Number(roominfo.idx),
			message: message,
		};
		socket.emit("chat", newMessage);
		setMessage('');
	};

	const handleDrawer = useCallback(() => {
		setDrawer(true);
	}, []);

	const handleDrawerClose = useCallback(() => {
		setDrawer(false);
		setPop(false);
	}, []);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const handleInvite = () => setDialogOpen(true);
	const handledialogClose = () => setDialogOpen(false);
	const handleInvitetarget = (e :any) => setInviteTarget(e.target.value);

	const handleExit = async () => {
		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/leaveroom`, {
			user_id: my_id,
			user_nickname: my_name,
			room_id: Number(roominfo.idx),
		},
		{
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`,
				},
		})
		.then((res) => {
			handleRenderMode('chatList');
		})	
	};
	
	const handleSendInvite = async() => {
		await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}chat/inviteuser`, {
			type: 'invite_chat',
			to: inviteTarget,
			from: my_name,
			chatroom_id: Number(roominfo.idx),
			chatroom_name: roominfo.name,
		},
		{
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cookies.get('access_token')}`
			  },
		})
		.then((res) => {
			console.log('invite success');
			setDialogOpen(false);
		})
		.catch((err) => {
			console.log('invite fail');
			console.log(err);
		})
	}


	const imageLoader = (({ src }: any) => {
		return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
	});

	const actions = [
		{ icon: <SendIcon />, name: 'Invite' },
	  ];
	return (
		<div>
			<AppBar position="absolute" sx={{borderRadius: '10px'}}>
				<Toolbar>
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="close"
					sx={{ mr: 2 }}
					onClick={handleExit}	
				>
					<CloseIcon />
				</IconButton>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 ,align: 'center' }}>
					{roominfo.name}
				</Typography>
				<IconButton
					size="large"
					edge="end"
					color="inherit"
					aria-label="menu"
					sx={{ mr: 2 }}
					onClick={handleDrawer}
				>
					<MenuIcon />
				</IconButton>
				</Toolbar>
			</AppBar>
			<Drawer anchor='right' open={drawer} onClose={handleDrawerClose}>
				<IconButton edge="start"onClick={handleDrawerClose}>
					<ChevronRightIcon />
				</IconButton>
				<UserList
					handle={handleDrawerClose}
					imageLoader={imageLoader}
					setPop={setPop}
					setAnchorEl={setAnchorEl}
					styles={styles.userList}
					pop={pop}
					anchorEl={anchorEl}
					roominfo={roominfo}
					my_id={my_id}
					socket={socket}
					setMTbox={setMTbox}
				/>
			</Drawer>
			<Grid container component={Paper} sx={{
				position: 'absolute',
				top: '5.4%',
				height: '95%',
				borderRadius: '10px',
				maxWidth: '100%'}}>
				<List className={styles.messageArea} ref={messageAreaRef}>
					<TextSend
						my_name={my_name}
						socket={socket}
						setMTbox={setMTbox}
						scrollref={messageAreaRef}
					/>
				</List>
			</Grid>
				<Grid item style={{ padding: "20px" }}>
						<TextField
							sx={{
								position: 'absolute',
								bottom: 20,
								right: 70,
								width: '80%',

							}}
							id="outlined-basic-email"
							label="Input message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							inputProps={{ maxLength: 50 }}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									if (e.nativeEvent.isComposing) return;
									handleSendMessage();
								}}}
						/>
					<Grid item xs={1}>
						<SpeedDial
							ariaLabel="SpeedDial controlled open example"
							sx={{ position: 'absolute', bottom: 20, right: 5 }}
							icon={<SpeedDialIcon />}
							onClose={handleClose}
							onOpen={handleOpen}
							open={open}
						>
							{actions.map((action) => (
							<SpeedDialAction
								key={action.name}
								icon={action.icon}
								tooltipTitle={action.name}
								onClick={handleInvite}
							/>
							))}
						</SpeedDial>
					</Grid>
			</Grid>
			<Dialog
				open={dialogOpen}
				BackdropProps={{
					onClick: handledialogClose,
				  }}
				sx={{marginLeft: '76%'}}>
			<DialogTitle>Invite</DialogTitle>
				<DialogContent>
				<DialogContentText>
					Invite user to this chatroom
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="User Name"
					type="name"
					fullWidth
					variant="standard"
					onChange={handleInvitetarget}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							handleSendInvite();
						}}}
				/>
				</DialogContent>
				<DialogActions>
				<Button onClick={handledialogClose}>Cancel</Button>
				<Button onClick={handleSendInvite}>Invite</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};