import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useWebSocket } from "../../app/main_frame/socket_provider"
import { useCookies } from 'next-client-cookies';
import {Paper, Grid, Box, Divider, TextField, Typography, List, ListItem, ListItemButton, Avatar, Fab,
	Chip, Stack, IconButton, AppBar, Toolbar, Drawer, Popper} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Button from '@mui/material/Button';
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import TextSend from './text_send';

import styles from './chat.module.css';

export default function Chat(props: any) {
	const messageAreaRef = useRef(null);
	const [message, setMessage] = useState('');
	const [chatMessages, setChatMessages] = useState([]);
	const [drawer, setDrawer] = useState(false);
	const cookies = useCookies();
	const [pop, setPop] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [messageCount, setMessageCount] = useState(0);
	const [chatRestricted, setChatRestricted] = useState(false);
	// const socket = useWebSocket();
	const { setMTbox } = props;
	// const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null);

	const my_name = cookies.get('nick_name');
	const my_id = cookies.get('user_id');

	const handleSendMessage = () => {
		if (chatRestricted) {
			console.log('chat restricted, Please wait 5 seconds');
			return;
		}
		setMessageCount((prevCount) => prevCount + 1);
		if (messageCount >= 5) {
			console.log('chat restricted, Please wait 5 seconds');
			setChatRestricted(true);
			setTimeout(() => {
				setChatRestricted(false);
				setMessageCount(0);
			}, 5000);
		}
		console.log('send message:==== \n', message);
		if (message.trim() === '') {
			return;
		} else {
			setTimeout(() => {
				setMessageCount((prevCount) => Math.max(0, prevCount - 1));	
			}, 2000);
		}
		
		const newMassage = {
			from: my_id,
			user_name: my_name,
			room_id: /*채널이름 or nickname*/"3",
			message: message,
		};
		// socket.emit("chat", newMassage);

		setChatMessages(prevChatMessages => [...prevChatMessages, { from: my_name, message: message }]);
		setMessage('');
		moveScoll();
	};

	// useEffect(() => {
	// 	socket.on("chat", (data) => {
	// 		console.log('chat:==== \n', data);
	// 		setChatMessages(prevChatMessages => [...prevChatMessages, data]);
	// 		moveScoll();
	// 	});
	// }, []);
	
	//useCallback한이유 : 같은 동작의 함수가 계속 생성되는 것을 방지하기 위한건데 큰의미는 없을거같음
	// -> 성능 최적화가되나 메모리사용량은 늘어남 
	const moveScoll = useCallback(() => {
		if (messageAreaRef.current) {
			messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
		}
	}, []);

	const handleDrawer = useCallback(() => {
		setDrawer(true);
	}, []);

	const handleDrawerClose = useCallback(() => {
		setDrawer(false);
		setPop(false);
	}, []);

	const handlePopup = useCallback((event: any) => {
		if (anchorEl === event.currentTarget) {
			setPop(!pop);
		} else {
			setAnchorEl(event.currentTarget);
			setPop(true);
		}
		}, [anchorEl, pop]);

	const imageLoader = useCallback(({ src }: any) => {
		return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
	}, []);

	const sampleList = [
		{user_id: 1, nick_name: 'min22323223232323232323232323232323232223232232323232232'},
		{user_id: 2, nick_name: 'kyeonkim'},
		{user_id: 3, nick_name: 'kshim'},
	]
	const isOwner = true;

	//Drawer가 켜질때 보이는 내용
	const userList = () => (
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
				{sampleList.map((user) => (
					<div key={user.user_id}>
						<ListItem disablePadding>
						<ListItemButton onClick={handlePopup}>
							<Avatar src={imageLoader({src: user.nick_name})}/>
							<ListItem style={{paddingTop: '1px', marginLeft: '1px', width: '200px'}}>
							<Typography variant="inherit" noWrap>
								{user.nick_name}
							</Typography>
							</ListItem>
						</ListItemButton>
						</ListItem>
						<Divider />
					</div>
				))}
			</List>
			<Popper open={pop} anchorEl={anchorEl} placement="left-start" style={{zIndex: 9999}}>
					<List className={styles.userList}>
						<Paper elevation={16}>
							<ListItemButton>
								<Typography variant="inherit">프로필</Typography>
							</ListItemButton>
							<Divider />
							<ListItemButton>
								<Typography variant="inherit">친구추가</Typography>
							</ListItemButton>
							<Divider />
							<ListItemButton>
								<Typography variant="inherit">차단</Typography>
							</ListItemButton>
							</Paper>
						</List>
							{isOwner ? (
								<List>
									<Paper elevation={16}>
										<Typography variant="inherit"></Typography>
									<ListItemButton>
										<Typography variant="inherit">권한부여</Typography>
									</ListItemButton>
									<Divider />
									<ListItemButton>
										<Typography variant="inherit">뮤트</Typography>
									</ListItemButton>
									<Divider />
									<ListItemButton>
										<Typography variant="inherit">강퇴</Typography>
									</ListItemButton>
									</Paper>
								</List>
							) : null
							}
			</Popper>
		</Box>
	)

	return (
		<div>
			<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="close"
					sx={{ mr: 2 }}
					onClick={handleDrawer}
				>
					<CloseIcon />
				</IconButton>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 ,align: 'center' }}>
					ChatRoom1
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
			</Box>
			<Drawer anchor='right' open={drawer} onClose={handleDrawerClose}>
				<IconButton edge="start"onClick={handleDrawerClose}>
					<ChevronRightIcon />
				</IconButton>
				{userList()}
			</Drawer>
			<Grid container component={Paper}>
				<Grid item xs={12} className={styles.borderRight500}>
					<List className={styles.messageArea} ref={messageAreaRef}>
						{chatMessages.map((message, index) => (
							<TextSend
								key={index}
								message={message}
								my_name={my_name}
								setMTbox={setMTbox}
								image={imageLoader({src: message.from})}
							/>
						))}
					</List>
					<Divider />
					<Grid container style={{ padding: "20px" }}>
						<Grid item xs={11}>
							<TextField
								id="outlined-basic-email"
								label="Input message"
								fullWidth 
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										handleSendMessage();
									}}}
							/>
						</Grid>
						<Grid item xs={1}>
							<Fab color="primary" aria-label="add" onClick={handleSendMessage}>
								<SendIcon />
							</Fab>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};