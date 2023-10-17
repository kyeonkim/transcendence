import React from 'react';
import styles from './mainbox.module.css';

const test1 = (props: any) => {
	const search = props.id;
	console.log('test1 search:', search);
	if (!search)
		return (
      <div className={styles.mainContainer}>
        <div className={styles.topThirdComponent}>
        <div className={styles.imageContainer}>
          <img src="./favicon.ico" alt="User Image" className={styles.userImage} />
          <div className={styles.userName}>MY_USER_ID</div>
          <div className={styles.buttonContainer}>
            <button className={styles.roundButton}>Button 1</button>
            <button className={styles.roundButton}>Button 2</button>
            <button className={styles.roundButton}>Button 3</button>
          </div>
      </div>
        </div>
          <div className={styles.bottomHalfContainer}>
            <div className={styles.leftHalfComponent}></div>
            <div className={styles.rightHalfComponent}></div>
        </div>
      </div>
		)
	else
		return (
      <div className={styles.mainContainer}>
        <div className={styles.topThirdComponent}>
        <div className={styles.imageContainer}>
          <img src="./images.ico" alt="User Image" className={styles.userImage} />
          <div className={styles.userName}>ID: {search}'s page</div>
          <div className={styles.buttonContainer}>
            <button className={styles.roundButton}>Button 1</button>
            <button className={styles.roundButton}>Button 2</button>
            <button className={styles.roundButton}>Button 3</button>
          </div>
      </div>
        </div>
          <div className={styles.bottomHalfContainer}>
            <div className={styles.leftHalfComponent}></div>
            <div className={styles.rightHalfComponent}></div>
        </div>
      </div>
		)
}

export default test1;
