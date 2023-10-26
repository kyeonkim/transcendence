import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function MatchList(id: any) {

  id = 'min';
  // id = 프로필 주인의 닉네임

  // id를 통해 api로 전적 정보 받아오기 
  // 요청할떄 index -1 (get요청으로 쿼리에 닉네임, 인덱스 넣어서 보내기)

  // 얼추 이것만 받아오고 상대방 프로필은 URL로?
  // 스코어는 보류
  //우선10개만받고 스크롤 끝에서 더 내리면 더 받아오는거 알아보기
  const res = [
    {nickname: 'dummy2', win: true, rank: false, score: 4, score2: 2, date: '2023-12-26',index: 10},
    {nickname: 'dummy6', win: false, rank: true, score: 1, score2: 12, date: '2023-12-25',index: 9},
    {nickname: 'dummy7', win: false, rank: true, score: 1, score2: 20, date: '2023-11-26',index: 8},
    {nickname: 'dummy1', win: false, rank: false, score: 1, score2: 2, date: '2023-11-25',index: 7},
    {nickname: 'dummy6', win: false, rank: false, score: 0, score2: 5, date: '2023-11-21',index: 6},
    {nickname: 'dummy1', win: true, rank: false, score: 5, score2: 2, date: '2023-11-21',index: 5},
    {nickname: 'dummy2', win: true, rank: false, score: 7, score2: 2, date: '2023-11-21',index: 4},
    {nickname: 'dummy4', win: true, rank: false, score: 5, score2: 2, date: '2023-11-20',index: 3},
    {nickname: 'dummy5', win: false, rank: true, score: 1, score2: 2, date: '2023-10-31',index: 2},
    {nickname: 'dummy1', win: true, rank: true, score: 10, score2: 2, date: '2023-10-25',index: 1},
      , //스크롤 끝나면 인덱스랑 같이 api재요청
  ];
  return (
    <List sx={{ width: '100%', height: '100%', maxWidth: 1143, maxHeight: 932, bgcolor: 'white', overflow: 'auto' }}>
      {res.map((match, index) => {
  
        const listItemStyle = {
          backgroundColor: match.win ? 'blue' : 'red',
          color: 'white', // 텍스트 색상
          padding: '4px', // 옵션: 패딩 설정
          borderRadius: '4px', // 옵션: 모서리를 둥글게 설정
        };
  
        const textPrimaryStyle = {
          fontWeight: 'bold', // 텍스트를 굵게 설정
          fontSize: '50px', // 폰트 크기 설정
        };
  
        return (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" sx={listItemStyle}>
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <Typography variant="h6" sx={{ ...textPrimaryStyle, fontSize: '50px' }}>
                min
              </Typography>
              <ListItemText
                primary={`${match.score}:${match.score2}`}
                primaryTypographyProps={{ textAlign: 'center', sx: textPrimaryStyle }} // 텍스트 스타일 조절
              />
              <Typography variant="h6" sx={{ ...textPrimaryStyle, fontSize: '50px' }}>
                {match.nickname}
              </Typography>
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        );
      })}
    </List>
  );
  
}
