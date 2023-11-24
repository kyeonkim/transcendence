'use client'

import styles from './chat.module.css';

import type { Engine } from "tsparticles-engine";
import { ISourceOptions } from "tsparticles-engine";
import { useCallback, useState } from 'react';
import particlesOptions from "../particles.json";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import { AppBar, Grid } from "@mui/material";

import MyProfile from '@/components/profile/my_profile';
import SearchUser from '@/components/search_bar/search_user';
import MatchingButton from '@/components/matching/matching';
import UserLists from '@/components/user_lists/user_lists';

export default function test() {
	const particlesInit = useCallback(async (engine: Engine) => {
		await loadFull(engine);
	}, []);

	const handleClick = () => {
	}

	return (
		<div>
			<Particles options={particlesOptions as ISourceOptions} init={particlesInit} />
			<Grid container className={styles.leftBox}>
				<MyProfile setMTbox={handleClick}/>
				<SearchUser setMTbox={handleClick}/>
				<MatchingButton setMTbox={handleClick}/>
				<UserLists setMTbox={handleClick}/>
			</Grid>
			<Grid container className={styles.profileBox}>
			</Grid>
			<Grid container className={styles.matchlistBox}>
			</Grid>
			<Grid container className={styles.rightBox}>
			</Grid>
		</div>
	)
}