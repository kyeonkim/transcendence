'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// tsparticles
 

import { useCallback } from 'react';
import particlesOptions from "../particles.json";

import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

import axios from 'axios';


export default function CookieControl ({res}: {res: any}) {
    const router = useRouter();
    const { status, twoFAPass, access_token, refresh_token, nick_name, user_id } = res;
    const [ init, setInit ] = useState(false);
    // const { nick_name, user_id } = res.userdata;



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
            
            router.replace('/main_frame');

        }
        catch (error)
        {
            router.replace("/");
        }
    }, []);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (container: Container) => {
        // console.log(container);
    };

    return (
        <>
            {init && <Particles id="tsparticles"  options={particlesOptions as ISourceOptions} particlesLoaded={particlesLoaded}/>}
        </>
    )
}
