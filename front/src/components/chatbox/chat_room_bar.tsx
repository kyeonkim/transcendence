'use client'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function ChatRoomBar(props: any) {

    const { handleRenderMode } = props;

    function handleNewChat() {
        handleRenderMode('newChat');    
    };

	return (
		<AppBar position='absolute' sx={{borderRadius: '10px', width: '100%'}}>
			<Toolbar>
				<Typography sx={{flexGrow: 1, color: 'white', fontSize: '1vw'}} component="div">
					채팅방 목록
				</Typography>
				<Button
					sx={{
					position: "sticky",
					left: "65%",
					height: "60%",
					background: "white",
					color: "black"	
					}} 
					variant='contained'
					onClick={handleNewChat}
				>
					<Typography sx={{color: 'black', fontSize: '0.7vw'}}>
						NEW 
					</Typography>
				</Button>
			</Toolbar>
		</AppBar>
	);
}
