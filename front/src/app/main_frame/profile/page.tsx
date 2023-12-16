'use client';
import Profile from '@/components/mainbox/profile';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatSocket  from '@/app/main_frame/socket_provider';
import ChatBlockProvider from '@/app/main_frame/shared_state';
import StatusContextProvider from '@/app/main_frame/status_context';

export default function ProfilePage() {
	const router = useRouter();
	const searchParams = useSearchParams()

	const search = searchParams.get('nickname')

	return (
			<Profile nickname={search} setProfile={null}/>
	)

	// return <div>ProfilePage to {search}</div>;
}