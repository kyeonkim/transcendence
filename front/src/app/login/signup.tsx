"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { Avatar, Button, Grid, Skeleton, TextField, Typography } from "@mui/material"
import styles from './login.module.css'

// tsparticles
import type { Engine } from "tsparticles-engine";
import { ISourceOptions } from "tsparticles-engine";
import { useCallback, useState } from 'react';
import particlesOptions from "../particles.json";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";


export default function Signup (props:any) {
	const [imageFile, setFile] = useState<File>();
	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [nickname, setNickname] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();
	const formData = new FormData();

	const particlesInit = useCallback(async (engine: Engine) => {
		await loadFull(engine);
	}, []);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFile(file);
			const imageURL = URL.createObjectURL(file);
			setProfileImage(imageURL)
		}
	}

	const handleNicknameChange = (e: any) => {
		setNickname(e.target.value);
	}

	const handleEnter = async () => {
		formData.append('nick_name', nickname);
		if (imageFile) {
			formData.append('file', imageFile);
		}
		await axios.post( `${process.env.NEXT_PUBLIC_FRONT_URL}api/user_create`, {
				access_token: props.access_token,
				nick_name: nickname,
			})
			.then(async (response) => {
				console.log('sign up response =',response.data)
				formData.append('access_token', response.data.access_token);
				await axios.post(`${process.env.NEXT_PUBLIC_FRONT_URL}api/send_image`, formData)
				.then((res) => {
					console.log('image upload response =',res.data)
					if(res.data.success)
						router.replace('/main_frame');
					else
						window.alert('Image upload failed')
				})})
			.catch((error) => {
				console.log ('sign up error =',error.response.data)
				setError('중복된 닉네임이거나 특수문자가 포함되어있습니다! 다시 입력해주세요.');
			})
	}

	return (
		<div>
			<Particles options={particlesOptions as ISourceOptions} init={particlesInit} />
			<Grid container className={styles.signupBox} justifyContent="center">
				<Typography variant="h1" className={styles.signupTitle}>
					Wellcome!!
				</Typography>
				<Grid item className={styles.signupImage}>
            {!profileImage ? (
              <Skeleton variant="circular" width={200} height={200} />
            ) : (
              <Avatar src={profileImage} alt="Uploaded" style={{ width: '200px', height: '200px', borderRadius: '50%' }} />
            )}
				</Grid>
				<Grid item className={styles.signupImageText}>
						<Typography variant="h5">🙏이미지를 등록해주세요🙏</Typography>
				</Grid> 
			</Grid>
			<Grid item className={styles.signupImageUpload}>
				<Button variant="contained" component="label">
					이미지 업로드
					<input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
				</Button>
			</Grid>
			<Grid item className={styles.signupNickname}>
				<TextField
					color={error ? "error" : "primary"}
					id="outlined-basic"
					label="Nickname"
					variant="outlined"
					InputProps={{
						inputProps: {
							maxLength: 10,
							minLength: 2,
						},
						style: { color: 'white' },
					  }}
					className={styles.inputNickname}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setNickname(e.target.value);
					  }}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							if (e.nativeEvent.isComposing) return;
							handleEnter();
						}}}
					/> 
			</Grid>
			{error ? (
			<Grid item className={styles.signupError}>
				<Typography variant="caption" color="error" fontSize={'20px'}>
					{error}
				</Typography>
			</Grid>
			): (
				<Grid item className={styles.signupError}>
					<Typography variant="caption" fontSize={'20px'} color="#87ceeb">
						영문, 숫자를 조합해서 2~10자 내로 입력 후 엔터를 눌러주세요.
					</Typography>
				</Grid>
			)
			}
		</div>
	)
}
