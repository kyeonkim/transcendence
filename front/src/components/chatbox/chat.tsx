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
				height: "50vh"
		},
		[`& .${classes.headBG}`]: {
				backgroundColor: "#e0e0e0"
		},
		[`& .${classes.borderRight500}`]: {
				borderRight: "1px solid #e0e0e0"
		},
		[`& .${classes.messageArea}`]: {
				width: "550px",
				height: "1193px",
				overflowY: "auto"
		},
});

const Chat = () => {
	const messageAreaRef = useRef(null);
	const [message, setMessage] = useState('');
	const [chatMessages, setChatMessages] = useState([
				{ sender: "김도배", message: "  __   _\r\n /  \\_( )_\n|   / o o \\\n|  |   ^   |\n \\  \\_____/\n   |_____|" },
				{ sender: "민", message: "아 차단마렵네" },
				{ sender: "조커", message: "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ" },
				{ sender: "김도배", message: "도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제 도배 드가제" }
		]);

	const handleSendMessage = () => {
		if (message.trim() === '') {
			return;
		}
		setChatMessages(prevChatMessages => [...prevChatMessages, { sender: 'You', message: message }]);

		// const newMessage = {
		// 	sender: 'You',
		// 	message: message
		// };

		// Socket.send(newMessage);
		setMessage('');
	};

	useEffect(() => {
		if (messageAreaRef.current) {
			messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
		}
	}, [chatMessages]);

	return (
		<Root>
			<Grid container component={Paper}>
				<Grid item xs={12}>
					<Typography variant="h4" className="header-message" align='center'>
						Chatroom Name
					</Typography>
					<Divider />
				</Grid>
				<Grid item xs={12} className={classes.borderRight500}>
					<List className={classes.messageArea} ref={messageAreaRef}>
						{chatMessages.map((message) => (
							<Grid container>
									<ListItem key={message.sender} style={{padding: '5px', paddingBottom: '0px'}}>
										<Chip avatar={<Avatar>M</Avatar>} label={`${message.sender}`}/>
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
						<Grid xs={1}>
							<Fab color="primary" aria-label="add" onClick={handleSendMessage}>
								<SendIcon />
							</Fab>
						</Grid>
					</Grid>
				</Grid>
				{/* Add a user list or other components on the right side */}
			</Grid>
		</Root>
	);
};

export default Chat;