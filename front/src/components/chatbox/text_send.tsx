import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Grid, ListItem, Stack, Chip, Typography, Avatar } from "@mui/material";
import { render } from 'react-dom';

const TextSend = ({ my_name, socket, setMTbox, scrollref}: any) => {
	const [renderedMessages, setRenderedMessages] = useState([]);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const handleChat = (data: any) => {
			const newMessage = renderMessage(data);
			setRenderedMessages(prevMessages => [...prevMessages, newMessage]);

		};

		const handleNotice = (data: any) => {
			const newMessage = rednerNotice(data);
			setRenderedMessages(prevMessages => [...prevMessages, newMessage]);
		};


		socket.on("chat", handleChat);
		socket.on("notice", handleNotice);

		return () => {
			socket.off("chat", handleChat);
			socket.off("notice", handleNotice);
		}
	}, [socket]);

	useLayoutEffect(() => {
		moveScroll();
	}, [renderedMessages]);

	const moveScroll = () => {
		if (scrollref.current) {
			scrollref.current.scrollTop = scrollref.current.scrollHeight;
		}
	};

	const imageLoader = useCallback(({ src }: any) => {
		return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
	}, []);

	const handleClick = (name: any) => {
		setMTbox(1, name);
	};
	
	const rednerNotice = (message: any) => {
		return (
		<Grid container key={message.time}>
			<ListItem style={{ padding: '5px', display: 'flex', justifyContent: 'center' }}>
				<Stack direction="row" spacing={1}>
					<Chip
						label={message.message}
						sx={{
							maxWidth: '100%',
							textAlign: 'center',
							whiteSpace: 'break-spaces',
						}}
					/>
				</Stack>
			</ListItem>
		</Grid>
		)
	}

	const renderMessage = (message: any) => {
		return (
			<Grid container key={message.time}>
				<ListItem style={{ padding: '5px', paddingBottom: '0px', marginLeft: message.from === my_name? '80%' : '0px'}}>
					<Stack direction="row" spacing={1}>
						<Chip
							avatar={<Avatar src={imageLoader({src: message.from})} />}
							label={message.from}
							component='div'
							onClick={() => handleClick(message.from)}
						/>
					</Stack>
				</ListItem>
				<ListItem
					style={{
						display: 'flex',
						justifyContent: message.from === my_name ? 'flex-end' : 'flex-start',
						paddingRight: message.from === my_name ? '25px' : '0px',
						wordBreak: 'break-word',
					}}
				>
					<Typography style={{ overflowWrap: 'break-word' }}>
						{`${message.message}`}
					</Typography>
				</ListItem>
			</Grid>
		);
	};

	return (
		<div style={{ overflowX: 'hidden' }}>
			{renderedMessages}
		</div>
	);
};

export default TextSend;
