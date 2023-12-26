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
import CloseIcon from '@mui/icons-material/Close';
import styles from './dm.module.css';
import { IconButton, Toolbar } from "@mui/material";

import { useChatSocket } from "../../app/main_frame/socket_provider";
import { useUserDataContext } from '@/app/main_frame/user_data_context';

import DmMessageBlock from './direct_message_block';

export default function DirectMessage( {dmAlarmCount, dmAlarmCountList, dmAlarmRemover, dmOpenId, dmOpenNickname, handleChatTarget, tapref} :any) {
	
	const [message, setMessage] = useState('');
	
	const messageAreaRef = useRef(null);
	const socket = useChatSocket();
	const { user_id, nickname } = useUserDataContext();

	// const tapref = useRef(null);

	const handleSendMessage = () => {
		if (message.trim() === '') {
			return;
		}
		
		const newMessage = {
			from_id: user_id,
			to_id: dmOpenId,
			message: message,
		};
		socket.emit("dm", newMessage);
		setMessage('');
	};

	const handleOpen = () => {

		if (dmOpenId === -1)
			return false;
		else
			return true;
	}
	
	const handleExit = () => {
		handleChatTarget(dmOpenId, dmOpenNickname);
	}

	return (
		<div>
				<Popper open={handleOpen()}
					anchorEl={tapref.current}
					placement="right-start"
					sx={{
						position: 'absolute',
						maxWidth: 'min-content'
						
					}}
					>
					<AppBar position="static">
						<Toolbar>
							<Typography variant="h5" sx={{ flexGrow: 1, align: 'center', padding: '10px', fontSize: '1vw'}}>
								{dmOpenNickname}
							</Typography>
							<IconButton
								size="large"
								edge="end"
								color="inherit"
								aria-label="close"
								onClick={handleExit}	
							>
								<CloseIcon />
							</IconButton>
						</Toolbar>
					</AppBar>
					<Grid container component={Paper}>
						<List className={styles.messageArea} ref={messageAreaRef}>
							<DmMessageBlock
								dmOpenId={dmOpenId}
								dmOpenNickname={dmOpenNickname}
								messageAreaRef={messageAreaRef}
								socket={socket}
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
									inputProps={{ maxLength: 100 }}
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
  