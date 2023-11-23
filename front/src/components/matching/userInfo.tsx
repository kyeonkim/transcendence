import { axiosToken } from "@/util/token";
import { Avatar, Skeleton, Typography } from "@mui/material";
import { use, useEffect, useState } from "react";

export default function UserInfo(props: any) {
	const { userId, cookies } = props;
	const [user, setUser] = useState<any>([]);

	useEffect(() => {
		const getUserInfo = async () => {
			console.log("get user info start===", userId)
			if (userId == undefined)
				return;
			await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/id/${userId}`,{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${cookies.get('access_token')}`
				  },
			})
				.then((res) => {
					console.log("get user info response===", res);
					setUser(res.data.userdata);
				})
				.catch((err) => {
					console.log("get user info error===", err);
					setUser([]);
				})
		}
		getUserInfo();
	}, [userId]);

	const imageLoader = ({ src }: any) => {
		console.log("image loader src===", user);
		return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
	  }

	return (
		<div>
			{userId ? (
				<>
					<Avatar
						src={imageLoader({ src: user.nick_name })}
						sx={{ width: 300, height: 300, marginTop: '20px'}}
						/>
					<Typography variant="h2">
						{user.nick_name}
					</Typography>
				</>
			) : (
				<>
					<Skeleton variant="circular" width={300} height={300} sx={{ marginTop: '20px'}}/>
					<Skeleton variant="text" width={300} height={100} />
				</>
			)
			}
		</div>
	)
}