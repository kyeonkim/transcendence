import qrcode from 'qrcode';
import { authenticator } from '@otplib/preset-default';
import { useState } from 'react';

const Login = () => {
  const [token, setToken] = useState('');
  const user = 'tester';
  const service = 'trans';
  // const secret = authenticator.generateSecret(); // -> 백에서 생성? 프론트에서 생성하고 전달? 
  const secret = '2testererereerer2wdwdwd'
  const otpauth = authenticator.keyuri(user, service, secret);
   
  const handle = () => {
    qrcode.toDataURL(otpauth, (err, imageUrl) => {
      if (err) {
        console.log('Error with QR');
        return;
      }
      console.log(imageUrl);
    });
  }

  const handleVerify = () => {
    const isValid = authenticator.verify({ token, secret });
    console.log('isValid: ',isValid);
    console.log('token: ',token);
    console.log('secret: ',secret);
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handle}>Generate QR Code</button>
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button onClick={handleVerify}>Verify OTP</button>
    </div>
  );
};  

export default Login;
  