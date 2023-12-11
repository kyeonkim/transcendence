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
import { useCookies } from 'next-client-cookies';
import { axiosToken } from '@/util/token';
import { Grid } from '@mui/material';

export default function MatchList(props: any) {
	const [page, setPage] = useState(0);
	const [res, setRes] = useState<any>([]);
	const listRef = useRef<HTMLUListElement>(null);
	const { id, name } = props;
	const cookies = useCookies();

	useEffect(() => {
		const handleScroll = (event : any) => {
			// console.log("match list scroll", event);
			console.log("event.currentTarget.scrollTop + event.currentTarget.clientHeight", event.currentTarget.scrollTop + event.currentTarget.clientHeight);
			console.log("event.currentTarget.scrollHeight", event.currentTarget.scrollHeight);
			if (listRef.current && listRef.current.clientHeight + listRef.current.scrollTop >= listRef.current.scrollHeight - 1) 
			{
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
		console.log("match list api call page = ", page)
		console.log("match list api call id = ", id);
		console.log("match list api call res = ", res)
		console.log("match list api call idx = ", res.length ? res[res.length - 1].idx - 1 : 0 )
		const fetchData = async () => {
		await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}game/data`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cookies.get('access_token')}`
			},
			params: { id: id, index: res.length ? res[res.length - 1].idx - 1 : 0 },
		})
		.then((response) => {
			console.log("match list api response===", response);
			if (response.data.status)
				setRes([...res, ...response.data.data]);
		})
		.catch((error) => {
			console.log("match list res err===",error);
		});
		};
		fetchData();
	}, [page]);
	
	// const handlepage = (event: any) => {
	// 	const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
	// 	if (scrollHeight - scrollTop === clientHeight) {
	// 		console.log("match list scroll end")
	// 		setPage((prevPage) => prevPage + 1);
	// 	}
	// }

	const listStyle = {
		position: 'sticky',
		top: '0',
		width: '90%',
		bgcolor: 'rgba(135, 206, 235, 0.2)',
		alignItems: 'center',
		marginLeft: '5%',
		marginRight: '5%',
		marginTop: '3.5%',
		maxHeight: '85%',
		borderRadius: '20px',
		border: '5px solid rgba(135, 207, 235, 0.2);',
		overflowY: 'scroll',
		scrollbarWidth: 'none',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
		display: 'flex',
		justifyContent: 'flex-start',
		flexDirection: 'column',

	};

	const emptyStyle = {
		position: 'relative',
		width: '90%',
		height: '15%',
		bgcolor: 'rgba(135, 206, 235, 0.2)',
		alignItems: 'center',
		marginLeft: '4%',
		marginRight: '4%',
		marginTop: '50px',
		borderRadius: '20px',
		border: '5px solid #000',
	};
	return (
		<List ref={listRef} sx={listStyle}>
			{res.length > 0 ? (
				console.log("match list res===", res),
				res.map((match: any, index: any) => {
				
				const listItemStyle = {
					border: '5px solid ' + (match.winner ? 'rgba(0, 0, 255, 0.4)' : 'rgba(255, 0, 0, 0.4)'), // 테두리 색상 설정
					backgroundColor: match.winner ? 'rgba(0, 0, 255, 0.4)' : 'rgba(255, 0, 0, 0.4)', // 배경 색상 설정
					color: 'white', // 텍스트 색상
					padding: '0.5vw', // 옵션: 패딩 설정
					margin : '0.1vw', // 옵션: 마진 설정
					width: '40vw', // 옵션: 너비 설정
					// marginLeft: '120px',
					borderRadius: '10px', // 옵션: 모서리를 둥글게 설정
					// opacity: '1'
					position: 'relative'
				};
				
				const textPrimaryStyle = {
					fontWeight: 'bold', // 텍스트를 굵게 설정
					fontSize: '1.5vw', // 폰트 크기 설정
					marginLeft: '0.5vw', // 왼쪽 마진 설정
					marginRight: '0.5vw', // 오른쪽 마진 설정
				};
				
				const textScoreStyle = {
					fontWeight: 'bold', // 텍스트를 굵게 설정
					fontSize: '1.5vw', // 폰트 크기 설정

				};
				const avatarStyle = {
					width: '4vw', // 프로필 사진의 너비 조절
					height: '4vw', // 프로필 사진의 높이 조절
				};
				const imageLoader = ({ src }: any) => {
					return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
				}
				return (
					// <Grid container justifyContent="center" direction="row" key={`${name}-${index}`}>
					// <Grid item sx={listItemStyle}>
					// 		<Grid container direction="row" alignItems="center" justifyContent="flex-start">
					// 			<Avatar alt="Remy Sharp" src={imageLoader({src: name})} sx={avatarStyle}/>
					// 			<Typography sx={{ ...textPrimaryStyle}}>
					// 				{name}
					// 			</Typography>
					// 		</Grid>
					// 		<Grid container direction="row" alignItems="center" justifyContent="center">
					// 			<Typography sx={{ ...textScoreStyle}}>
					// 				{match.my_score} : {match.enemy_score}
					// 			</Typography>
					// 		</Grid>
					// 		<Grid container direction="row" alignItems="center" justifyContent="flex-end">
					// 			<Typography sx={{ ...textPrimaryStyle, alignItems: 'flex-end'}}>
					// 				{match.enemy_name}
					// 			</Typography>
					// 			<Avatar alt="Remy Sharp" src={imageLoader({src: match.enemy_name})} sx={avatarStyle}/>
					// 	</Grid>
					// </Grid>
					// </Grid>
					<Grid container display='flex' justifyContent='space-between' alignItems='center' key={index} sx={listItemStyle}>
						<div style={{display:'flex', alignItems:'center'}}>
							<Avatar alt="Remy Sharp" src={imageLoader({src: name})} sx={avatarStyle}/>
							<Typography sx={{ ...textPrimaryStyle}}>
								{name}
							</Typography>
						</div>
						<div style={{position: 'absolute', width: '100%', display: 'flex'}}>
							<ListItemText
								primary={`${match.my_score} : ${match.enemy_score}`}
								primaryTypographyProps={{ textAlign: 'center', sx: textScoreStyle }}
							/>
						</div>
						<div style={{display:'flex', alignItems:'center'}}>
							<Typography sx={{ ...textPrimaryStyle}}>
								{match.enemy_name}
							</Typography>
							<Avatar alt="Remy Sharp" src={imageLoader({src: match.enemy_name})} sx={avatarStyle}/>
						</div>
					</Grid>
				);
				})
			) : (
				<ListItem alignItems="center" sx={emptyStyle}>
					<Typography sx={{ fontSize: '2vw' }}>
						매치 기록이 없습니다.
					</Typography>
				</ListItem>
			)}
		</List>
	);
}


/*
    margin: 0;
    font-family: "Roboto","Helvetica","Arial",sans-serif;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5;
    letter-spacing: 0.00938em;
    display: block;
    text-align: center;
    font-weight: 700;
    font-size: 1.5vw;
*/

/*
    margin: 0;
    font-family: "Roboto","Helvetica","Arial",sans-serif;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5;
    letter-spacing: 0.00938em;
    display: block;
    text-align: center;
    font-weight: 700;
    font-size: 1.5vw;
*/