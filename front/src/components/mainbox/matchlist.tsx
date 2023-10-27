'use client';
import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function MatchList(id: any) {
  const [page, setPage] = useState(0);
  const [res, setRes] = useState<any>([]);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    id = 0;
    const handleScroll = () => {
      if (listRef.current && listRef.current.clientHeight + listRef.current.scrollTop === listRef.current.scrollHeight) {
        setPage((prevPage) => prevPage + 1);
      }
    };
  
    if (listRef.current) {
      listRef.current.addEventListener('scroll', handleScroll);
    }
  
    return () => {
      if (listRef.current) {
        listRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [page]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}game/data`, {
        params: { id: id, index: res.length ? res[res.length - 1].idx - 1 : 0 },
      });
      setRes([...res, ...response.data.data]);
    };
  
    fetchData();
  }, [page]);
  
  return (
    <List ref={listRef} sx={{ width: '100%', height: '100%', maxWidth: 1143, maxHeight: 932, bgcolor: 'white', overflow: 'auto', alignItems: 'center'}}>
      {res.map((match, index) => {
        
        const listItemStyle = {
          border: '5px solid ' + (match.winner ? 'rgba(0, 0, 255, 0.4)' : 'rgba(255, 0, 0, 0.4)'), // 테두리 색상 설정
          backgroundColor: match.winner ? 'rgba(0, 0, 255, 0.4)' : 'rgba(255, 0, 0, 0.4)', // 배경 색상 설정
          color: 'white', // 텍스트 색상
          padding: '10px', // 옵션: 패딩 설정
          margin : '9px', // 옵션: 마진 설정
          width: '1110px', // 옵션: 너비 설정
          borderRadius: '10px', // 옵션: 모서리를 둥글게 설정
        };
        
        const textPrimaryStyle = {
          fontWeight: 'bold', // 텍스트를 굵게 설정
          fontSize: '50px', // 폰트 크기 설정
          marginLeft: '20px', // 왼쪽 마진 설정
          marginRight: '20px', // 오른쪽 마진 설정
        };
        
        const textScoreStyle = {
          fontWeight: 'bold', // 텍스트를 굵게 설정
          fontSize: '50px', // 폰트 크기 설정

        };
        const avatarStyle = {
          width: '90px', // 프로필 사진의 너비 조절
          height: '90px', // 프로필 사진의 높이 조절
        };
        const imageLoader = ({ src }: any) => {
          return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
        }
        return (
          <React.Fragment key={index}>
            <ListItem alignItems="center" sx={listItemStyle}>
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={imageLoader({src: match.enemy_name})} sx={avatarStyle}/>
              </ListItemAvatar>
              <Typography variant="h6" sx={{ ...textPrimaryStyle, fontSize: '50px' }}>
                min
              </Typography>
              <ListItemText
                primary={`${match.my_score}:${match.enemy_score}`}
                primaryTypographyProps={{ textAlign: 'center', sx: textScoreStyle }}
              />
              <Typography variant="h6" sx={{ ...textPrimaryStyle, fontSize: '50px' }}>
                {match.enemy_name}
              </Typography>
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={imageLoader({src: match.enemy_name})} sx={avatarStyle}/>
              </ListItemAvatar>
            </ListItem>
            {/* <Divider variant="inset" component="li" /> */}
          </React.Fragment>
        );
      })}
    </List>
  );
  
}

/*
        {
            "idx": 16,
            "rank": true,
            "user_id": 0,
            "enemy_id": 1,
            "winner": true,
            "my_score": 11,
            "enemy_score": 0,
            "created_at": "2023-10-26T08:36:23.362Z"
        },
*/