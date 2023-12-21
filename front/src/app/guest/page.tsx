'use client'
// check = 원래 client이면 안되는데, 원격 서버 관련 이슈

import React from 'react';
import { redirect } from 'next/navigation';
import axios from 'axios';

import CookieControl from './cookie_control';


export default function Guest ({searchParams}:any) {

  const id :number = searchParams.value;

  let responseData;

  console.log('in Guest - ', searchParams);

  async function GetGuest (id :number)
  {
    let access_token;
    let userData;

    try
    {
      userData = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}test/login`, {
        dummy_id: id
      });
      console.log(' guest res - ', userData);

      access_token = userData.data.token.access_token;
      console.log(' guest access token - ', access_token);

      if (access_token == undefined
        || access_token == null)
        {
          throw new Error ('to entrance');
        }

    }
    catch (error)
    {
        console.log('GetGuest Error!!', error);
        redirect('/');
    }

    return (userData);
  }

  if (id)
  {
    return (
      <div>
      {(async () => {
        try
        {
			const response: any = await GetGuest(id);

			responseData = response?.data;
      console.log('guest before cookie - ', responseData);

			if (responseData == undefined)
			{
				redirect ('/');
			}
	
			return (
				<div>
					<CookieControl res={responseData} />
				</div>
			);
        }
        catch
        {
          redirect ('/');
        }
        })()}
      </div>   
    );
  }
  else
  {
    // redirect ('/');
  }
}