import { Avatar, Box, Divider, List, ListItem, ListItemButton, Paper, Popper, Typography } from "@mui/material";
import { useCallback, useState } from "react";


export default function UserList(props: any) {
	const { handleDrawerClose, imageLoader, style, pop, setPop, setAnchorEl ,anchorEl} = props;

	const sampleList = [
		{user_id: 1, nick_name: 'min22323223232323232323232323232323232223232232323232232'},
		{user_id: 2, nick_name: 'kyeonkim'},
		{user_id: 3, nick_name: 'kshim'},
	]

	const handlePopup = useCallback((event: any) => {
		if (anchorEl === event.currentTarget) {
			setPop(!pop);
		} else {
			setAnchorEl(event.currentTarget);
			setPop(true);
		}
		}, [anchorEl, pop]);
	
	const isOwner = true;
	return (
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
					<List className={style}>
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
}