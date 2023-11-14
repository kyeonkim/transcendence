import React, { useCallback, useEffect, useState } from "react";
import { useWebSocket } from "../../app/main_frame/socket_provider"
import { Grid, ListItem, Stack, Chip, Typography, Avatar } from "@mui/material";

const TextSend = (props:any) => {
	const { setMTbox, imageLoader} = props;
	const [message, setChatMessages] = useState([]);
	const socket = useWebSocket();

	const handleClick = useCallback((from: string) => {
		setMTbox(1, from);
	}, []);
	const my_name = "min";

	useEffect(() => {
		socket.on("chat", (data) => {
			console.log('chat:==== \n', data);
			setChatMessages(prevChatMessages => [...prevChatMessages, data]);
			// moveScoll();
		});
	}, []);

	// const moveScoll = useCallback(() => {
	// 	if (messageAreaRef.current) {
	// 		messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
	// 	}
	// }, []);

	console.log("text_send render: ");
	useEffect(() => {
		return () => {
			message.map((message: any) => {
				<Grid container>
					<ListItem style={{padding: '5px', paddingBottom: '0px', textAlign: message.from === my_name ? 'right' : 'left' }}>
					<Stack direction="row" spacing={1}>
						<Chip
						// avatar={<Avatar src={imageLoader(message.from)}/>}
						label={message.from}
						// onClick={() => handleClick(message.from)}
						component='div'
						/>
					</Stack>
					</ListItem>
					<ListItem style={{paddingTop: '1px', marginLeft: '15px', textAlign: message.from === my_name ? 'right' : 'left' }}>
					<Typography>{`${message.message}`}</Typography>
					</ListItem>
				</Grid>
			})
		};
	}, [message]);
  };

export default TextSend;
