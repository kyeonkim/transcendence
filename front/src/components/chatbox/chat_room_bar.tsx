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
				<Typography sx={{flexGrow: 1, color: 'white'}}variant="h6" component="div">
					채팅방 목록
				</Typography>
				<Button sx={{ background: "white", color: "black"}} variant='contained' onClick={handleNewChat}>
					새 채팅
				</Button>
			</Toolbar>
		</AppBar>
	);
}
