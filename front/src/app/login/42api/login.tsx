'use client'
import { useRouter } from "next/navigation";


// client에서 먼저 return render를 한 후에, 라우팅을 하게 만들 수는 없을까?
// 뒤로가기 제대로 동작 안한다고 볼 수 있을까?
// 어떻게 동작시키는게 맞을까?
export default function Login ({signed} :any) {

    const router = useRouter();

    console.log(signed);
    if (signed)
    {
        router.push('/main_frame');
    }
    else
    {
        router.push('/signup');
    }

    return (
        <>
            <p>hi hello</p>
        </>
    );
}