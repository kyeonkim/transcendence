import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";	
import Typography from '@mui/material/Typography';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";
import Chip from '@mui/material/Chip';
import React, { useState, useRef, useEffect } from 'react';
import { useWebSocket } from "../../app/main_frame/socket_provider"
import { useCookies } from 'next-client-cookies';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from './chat.module.css';
import CloseIcon from '@mui/icons-material/Close';
import ListItemButton from '@mui/material/ListItemButton';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import zIndex from "@mui/material/styles/zIndex";

export default function Chat(props: any) {
	const messageAreaRef = useRef(null);
	const [message, setMessage] = useState('');
	const [chatMessages, setChatMessages] = useState([]);
	const [drawer, setDrawer] = useState(false);
	const cookies = useCookies();
	const [pop, setPop] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null);
	const socket = useWebSocket();
	const { setMTbox } = props;


	const my_name = cookies.get('nick_name');
	const my_id = cookies.get('user_id');

	const handleSendMessage = () => {
		if (message.trim() === '') {
			return;
		}
		// setChatMessages(prevChatMessages => [...prevChatMessages, { sender: my_name, message: message }]);

		const newMassage = {
			from: my_id,
			to: /*채널이름 or nickname*/"chatroom1",
			user_name: my_name,
			message: message,
		};
		socket.emit("events", socket);
		console.log('chat:==== ', socket);

		setMessage('');
	};

	useEffect(() => {
		socket.on("chat", (data) => {
			console.log('chat:==== ', data.data);
			setChatMessages(prevChatMessages => [...prevChatMessages, {sender: "ters", message: data}]);
		});
	}, []);

	useEffect(() => {
		if (messageAreaRef.current) {
			messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
		}
	}, [chatMessages]);

	const handleClick = (sender: string) => {setMTbox(1, sender)};
	const handleDrawer = () => {setDrawer(true)};
	const handlePopup = (event: any) => {
		if (anchorEl === event.currentTarget) {
			setPop(!pop)
		}
		else {
			setAnchorEl(event.currentTarget);
			setPop(true)
		}
	}
	const handleDrawerClose = () => {
		setDrawer(false)
		setPop(false);
	};

	const imageLoader = ({ src }: any) => {
		return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
	}

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
						{chatMessages.map((message) => (
							<Grid container>
									<ListItem key={message.sender} style={{padding: '5px', paddingBottom: '0px'}}>
										<Stack direction="row" spacing={1}>
										<Chip
											avatar={<Avatar src={imageLoader({src: message.sender})}/>}
											label={message.sender}
											onClick={() => handleClick(message.sender)}
											component='div'
										/>
										</Stack>
									</ListItem>
									<ListItem style={{paddingTop: '1px', marginLeft: '15px'}}>
										<ListItemText primary={`${message.message}`}></ListItemText>
									</ListItem>
							</Grid>
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