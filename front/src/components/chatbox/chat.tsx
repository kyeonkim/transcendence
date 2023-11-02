import { styled } from '@mui/material/styles';
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
import MuiDrawer from '@mui/material/Drawer';
import Drawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const PREFIX = 'chat';
const classes = {
		table: `${PREFIX}-table`,
		chatSection: `${PREFIX}-chatSection`,
		headBG: `${PREFIX}-headBG`,
		borderRight500: `${PREFIX}-borderRight500`,
		messageArea: `${PREFIX}-messageArea`,
}
const Root = styled('div') ({
		[`& .${classes.table}`]: {
				minWidth: 650
		},
		[`& .${classes.chatSection}`]: {
				width: "100px",
				height: "40vh"
		},
		[`& .${classes.headBG}`]: {
				backgroundColor: "#e0e0e0"
		},
		[`& .${classes.borderRight500}`]: {
				borderRight: "1px solid #e0e0e0"
		},
		[`& .${classes.messageArea}`]: {
				width: "550px",
				height: "1170px",
				overflowY: "auto"
		},
});

export default function Chat(props: any) {
	const messageAreaRef = useRef(null);
	const [message, setMessage] = useState('');
	const [chatMessages, setChatMessages] = useState([]);
	const [drawer, setDrawer] = useState(false);
	const cookies = useCookies();
	// const socket = useWebSocket();
	const { setMTbox } = props;

	const my_name = cookies.get('nick_name');
	const my_id = cookies.get('user_id');

	const handleSendMessage = () => {
		if (message.trim() === '') {
			return;
		}
		setChatMessages(prevChatMessages => [...prevChatMessages, { sender: my_name, message: message }]);

		// const newMassage = {
		// 	from: my_id,
		// 	to: /*채널이름 or nickname*/"chatroom1",
		// 	user_name: my_name,
		// 	message: message,
		// };
		// socket.emit("events", socket);
		// console.log('chat:==== ', socket);

		setMessage('');
	};

	// useEffect(() => {
	// 	socket.on("chat", (data) => {
	// 		console.log('chat:==== ', data.data);
	// 		setChatMessages(prevChatMessages => [...prevChatMessages, {sender: "ters", message: data}]);
	// 	});
	// }, []);

	useEffect(() => {
		if (messageAreaRef.current) {
			messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
		}
	}, [chatMessages]);

	const handleClick = (sender: string) => {setMTbox(1, sender)};
	const handleDrawer = () => {setDrawer(true)};
	const handleDrawerClose = () => {setDrawer(false)};

	const imageLoader = ({ src }: any) => {
		return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
	}


	return (
		<Root>
			<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="menu"
					sx={{ mr: 2 }}
					onClick={handleDrawer}
				>
					<MenuIcon />
				</IconButton>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					ChatRoom1
				</Typography>
				<Button color="inherit">나가기</Button>
				</Toolbar>
			</AppBar>
			</Box>
			<Drawer
				variant="persistent"
				open={drawer}
				sx={{
				width: 240,
				flexShrink: 0,
				position: 'absolute',
				}}
			>
				<IconButton onClick={handleDrawerClose}>
					<ChevronLeftIcon />
				</IconButton>
      		</Drawer>
			<Grid container component={Paper}>
				<Grid item xs={12} className={classes.borderRight500}>
					<List className={classes.messageArea} ref={messageAreaRef}>
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
		</Root>
	);
};