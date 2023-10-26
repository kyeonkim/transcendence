import Main from './containers';

import { cookies } from 'next/headers';

export default async function MainFrame () {

  
  // cookie 설정 여기서 하면 브라우저에 반영되는가?
  // cookie 관리를 서버 컴포넌트에서 해야하는가? 아니면 client에서 재렌더링할 때마다 확인?

  // 일단 prop으로 넘겨서 사용.
  // 재렌더링 동작 형태 고민해보기.
  // MainFrame에 어떻게 access_token, refresh_token 전달할지 생각해보기.

  // const access_token = getCookie('access_token');
  // const refresh_token = getCookie('refresh_token');

  // console.log('MainFrame: access_token getCookie:', getCookie('access_token'));
  // console.log('MainFrame: refresh_token getCookie:', getCookie('refresh_token'));

  const cookieBox = cookies();

  const access_cookie = cookieBox.get('access_token');
  const refresh_cookie = cookieBox.get('refresh_token');

  console.log('MainFrame: access_token getCookie:', access_cookie?.value);
  console.log('MainFrame: refresh_token getCookie:', refresh_cookie?.value);
  //여기에 main컴포넌트에 자신의 nickname을 넣어주던지 해야될거같아요. 로그인단계에서 본인의 닉네임만 쿠키화?
  // 하위 컴포넌트에서 자신이 누군지는 알아야될거같음 

  return (
      // <Main />
      <div>
        <p>
          main_frame
        </p>
      </div>
  );
}