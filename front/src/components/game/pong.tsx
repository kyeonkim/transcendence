"use client"
import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useChatSocket } from '@/app/main_frame/socket_provider';
import { useCookies } from "next-client-cookies";

import  GameProfile  from "./gameProfile";
import  GameEnd from "./gameEnd";

export default function Pong (props :any){
    const socket = useChatSocket();
    const { rank, mode, exitGame  } = props;
    const [gameEnd, setGameEnd] = useState(false);
    const [endData, setEndData] = useState({});

    const [inGameData, setInGameData] = useState({});

    const [initialSize, setInitialSize] = useState({
        canvas_width: 0,
        canvas_height: 0,
        board_width:0,
        board_height:0,
        ball_size: 0,
        bar_width: 0,
        bar_height: 0,
    })

    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [ball, setBall] = useState<fabric.Rect>();
    const [net, setNet] = useState<fabric.Rect>();
    const [player1, setPlayer1] = useState<fabric.Rect>();
    const [player2, setPlayer2] = useState<fabric.Rect>();

    const [user, setUser] = useState<fabric.Rect>();
    const [enemy, setEnemy] = useState<fabric.Rect>();

    const [isUserPL1, setIsUserPL1] = useState(false);

    const [gameData, setGameData] = useState({
        startTime: 0,
    })

    const [scoreValue, setScoreValue] = useState({player1: 0, player2: 0});
    const [propscore, setScore] = useState({player1: 0, player2: 0});
    const [viewportUpdate, setViewportUpdate] = useState(false);
    const [initCanvas, setInitCanvas] = useState(false);
    const [readyResize, setReadyResize] = useState(false);
    const [initUserSetting, setInitUserSetting] = useState(false);
    const [initListener, setInitListener] = useState(false);
    const [initGame, setInitGame] = useState(false);

    const [playerSpeed, setPlayerSpeed] = useState({value: 10});
    const [reverseSign, setReverseSign] = useState(1);

    const [ballVecXY, setBallVecXY] = useState({
        x: 1,
        y: 0,
        speed: 10
    });
    const [ballVecLen, setBallVecLen] = useState(Math.sqrt(Math.pow(6, 2) + Math.pow(6, 2)));

    const [isArrowPressed, setIsArrowPressed] = useState({
        arrowUp: false,
        arrowDown: false
    });
    const [ballFix, setBallFix] = useState({newData: false, time: 0, enemy: {top:0, left:0}, ball: {top:0, left:0}, ballVecXY: {x:0, y:0, speed:0}, score:{}});
    
    // viewportRatio 1 = 1600:900
    const   [viewportRatio, setViewportRatio] = useState({value: 1.0});

	const   cookies = useCookies();
    const   containerRef = props.containerRef;
    
    // let     isUserPl1 = false;


    console.log("in game rank : ", rank);
    console.log("in game mode : ", mode);
    console.log("in game inGameData : ", inGameData);



    // 초기에 canvas 그리기 전에 width, height 설정 필요
    const handleInitialSize = () => {


        // let screenWidth = window.innerWidth * 0.5;
        // let screenHeight = window.innerHeight * 0.4;

        let screenWidth = containerRef.current.offsetWidth;
        let screenHeight = containerRef.current.offsetHeight * 0.5;
        
        let ratio;
        let fixWidth = false;

        // const computedStyle = window.getComputedStyle(myRef.current);

        // let screenWidth = parseFloat(computedStyle.width);
        // let screenHeight = parseFloat(computedStyle.height);


        console.log('initial container size - ', screenWidth, screenHeight);

        // 감지 기준에, 프로필 존재하는 크기를 추가할 필요 있음
            // screen 40%가 프로필임
        if (screenWidth > screenHeight)
        {
            if (screenHeight / 9 * 16 > screenWidth)
            {
                fixWidth = true;
            }
            else
            {
                fixWidth = false;
            }
        }
        else
        {
            if (screenWidth / 16 * 9 > screenHeight)
            {
                fixWidth = false;
            }
            else
            {
                fixWidth = true;
            }
        }

        if (fixWidth === true)
        {
            ratio = screenWidth / 1600;

            console.log('initial ratio (width fix) - ', ratio);

            screenHeight = screenWidth / 16 * 9;

            setInitialSize({
                canvas_width: screenWidth,
                canvas_height: screenHeight,
                board_width: screenWidth,
                board_height: screenHeight / 9,
                ball_size: screenWidth / 50,
                bar_width: screenWidth / 60,
                bar_height: screenHeight / 5
            });
        }
        else
        {
            ratio = screenHeight / 900;
        
            console.log('initial ratio (height fix) - ', ratio);

            screenWidth = screenHeight / 9 * 16;

            setInitialSize({
                canvas_width: screenWidth,
                canvas_height: screenHeight,
                board_width: screenWidth,
                board_height: screenHeight / 9,
                ball_size: screenWidth / 50,
                bar_width: screenWidth / 60, // 16
                bar_height: screenHeight / 5 // 108
            });
        }

        viewportRatio.value = ratio;
        playerSpeed.value *= ratio;
        ballVecXY.speed *= ratio;
    }

    useEffect(() => {
        console.log('containerRef value is - ', containerRef);
        if (containerRef !== null)
        {
            handleInitialSize();
            setInitCanvas(true);
        }
    }, [containerRef]);

    useEffect(() => {
        
        // ratio 적용 가능할 것 같음.
        if (initCanvas === true)
        {
            const pongCanvas = new fabric.Canvas("pongCanvas", {
                // canvas 만들기
                height: initialSize.canvas_height,
                width: initialSize.canvas_width,
                backgroundColor: "black",
            });
        
        
            setCanvas(pongCanvas);
        
            let tmp_user1 = new fabric.Rect({
                left: initialSize.bar_width * 2,
                top: initialSize.canvas_height / 2 - initialSize.bar_height / 2,
                height: initialSize.bar_height,
                width: initialSize.bar_width,
                fill: "white",
            });
        
            setPlayer1(tmp_user1);
            pongCanvas.add(tmp_user1);
        
            let tmp_user2 = new fabric.Rect({
                left: initialSize.canvas_width - (initialSize.bar_width * 3),
                top: initialSize.canvas_height / 2 - (initialSize.bar_height / 2),
                height: initialSize.bar_height,
                width: initialSize.bar_width,
                fill: "white",
            });
        
            setPlayer2(tmp_user2);
            pongCanvas.add(tmp_user2);
        
            let circle = new fabric.Rect({
                left: (initialSize.canvas_width / 2 ) - initialSize.ball_size / 2,
                top: (initialSize.canvas_height / 2 ) - initialSize.ball_size / 2,
                height: initialSize.ball_size,
                width: initialSize.ball_size,
                fill: "white",
            });
    
            setBall(circle);
            pongCanvas.add(circle); // add 로 칸바스에 추가할 수 있음
        
            // net
            // for (let i = 0; i <= initialSize.canvas_height; i += initialSize.canvas_height / 50)
            // {
            //     let net = new fabric.Rect({ 
            //         left: (initialSize.canvas_width / 2) - initialSize.canvas_width / 400 / 2,
            //         top: i,
            //         width: initialSize.canvas_width / 400,
            //         height: initialSize.canvas_height / 20,
            //         fill: "white",
            //     });
            //     pongCanvas.add(net);
            // }


            let net = new fabric.Rect({ 
                left: (initialSize.canvas_width / 2) - initialSize.canvas_width / 400 / 2,
                top: 0,
                width: initialSize.canvas_width / 400,
                height: initialSize.canvas_height,
                fill: "white",
            });
            pongCanvas.add(net);
            setNet(net);

            // Canvas 수정 막기
            pongCanvas.selection = false;
        
            pongCanvas.forEachObject(function (obj :any) {
                obj.selectable = false;
                obj.evented = false;
            });

            
            if (mode === true)
            {
                setReverseSign(-1);
            }

            setInitUserSetting(true);
    
            return () => {
                console.log("disposal");
                pongCanvas.dispose();
                // scoreBoard.dispose();
                console.log("disposal done");
            }
    
        }
       
    }, [initCanvas]);


    useEffect(() => {

        console.log("init player : ", player1, player2);
        console.log(`run pong`, user);
        console.log('game_mode:', mode);
        console.log('game_rank:', rank);
        console.log(`init 1 `,initUserSetting);

        if (initUserSetting === true)
        {

            console.log(`init 2`);
            const listenGameInit = (data :any) => {
                console.log('game-init');
    
                // 세팅할 때 자신, 상대 일부 데이터 필요함 (GameProfile 용도)
                console.log('ready data - ', data);
    
                gameData.startTime = Date.now();
                if (data.room.user1_id === Number(cookies.get('user_id')))
                {
                    setUser(player1);
                    setEnemy(player2);
                    setIsUserPL1(true);
                } else {
                    setUser(player2);
                    setEnemy(player1);
                    setIsUserPL1(false);
                }
                console.log("init player : ", player1, player2);
                console.log("init user : ", user);

                setInGameData(data.room);
                setInitListener(true);
            }
    
            setReadyResize(true);

            socket.on(`game-init`, listenGameInit);
            socket.emit(`game-start`, {user_id: Number(cookies.get('user_id')), user_nickname: cookies.get('nick_name'), rank: rank, game_mode: mode});
            console.log('init 3');
            return () => {
                console.log('closing game-init listener');
                socket.off('game-init', listenGameInit);
            }
        }
      
    }, [initUserSetting])

    useEffect(() => {

        console.log('ready to open game-related listener');

        if (initListener === true)
        {

            const listenGameUserPosition = (data :any) => {
                // console.log(`game-user-position on: ${data.y * viewportRatio}`, enemy);
                // console.log('game-user-position on - data : ', data);
                // console.log('game-user-position on - viewportRatio : ', viewportRatio);
                enemy.top = data.y * viewportRatio.value;
            }
    
            const listenGameBallFix = (data :any) => {
                console.log(`game-ball-fix on`, data);
                ballFix.newData = true;

                ballFix.enemy = data.enemy;
                ballFix.ball = data.ball;
                ballFix.ballVecXY = data.ballVecXY;
                
                ballFix.score = data.score;
                setScore({player1: data.score.player1, player2: data.score.player2})
                // setBallFix(prevballfix=> ({
                //     ...prevballfix, newData: true, enemy: data.enemy, ball: data.ball, ballVecXY: data.ballVecXY, score: data.score}))
                
                ballFix.enemy.top = ballFix.enemy.top * viewportRatio.value;
                ballFix.enemy.left = ballFix.enemy.left * viewportRatio.value;
                ballFix.ball.top = ballFix.ball.top * viewportRatio.value;
                ballFix.ball.left = ballFix.ball.left * viewportRatio.value;

                ballFix.ballVecXY.speed *= viewportRatio.value;
            }
            
            socket.on(`game-user-position`, listenGameUserPosition);
    
            socket.on('game-ball-fix', listenGameBallFix);
    
            setInitGame(true);
    
            return () => {
                console.log('closing game-related listeners');
                socket.off('game-user-position', listenGameUserPosition);
                socket.off('game-ball-fix', listenGameBallFix);
            };
        }

    }, [initListener]);

    // useEffect(() => {
    //     console.log('set BallFix =====')
    //     ballFix.enemy.top = ballFix.enemy.top * viewportRatio.value;
    //     ballFix.enemy.left = ballFix.enemy.left * viewportRatio.value;
    //     ballFix.ball.top = ballFix.ball.top * viewportRatio.value;
    //     ballFix.ball.left = ballFix.ball.left * viewportRatio.value;

    //     ballFix.ballVecXY.speed *= viewportRatio.value;
    // }, [ballFix])

    useEffect(() => {

        if (initGame === true)
        {
            const listenGameEnd = (data :any) => {
                console.log('game-end by back sended event!!');
                // 게임 종료 인식하는 이벤트
                cancelAnimationFrame(lastRequestId);
    
                // 종료 컴포넌트 렌더하게 만들기
                    // data에 nickname 및 결과 데이터 들어있음.
                    setEndData(data.gameData);
                    // 게임 실행 종료
                    setGameEnd(true);
            }

            let lastRequestId :number; 
    
            socket.on('game-end', listenGameEnd);
    
            console.log('before requestAnaimationFrame-drawPong begin');

            const drawPong = () => {
                
                // console.log('drawing data check - ', canvas, board, ball, user);

                // 플레이어 이동
                if (reverseSign === 1)
                {
                    if (isArrowPressed.arrowUp === true && user.top > 0) 
                    {
                        user.set('top', Math.max(user.top - playerSpeed.value, 0));
                        socket.emit(`game-user-position`, {y: user.top / viewportRatio.value});
                    }
                    if (isArrowPressed.arrowDown === true && user.top < canvas.height - user.height)
                    {
                        user.set('top', Math.min(user.top + playerSpeed.value, canvas.height - user.height));
                        socket.emit(`game-user-position`, {y: user.top / viewportRatio.value});
                    }
                }
                else if (reverseSign === -1)
                {
                    if (isArrowPressed.arrowDown === true && user.top > 0)
                    {
                        user.set('top', Math.max(user.top - playerSpeed.value, 0));
                        socket.emit(`game-user-position`, {y: user.top / viewportRatio.value});
                    }
                    if (isArrowPressed.arrowUp === true && user.top < canvas.height - user.height)
                    {
                        user.set('top', Math.min(user.top + playerSpeed.value, canvas.height - user.height));
                        socket.emit(`game-user-position`, {y: user.top / viewportRatio.value});
                    }
                }

                // 공 이동
                ball.set('left', ball.left + (ballVecXY.x * ballVecXY.speed));
                ball.set('top', ball.top + (ballVecXY.y * ballVecXY.speed));
        
                // game-ball-fix - kyeonkim
                if (ballFix.newData === true)
                {
                    // console.log('ballFix data - ', ballFix);
                    
                    ball.set(`left`, ballFix.ball.left);
                    ball.set(`top`, ballFix.ball.top);
                    ballVecXY.x = ballFix.ballVecXY.x;
                    ballVecXY.y = ballFix.ballVecXY.y;
                    ballVecXY.speed = ballFix.ballVecXY.speed;
                    enemy.set('left', ballFix.enemy.left);
                    enemy.set('top', ballFix.enemy.top);
                    scoreValue.player1 = ballFix.score.player1;
                    scoreValue.player2 = ballFix.score.player2;
                    //setScoreValue({player1: ballFix.score.player1, player2: ballFix.score.player2})
                    ballFix.newData = false;
                }
                // 공 화면 위-아래 튕기기
                if (ball.top <= 0 || ball.top >= canvas.height - ball.width)
                {
                    ballVecXY.y = -ballVecXY.y;
                    // game-ball-hit event - kyeonkim
                }
                // 공 화면 바깥에 닿았는지 확인
                if (ball.left + ball.width  <= 0 && user === player1)
                {
                    // console.log('ball out - left');
                    ball.set({ left: (canvas.width / 2 - ball.width / 2), top: (canvas.height / 2 - ball.width / 2)});
                    ballVecXY.x = -ballVecXY.x;
                    ballVecXY.speed = 10 * viewportRatio.value;
                    // game-ball-hit event - kyeonkim
        
                    console.log('before get score player2!!!', scoreValue.player2);
                    scoreValue.player2++;
                    console.log('get score player2!!!', scoreValue.player2);

                    setScore({player1: scoreValue.player1, player2: scoreValue.player2});

                    // setScoreValue(prevscoreValue => ({...prevscoreValue, player2: prevscoreValue.player2 + 1}))
                    // console.log("scoreValue.player2 : ", scoreValue.player2);
                    // 계수 반영해서 보내기
                    socket.emit('game-ball-hit', {
                        time: Date.now(),
                        enemy: {left: user.left / viewportRatio.value, top: user.top / viewportRatio.value},
                        ball: {left: ball.left / viewportRatio.value, top: ball.top / viewportRatio.value},
                        ballVecXY: {x: ballVecXY.x, y:ballVecXY.y, speed: ballVecXY.speed / viewportRatio.value},
                        score: {player1: scoreValue.player1, player2: scoreValue.player2}
                    });


                    // user2Score.set("text",`${scoreValue.player2}`);
                } 
                else if (ball.left >= canvas.width && user === player2)
                {
                    // console.log('ball out - right');
                    ball.set({ left: canvas.width / 2 - ball.width / 2, top: canvas.height / 2 - ball.width / 2});
                    ballVecXY.x = -ballVecXY.x;
                    ballVecXY.speed = 10 * viewportRatio.value;
                    // game-ball-hit event - kyeonkim

                    console.log('before get score player1!!!', scoreValue.player1);
                    scoreValue.player1++;
                    console.log('get score player1!!!', scoreValue.player1);

                    setScore({player1: scoreValue.player1, player2: scoreValue.player2});
                    // 계수 반영해서 보내기
                    // setScoreValue(prevscoreValue => ({...prevscoreValue, player1: prevscoreValue.player1 + 1}))

                    // console.log("scoreValue.player1 : ", scoreValue.player1);
                    socket.emit('game-ball-hit', {
                        time: Date.now(),
                        enemy: {left: user.left / viewportRatio.value, top: user.top / viewportRatio.value},
                        ball: {left: ball.left / viewportRatio.value, top: ball.top / viewportRatio.value},
                        ballVecXY: {x: ballVecXY.x, y:ballVecXY.y, speed: ballVecXY.speed / viewportRatio.value},
                        score: {player1: scoreValue.player1, player2: scoreValue.player2}
                    });


                    // user1Score.set("text",`${scoreValue.player1}`);
                }
                else
                {
                    // 공 플레이어1 에 닿는지 확인
                    if (
                        user === player1 &&
                        ballVecXY.x < 0 &&
                        ball.left <= player1.left + player1.width &&
                        ball.left >= player1.left &&
                        ball.top + ball.width >= player1.top &&
                        ball.top <= player1.top + player1.height)
                    {
                        // console.log('ball hit to player1');
                        // console.log('palyer1 position - ', user.left / viewportRatio.value, user.top /viewportRatio.value);
                        let angle;
                        ballVecXY.speed = 20 * viewportRatio.value;
                        if (reverseSign === -1)
                        {
                            angle = Math.random();
                            angle = Math.random() > 0.5 ? angle : -angle;
                            ballVecXY.speed = (Math.random() * 20 + 10) * viewportRatio.value;
                        }
                        else
                            angle = (ball.top - (player1.top + (player1.height / 2)))/(player1.height / 2);
                        // const angle = (ball.top - (player1.top + (player1.height / 2)))/(player1.height / 2);
                        ballVecXY.x = Math.cos(Math.PI/4 * angle);
                        ballVecXY.x = ballVecXY.x > 0 ? ballVecXY.x : -ballVecXY.x;
                        ballVecXY.y = Math.sin(Math.PI/4 * angle) * reverseSign;

                        // game-ball-hit event - kyeonkim
                        // console.log('ballVecXY.x - ', ballVecXY.x, ' and ballVecXY.y - ', ballVecXY.y);
                        // user === player1 > send

                        socket.emit('game-ball-hit', {
                            time: Date.now(),
                            enemy: {left: user.left / viewportRatio.value, top: user.top / viewportRatio.value},
                            ball: {left: ball.left / viewportRatio.value, top: ball.top / viewportRatio.value},
                            ballVecXY: {x: ballVecXY.x, y:ballVecXY.y, speed: ballVecXY.speed / viewportRatio.value},
                            score: {player1: scoreValue.player1, player2: scoreValue.player2}
                        });
                    }
                    // 공 플레이어2 에 닿는지 확인
                    else if (
                        user === player2 &&
                        ballVecXY.x > 0 &&
                        ball.left + ball.width >= player2.left &&
                        ball.left + ball.width <= player2.left + player2.width &&
                        ball.top + ball.width >= player2.top &&
                        ball.top <= player2.top + player2.height)
                    {
                        // console.log('ball hit to player2');
                        // console.log('palyer2 position - ', user.left / viewportRatio.value, user.top /viewportRatio.value);
                        let angle;
                        ballVecXY.speed = 20 * viewportRatio.value;
                        if (reverseSign === -1)
                        {
                            angle = Math.random();
                            angle = Math.random() > 0.5 ? angle : -angle;
                            ballVecXY.speed = (Math.random() * 20 + 10) * viewportRatio.value;
                        }
                        else
                            angle = (ball.top - (player2.top + (player2.height / 2)))/(player2.height / 2);
                        // const angle = (ball.top - (player2.top + (player2.height / 2)))/(player2.height / 2);
                        ballVecXY.x = Math.cos(Math.PI/4 * angle);
                        ballVecXY.x = ballVecXY.x > 0 ? -ballVecXY.x : ballVecXY.x;
                        ballVecXY.y = Math.sin(Math.PI/4 * angle) * reverseSign;
                        // user === player2 > send
                        // game-ball-hit event - kyeonkim

                        socket.emit('game-ball-hit', {
                            time: Date.now(),
                            enemy: {left: user.left / viewportRatio.value, top: user.top / viewportRatio.value},
                            ball: {left: ball.left / viewportRatio.value, top: ball.top / viewportRatio.value},
                            ballVecXY: {x: ballVecXY.x, y:ballVecXY.y, speed: ballVecXY.speed/viewportRatio.value},
                            score: {player1: scoreValue.player1, player2: scoreValue.player2}
                        });
                    }
                }
                // 다시 그리기
                canvas.renderAll();
    
                lastRequestId = requestAnimationFrame(drawPong);
    
            };
            drawPong();
        
            return () => {
                console.log('before pong component unmount - cancelanimationframe');
                socket.off('game-end', listenGameEnd);
                cancelAnimationFrame(lastRequestId);
                
            };
        }

    }, [initGame]);

    // 화면 크기가 변하면 canvas 안에 있는 값들도 재설정
    useEffect(() => {
        
        if (readyResize === true)
        {
            // resize 관련 함수
            let resizeTimer :any;

            const handleResizeDebounce = () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(handleResize, 500);
            }

            const handleResize = () => {
                console.log("handleResize!!!");

                let screenWidth = containerRef.current.offsetWidth;
                let screenHeight = containerRef.current.offsetHeight * 0.5;
                
                let ratio;
                let fixWidth;

                if (screenWidth > screenHeight)
                {
                    if (screenHeight / 9 * 16 > screenWidth)
                    {
                        fixWidth = true;
                    }
                    else
                    {
                        fixWidth = false;
                    }
                }
                else
                {
                    if (screenWidth / 16 * 9 > screenHeight)
                    {
                        fixWidth = false;
                    }
                    else
                    {
                        fixWidth = true;
                    }
                }

                if (fixWidth === true)
                {
                    console.log('resizing 1');

                    canvas.setWidth(screenWidth);
                    canvas.setHeight(screenWidth / 16 * 9);

                    ratio = screenWidth / 1600;
                }
                else
                {
                    console.log('resizing 1');

                    canvas.setWidth(screenHeight / 9 * 16);
                    canvas.setHeight(screenHeight);


                    ratio = screenHeight / 900;

                }

                console.log('new canvas size - ', canvas.width, canvas.height);

                console.log('========calc start=========');        

                console.log('viewportRatio.value and newRatio - ', viewportRatio.value, ratio);

                console.log('canvas set to unit value - ', canvas.width / ratio, canvas.height / ratio);
                console.log('player1 set to unit value - ', viewportRatio.value, ' - width and height - ', player1.width / viewportRatio.value, player1.height / viewportRatio.value);
                console.log('player2 set to unit value - ', viewportRatio.value, ' - width and height - ', player2.width / viewportRatio.value, player2.height / viewportRatio.value);
                
                console.log('setting player 1', player1.width, viewportRatio.value, ratio);
                player1.set({
                    width: player1.width / viewportRatio.value * ratio,
                    height: player1.height / viewportRatio.value * ratio,
                    left: player1.left / viewportRatio.value * ratio,
                    top: player1.top / viewportRatio.value * ratio,
                  }).setCoords();

                player2.set({
                    width: player2.width / viewportRatio.value * ratio,
                    height: player2.height / viewportRatio.value * ratio,
                    left: player2.left / viewportRatio.value * ratio,
                    top: player2.top / viewportRatio.value * ratio,
                  }).setCoords();

                ball.set({
                    width: ball.width / viewportRatio.value * ratio,
                    height: ball.height / viewportRatio.value * ratio,
                    left: ball.left / viewportRatio.value * ratio,
                    top: ball.top / viewportRatio.value * ratio,
                  }).setCoords();

                net.set({
                    width: net.width / viewportRatio.value * ratio,
                    height: net.height / viewportRatio.value * ratio,
                    left: net.left / viewportRatio.value * ratio,
                    top: net.top / viewportRatio.value * ratio,
                  }).setCoords();

                // net 수정 메커니즘도 추가 필요함

                console.log('========calculate done=========');

                console.log('canvas changed value - ', canvas.width, canvas.height);
                console.log('player1 changed value - ', player1.width / viewportRatio.value * ratio, player1.height / viewportRatio.value * ratio);
                console.log('player2 changed value - ', player2.width / viewportRatio.value * ratio, player2.height / viewportRatio.value * ratio);

                console.log('canvas set to unit value - ', canvas.width / ratio, canvas.height / ratio);
                console.log('player1 set to unit value - ', ratio, ' - width and height - ',  player1.width / viewportRatio.value * ratio / ratio, player1.height / viewportRatio.value * ratio / ratio);
                console.log('player2 set to unit value - ', ratio, ' - width and height - ',  player2.width / viewportRatio.value * ratio / ratio, player2.height / viewportRatio.value * ratio / ratio);

                console.log('========test done=========');        

                // player speed 반영 안되는 것 같음.

                ballVecXY.speed = ballVecXY.speed / viewportRatio.value * ratio;
                playerSpeed.value = playerSpeed.value / viewportRatio.value * ratio;
                viewportRatio.value = ratio;

                console.log('resizing 5');

                // canvas.discardActiveObject();

                canvas.renderAll();

                // canvas.calcOffset();
3
                console.log('resizing done');

            };

            // 기존 ratio 저장
            window.addEventListener('resize', handleResizeDebounce);

            return () => {
                window.removeEventListener('resize', handleResizeDebounce);
            };
        }

    }, [readyResize]);


    useEffect(() => {
        function handleKeyDown(e :any) {
                let speed = playerSpeed.value;
                if (e.key === 'ArrowUp') {
                    isArrowPressed.arrowUp = true;
                } 
                else if (e.key === 'ArrowDown') 
                {
                    isArrowPressed.arrowDown = true;
                }
        };
    
        function handleKeyUp(e :any) {
            if (e.key === "ArrowUp"){
                isArrowPressed.arrowUp = false;
            }
            else if (e.key === 'ArrowDown') {
                isArrowPressed.arrowDown = false;
            }
        }
    
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        }
    }, []);

    if (gameEnd === false)
    {
        return (
        
            <div>
                <canvas id="pongCanvas"></canvas>
                {initListener === true && (
                    <GameProfile
                        inGameData={inGameData}
                        score1={propscore.player1}
                        score2={propscore.player2}
                        isUserPL1={isUserPL1} />
                    )
                }
            </div>
        );
    }
    else if (gameEnd === true)
    {
        return (
                <GameEnd
                    endData={endData}
                    exitGame={exitGame} />
        );
    }
};
