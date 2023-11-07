import React, { useCallback } from "react";
import { Grid, ListItem, Stack, Chip, Typography, Avatar } from "@mui/material";

const TextSend = (props:any) => {
	const { setMTbox, message, my_name } = props;

	const imageLoader = useCallback(({ src }: any) => {
		return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
	}, []);

	const handleClick = useCallback((from: string) => {
		setMTbox(1, from);
	}, []);

	return (
	  <Grid container>
		<ListItem key={message.from} style={{padding: '5px', paddingBottom: '0px', textAlign: message.from === my_name ? 'right' : 'left' }}>
		  <Stack direction="row" spacing={1}>
			<Chip
			  avatar={<Avatar src={imageLoader({src: message.from})}/>}
			  label={message.from}
			  onClick={() => handleClick(message.from)}
			  component='div'
			/>
		  </Stack>
		</ListItem>
		<ListItem style={{paddingTop: '1px', marginLeft: '15px', textAlign: message.from === my_name ? 'right' : 'left' }}>
		  <Typography>{`${message.message}`}</Typography>
		</ListItem>
	  </Grid>
	);
  };

export default TextSend;
