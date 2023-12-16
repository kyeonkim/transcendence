import { axiosToken } from "@/util/token";
import { Avatar, Skeleton, Typography } from "@mui/material";
import { use, useEffect, useState } from "react";

export default function UserInfo(props: any) {
	const { userId, cookies } = props;
	const [user, setUser] = useState<any>([]);

	useEffect(() => {
		const getUserInfo = async () => {

			if (userId == undefined)
				return;
			await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/id/${userId}`,{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${cookies.get('access_token')}`
				  },
			})
				.then((res) => {
					setUser(res.data.userdata);
				})
				.catch((err) => {
					setUser([]);
				})
		}
		getUserInfo();
	}, [userId]);

	const imageLoader = ({ src, time }: any) => {
		return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}?${time}`
	  }

	return (
		<div>
			{userId ? (
				<>
					<Avatar
						src={imageLoader({ src: user.nick_name , time: new Date()})}
						sx={{ width: '10vw', height: '10vw', marginTop: '20px'}}
						/>
					<Typography align="center" style={{color: 'white',fontSize: '3vw'}}>
						{user.nick_name}
					</Typography>
				</>
			) : (
				<>
					<Skeleton variant="circular" width={'10vw'} height={'10vw'} sx={{ marginTop: '20px'}}/>
					<Skeleton variant="text" width={'10vw'} height={'3vw'} />
				</>
			)
			}
		</div>
	)
}