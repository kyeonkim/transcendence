'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Container, TextField, Typography, Grid, Avatar, FormControl,
	InputLabel, Input, IconButton} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'axios';

export default function Signup(props: any) {
	const [profileImage, setFile] = useState<File | null>(null);
	const [nickname, setNickname] = useState('');
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	
	const router = useRouter();
	const formData = new FormData();

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFile(file);
			const imageURL = URL.createObjectURL(file);
			setImageUrl(imageURL);
		}
	};

	const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNickname(e.target.value);
	};

	const handleSetData = async () => {
		formData.append('nick_name', nickname);
		if (profileImage) {
			formData.append('file', profileImage);
		}
		await axios.post(`${process.env.NEXT_PUBLIC_API_URL}user/create`, {
			access_token: props.access_token,
			nick_name: nickname,
		})
		.then((res) => {
			await axios.post(`${process.env.NEXT_PUBLIC_API_URL}user/send_image`, formData)
			.then((res) => {
				if (res.data.success == true)
					router.replace('/main_frame');
			})
		.catch((err) => {
			window.alert('Image upload failed');
		})
	};
	return (
		<Container maxWidth="md">
			<Typography variant="h4" align="center" gutterBottom>
				Set User
			</Typography>
			<Grid container spacing={3} justifyContent="center">
				<Grid item xs={12} sm={6}>
					<FormControl fullWidth>
						<InputLabel htmlFor="profile-image-input">Image</InputLabel>
						<Input
							id="profile-image-input"
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
							sx={{ display: 'none' }}
						/>
						<label htmlFor="profile-image-input">
							<IconButton color="primary" aria-label="upload picture" component="span">
								<PhotoCamera />
							</IconButton>
						</label>
					</FormControl>
					{profileImage && (
						<Avatar
							src={imageUrl || ''}
							alt="프로필 사진"
							sx={{ width: 150, height: 150, borderRadius: '50%', margin: '20px auto', display: 'block' }}
						/>
					)}
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						fullWidth
						id="nickname"
						label="Nickname"
						value={nickname}
						onChange={handleNicknameChange}
						variant="outlined"
						sx={{ marginBottom: 3 }}
					/>
					<Button variant="contained" onClick={handleSetData} fullWidth>
						저장
					</Button>
				</Grid>
			</Grid>
		</Container>
	);
}
