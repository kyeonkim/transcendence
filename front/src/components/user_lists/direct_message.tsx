import { useState, useRef } from 'react';
import React from 'react';

import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';

import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List'
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

import styles from './dm.module.css';

import { useCookies } from 'next-client-cookies';

import { useChatSocket } from "../../app/main_frame/socket_provider"

import DmMessageBlock from './direct_message_block';

export default function DirectMessage( {dmAlarmCount, dmAlarmCountList, dmAlarmRemover, dmOpenId, dmOpenNickname, handleChatTarget, setMTbox, tapref} :any) {
	
	const [message, setMessage] = useState('');
	
	const cookies = useCookies();
	const messageAreaRef = useRef(null);
	const socket = useChatSocket();
	
	// direct message 목록 받아오기

	const user_id = Number(cookies.get('user_id'));

	const handleSendMessage = () => {
		console.log('send message:==== \n', message);
		if (message.trim() === '') {
			return;
		}
		
		const newMessage = {
			from_id: user_id,
			to_id: dmOpenId,
			message: message,
		};
		console.log('message sent! to "dm" - ', newMessage);
		socket.emit("dm", newMessage);
		setMessage('');
	};

	const handleOpen = () => {
		if (dmOpenId === -1)
			return false;
		else
			return true;
	}
	
	return (
		<div>
				<Popper open={handleOpen()} anchorEl={tapref.current} placement="right-start" style={{width: '500px'}}>
					<AppBar position="static">
						<Typography variant="h5" sx={{ flexGrow: 1, align: 'center', padding: '10px' }}>
							{dmOpenNickname}
						</Typography>
					</AppBar>
					<Grid container component={Paper}>
						<List className={styles.messageArea} ref={messageAreaRef}>
							<DmMessageBlock
								dmOpenId={dmOpenId}
								dmOpenNickname={dmOpenNickname}
								messageAreaRef={messageAreaRef}
								socket={socket}
								setMTbox={setMTbox}
								scrollref={messageAreaRef}
							/>
						</List>
						<Divider />
						<Grid container style={{ padding: "20px" }}>
							<Grid item xs={11}>
								<TextField
									id="direct-message-input-block"
									label="Input message"
									fullWidth 
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									inputProps={{ maxLength: 50 }}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											if (e.nativeEvent.isComposing) return;
											handleSendMessage();
										}}}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Popper>
		</div>
	);
}
  