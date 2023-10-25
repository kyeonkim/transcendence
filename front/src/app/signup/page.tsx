
import axios from 'axios';
import SendImage from './send_image';

export default async function SignForm () {

  return (
    <div>
      <p>this is server component - SignForm.</p>
      <SendImage />
    </div>

      // <Login signed={signed}/>
  );

}