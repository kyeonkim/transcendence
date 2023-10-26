import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import CommentIcon from '@mui/icons-material/Comment';

export default function FriendListPanel() {
  const [checked, setChecked] = React.useState([1]);

  const handleChat = (user: string) => () => {
    console.log("chat to " + user);
  };

  const handleProfile = (user: string) => () => {
    console.log('profile to ' + user);
  }

  const apiResponse = [
    {id: 1, nickname: 'user1' },
    {id: 2, nickname: 'user2' },
    {id: 3, nickname: 'user3' },
    {id: 3, nickname: 'user3' },
    {id: 3, nickname: 'user3' },
    {id: 3, nickname: 'user3' },
    {id: 3, nickname: 'user3' },
    {id: 3, nickname: 'user3' },
    {id: 3, nickname: 'user3' },
    {id: 3, nickname: 'user3' },
    {id: 3, nickname: 'user3' },
    {id: 3, nickname: 'user3' },
    {id: 3, nickname: 'user3' },
    {id: 3, nickname: 'user3' },
    {id: 3, nickname: 'user3' },
  ];

  return (
    <List dense sx={{ width: '100%', maxWidth: 400, maxHeight: 580,bgcolor: 'background.paper', overflow: 'auto'}}>
      {apiResponse.map((user) => {
        const labelId = `checkbox-list-secondary-label-${user.id}`;
        return (
          <ListItem
            key={user.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="comments"
                onClick={handleChat(user.nickname)}
              >
                <CommentIcon />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton onClick={handleProfile(user.nickname)}>
              <ListItemAvatar>
                  <Avatar
                    // src={`user.profile_image`} 나중에 이미지 url넣음댈듯
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={`${user.nickname}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}


/*
response example
{
  id
  nickname
  profile_image?
}
*/