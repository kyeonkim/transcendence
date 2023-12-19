'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// tsparticles
import type { Engine } from "tsparticles-engine";
import { ISourceOptions } from "tsparticles-engine";
import { useCallback } from 'react';
import particlesOptions from "../particles.json";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";

import axios from 'axios';


export default function CookieControl ({res}: {res: any}) {
    const router = useRouter();
    const { access_token, refresh_token, nick_name, user_id } = res;

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine);
      }, []);

    async function CookieSetter (access_token:any, refresh_token:any, nick_name:any, user_id:any)
    {
        await axios.post(`${process.env.NEXT_PUBLIC_FRONT_URL}api/set_cookie`, {
            access_token: access_token,
            refresh_token: refresh_token,
            nick_name: nick_name,
            user_id: user_id
        })
        .then((res) => {
            return (res);
        })
        .catch((err) => {
            throw new Error ('Cookie set fail');
        });
    }

    useEffect(() => {
        
        try
        {
            CookieSetter(access_token, refresh_token, nick_name, user_id);
            
            router.push('/main_frame');

        }
        catch (error)
        {
            router.replace("/");
        }
    }, []);

    return <Particles options={particlesOptions as ISourceOptions} init={particlesInit} />;
}
