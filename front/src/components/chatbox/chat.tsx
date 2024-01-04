import React, { useState, useRef, useEffect ,useCallback} from 'react';
import { useChatSocket } from "../../app/main_frame/socket_provider"
import { useUserDataContext } from '@/app/main_frame/user_data_context';
import { useCookies } from 'next-client-cookies'
import {Paper, Grid, Box, Divider, TextField, Typography, List,	IconButton, Popper,
		AppBar, Toolbar, Drawer, Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemButton} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SettingsIcon from '@mui/icons-material/Settings';

import styles from './chat.module.css';
import TextSend from './text_send';
import UserList from './chat_user_list';
import ChatModal from './chat_modal';
import { axiosToken } from '@/util/token';
import Marquee from 'react-fast-marquee';

export default function Chat(props: any) {
	const messageAreaRef = useRef(null);
	
	const [chatname, setChatname] = useState('');
	const [roomMode, setRoomMode] = useState(false);

	const [message, setMessage] = useState('');
	const [drawer, setDrawer] = useState(false);
	const [pop, setPop] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [setingOpen, setSetingOpen] = useState(false);
	const [inviteTarget, setInviteTarget] = useState('');
	const [open, setOpen] = useState(false);
    const [errMessage, setErrMessage] = useState('');

	const [modalCondition, setModalCodition] = useState('');
	const [modalOpen, setModalOpen] = useState(false);

	const { handleRenderMode, roominfo } = props;
	
	const socket = useChatSocket();
	const { nickname, user_id } = useUserDataContext();
	const cookies = useCookies();
	
	const my_name = nickname;
	const my_id = user_id;

	useEffect (() => {
		const handleKick = (data :any) => {
			handleRenderMode('chatList');
		};

		const doRenderChatRooms = (data :any) => {
			// console.log("get socket", data);
			if (data.data.idx === roominfo.idx) {
				if (data.data.name)
					setChatname(data.data.name);
				if (data.data.is_private)
					setRoomMode(data.data.is_private);
			}
		}

		socket.on('render-chat', doRenderChatRooms)
		socket.on("kick", handleKick);


		return () => {

			socket.off("kick", handleKick);
			socket.off('render-chat', doRenderChatRooms);
		}

	}, [socket]);

	useEffect(() => {
		setChatname(roominfo.name);
		setRoomMode(roominfo.is_private);
	}, [props.roominfo]);

	const handleSendMessage = () => {

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
	const handleSetting = () => setSetingOpen(true);
	const handleSettingClose = () => setSetingOpen(false);
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

			if (res.data.status)
				setDialogOpen(false);
			else
				setErrMessage(res.data.message);
		})
		.catch((err) => {

		})
	}

	const handleChatModalCondition = (type :string) => {
		
		if (type === 'change password')
			setModalCodition('change password');
		else if (type === 'change name')
			setModalCodition('change name');
		else if (type === 'change visibility')
			setModalCodition('change visibility');
		setModalOpen(true);
	};

	const imageLoader = (({ src }: any) => {
		return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
	});

	const actions = [
		{ icon: <SettingsIcon />, name: 'Setting'},
		{ icon: <SendIcon />, name: 'Invite'}
	];

	return (
		<div>
			<AppBar position="absolute" sx={{borderRadius: '10px', height: '64px'}}>
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
				<Marquee>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 ,align: 'center', color: 'white', fontSize: '1vw'}}>
						{chatname}
					</Typography>
				</Marquee>
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
				/>
			</Drawer>
			<Grid container component={Paper} sx={{
				position: 'absolute',
				// top: '5.4%',
				top: '64px',
				height: '95.5%',
				borderRadius: '10px',
				maxWidth: '100%'}}>
				<List className={styles.messageArea} ref={messageAreaRef}>
					<TextSend
						my_name={my_name}
						socket={socket}
						scrollref={messageAreaRef}
					/>
				</List>
			</Grid>
				<Grid item style={{ padding: "20px" }}>
						<TextField
							sx={{
								position: 'absolute',
								bottom: 20,
								right: '15%',
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
									onClick={action.name === 'Invite' ? handleInvite : handleSetting}
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
			<ChatModal
				modalOpen={modalOpen}
				setModalOpen={setModalOpen}
				modalCondition={modalCondition}
				my_id={my_id}
				my_name={my_name}
				roominfo={roominfo}
				chatname={chatname}
				setChatname={setChatname}
				roomMode={roomMode}
				setRoomMode={setRoomMode}
			/>
			<Dialog
				open={setingOpen}
				BackdropProps={{
					onClick: handleSettingClose,
				  }}
				sx={{marginLeft: '76%'}}>
			<DialogTitle>Setting</DialogTitle>
				<DialogActions>
					<List>
						<ListItemButton onClick={() => handleChatModalCondition('change name')}>
							<Typography>Change Name</Typography>
						</ListItemButton>
						<Divider />
						<ListItemButton onClick={() => handleChatModalCondition('change password')}>
							<Typography>Set PassWord</Typography>
						</ListItemButton>
						<Divider />
						<ListItemButton onClick={() => handleChatModalCondition('change visibility')}>
							<Typography>Set Private</Typography>
						</ListItemButton>
						<Divider />
						<Button onClick={handleSettingClose} sx={{alignItems: "center"}}>Cancel</Button>
					</List>
				</DialogActions>
			</Dialog>
		</div>
	);
};