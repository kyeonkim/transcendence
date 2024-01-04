"use client"
import { useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { useChatSocket } from '@/app/main_frame/socket_provider';
import { useStatusContext } from "@/app/main_frame/status_context";
import { useUserDataContext } from '@/app/main_frame/user_data_context';
import { useMainBoxContext } from '@/app/main_frame/mainbox_context';


import  GameProfile  from "./gameProfile";
import  GameEnd from "./gameEnd";

import styles from './pong.module.css';

export default function Pong (props :any){
    const socket = useChatSocket();
    const { data, exitGame  } = props;
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
        drawTime: 0,
    })

    const [scoreValue, setScoreValue] = useState({player1: 0, player2: 0});
    const [propscore, setScore] = useState({player1: 0, player2: 0});
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

    const [isArrowPressed, setIsArrowPressed] = useState({
        arrowUp: false,
        arrowDown: false
    });
    const [ballFix, setBallFix] = useState({newData: false, time: 0, enemy: {top:0, left:0}, ball: {top:0, left:0}, ballVecXY: {x:0, y:0, speed:0}, score:{player1:0, player2:0}});
    
    // viewportRatio 1 = 1600:900
    const   [viewportRatio, setViewportRatio] = useState({value: 1.0});

    const   containerRef = props.containerRef;
    const { status, setStatus } = useStatusContext();
    const { nickname, user_id } = useUserDataContext(); 
    const { setGameState } = useMainBoxContext();

    const updateStatus = useCallback(
        (newStatus :string) => {
            // console.log('updateMyStatus - ', newStatus);
            setStatus(newStatus);
        },
        [setStatus]
      );


    const handleInitialSize = () => {


        let screenWidth = containerRef.current.offsetWidth * 0.98;
        let screenHeight = containerRef.current.offsetHeight * 0.59;
        
        let ratio;
        let fixWidth = false;


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

            let newHeight = screenWidth / 16 * 9;

            setInitialSize({
                canvas_width: screenWidth,
                canvas_height: newHeight,
                board_width: screenWidth,
                board_height: newHeight / 9,
                ball_size: screenWidth / 50,
                bar_width: screenWidth / 60,
                bar_height: newHeight / 5
            });
        }
        else
        {
            ratio = screenHeight / 900;

            let newWidth = screenHeight / 9 * 16;

            setInitialSize({
                canvas_width: newWidth,
                canvas_height: screenHeight,
                board_width: newWidth,
                board_height: screenHeight / 9,
                ball_size: newWidth / 50,
                bar_width: newWidth / 60, // 16
                bar_height: screenHeight / 5 // 108
            });
        }

        viewportRatio.value = ratio;
        playerSpeed.value *= ratio;
        ballVecXY.speed *= ratio;
    }

    useEffect(() => {

        if (containerRef !== null)
        {
            handleInitialSize();
            setInitCanvas(true);

        }

    }, [containerRef]);

    useEffect(() => {
        
        if (initCanvas === true)
        {
            const pongCanvas = new fabric.Canvas("pongCanvas", {
                height: initialSize.canvas_height,
                width: initialSize.canvas_width,
                backgroundColor: "black",
                containerClass: "canvasCss"
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
            pongCanvas.add(circle); 
        

            let net = new fabric.Rect({ 
                left: (initialSize.canvas_width / 2) - initialSize.canvas_width / 400 / 2,
                top: 0,
                width: initialSize.canvas_width / 400,
                height: initialSize.canvas_height,
                fill: "white",
            });
            pongCanvas.add(net);
            setNet(net);

            pongCanvas.selection = false;
        
            pongCanvas.forEachObject(function (obj :any) {
                obj.selectable = false;
                obj.evented = false;
            });

            
            if (data.room.game_mode === true)
            {
                setReverseSign(-1);
            }

            setInitUserSetting(true);
    
            return () => {
                // pongCanvas.dispose();
            }
    
        }
       
    }, [initCanvas]);


    useEffect(() => {
        if (initUserSetting === true)
        {

            const listenGameInit = (data :any) => {
                gameData.startTime = Date.now();
                // console.log('game data==',data);
                
                if (data.room.user1_id === user_id)
                {
                    setUser(player1);
                    setEnemy(player2);
                    setIsUserPL1(true);
                } else {
                    setUser(player2);
                    setEnemy(player1);
                    setIsUserPL1(false);
                }
                setInGameData(data.room);
                setInitListener(true);
                setInitGame(true);
                updateStatus('ingame');
            }
    
            setGameState(true);
            setReadyResize(true);

            socket.on(`game-init`, listenGameInit);
            // console.log('game-mode : ', data.room.game_mode);
            socket.emit(`game-start`, {user_id: user_id, user_nickname: nickname, game_mode: data.room.game_mode});

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    // console.log('pong unmount');
                    socket.emit('game-force-end');
                    // updateStatus('online');
                } else {
                //   console.log("re on")
                }
              });

            return () => {
                // canvas.clearRect(0,0,canvas.height, canvas.width);
                socket.emit('game-force-end');
                socket.off('game-init', listenGameInit);
                document.removeEventListener('visivilitychange', () => {});
            }
        }
      
    }, [initUserSetting])

    useEffect(() => {


        if (initListener === true)
        {

            const listenGameUserPosition = (data :any) => {
                enemy.top = data.y * viewportRatio.value;
            }
    
            const listenGameBallFix = (data :any) => {
                ballFix.newData = true;

                ballFix.enemy = data.enemy;
                ballFix.ball = data.ball;
                ballFix.ballVecXY = data.ballVecXY;
                
                ballFix.score = data.score;
                setScore({player1: data.score.player1, player2: data.score.player2})

                ballFix.enemy.top = ballFix.enemy.top * viewportRatio.value;
                ballFix.enemy.left = ballFix.enemy.left * viewportRatio.value;
                ballFix.ball.top = ballFix.ball.top * viewportRatio.value;
                ballFix.ball.left = ballFix.ball.left * viewportRatio.value;

                ballFix.ballVecXY.speed *= viewportRatio.value;
            }
            
            socket.on(`game-user-position`, listenGameUserPosition);
    
            socket.on('game-ball-fix', listenGameBallFix);
    
            // setInitGame(true);

            return () => {
                socket.off('game-user-position', listenGameUserPosition);
                socket.off('game-ball-fix', listenGameBallFix);
            };
        }

    }, [initListener]);    

    useEffect(() => {

        if (initGame === true)
        {
            const listenGameEnd = (data :any) => {
                // console.log ('pong listener end ');
                cancelAnimationFrame(lastRequestId);

                // console.log(`unmount`, canvas);
                setEndData(data.gameData);
                setGameEnd(true);
                updateStatus('online');
                setGameState(false);

            }

            // const eventPopState = (event :any) => {
            //     cancelAnimationFrame(lastRequestId);
            //     updateStatus('online');
            //     setGameState(false);
            // }

            // window.addEventListener('popstate', eventPopState);

            let lastRequestId :number; 

            socket.on('game-end', listenGameEnd);

            socket.emit('status', { user_id: user_id, status: status });
    
            const drawPong = () => {
                if (gameData.drawTime === 0)
                    gameData.drawTime = Date.now();
                const drawSpeed = (Date.now() - gameData.drawTime) / 14;
                if (reverseSign === 1)
                {
                    if (isArrowPressed.arrowUp === true && user.top > 0) 
                    {
                        user.set('top', Math.max(user.top - (playerSpeed.value * drawSpeed), 0));
                        socket.emit(`game-user-position`, {y: user.top / viewportRatio.value});
                    }
                    if (isArrowPressed.arrowDown === true && user.top < canvas.height - user.height)
                    {
                        user.set('top', Math.min(user.top + (playerSpeed.value * drawSpeed), canvas.height - user.height));
                        socket.emit(`game-user-position`, {y: user.top / viewportRatio.value});
                    }
                }
                else if (reverseSign === -1)
                {
                    if (isArrowPressed.arrowDown === true && user.top > 0)
                    {
                        user.set('top', Math.max(user.top - (playerSpeed.value * drawSpeed), 0));
                        socket.emit(`game-user-position`, {y: user.top / viewportRatio.value});
                    }
                    if (isArrowPressed.arrowUp === true && user.top < canvas.height - user.height)
                    {
                        user.set('top', Math.min(user.top + (playerSpeed.value * drawSpeed), canvas.height - user.height));
                        socket.emit(`game-user-position`, {y: user.top / viewportRatio.value});
                    }
                }
                ball.set('left', ball.left + (ballVecXY.x * (ballVecXY.speed * drawSpeed )));
                ball.set('top', ball.top + (ballVecXY.y * (ballVecXY.speed * drawSpeed)));

                if (ballFix.newData === true)
                {
                    ball.set(`left`, ballFix.ball.left);
                    ball.set(`top`, ballFix.ball.top);
                    ballVecXY.x = ballFix.ballVecXY.x;
                    ballVecXY.y = ballFix.ballVecXY.y;
                    ballVecXY.speed = ballFix.ballVecXY.speed;
                    enemy.set('left', ballFix.enemy.left);
                    enemy.set('top', ballFix.enemy.top);
                    scoreValue.player1 = ballFix.score.player1;
                    scoreValue.player2 = ballFix.score.player2;
                    ballFix.newData = false;
                }

                if (ball.top <= 0 || ball.top >= canvas.height - ball.width)
                {
                    if (ball.top <= 0)
                        ball.top = 0;
                    else
                        ball.top = canvas.height - ball.width;
                    ballVecXY.y = -ballVecXY.y;
                }

                if (ball.left + ball.width  <= 0 && user === player1)
                {

                    ball.set({ left: (canvas.width / 2 - ball.width / 2), top: (canvas.height / 2 - ball.width / 2)});
                    ballVecXY.x = -ballVecXY.x;
                    ballVecXY.speed = 10 * viewportRatio.value;
        
                    scoreValue.player2++;

                    setScore({player1: scoreValue.player1, player2: scoreValue.player2});

                    socket.emit('game-ball-hit', {
                        time: Date.now(),
                        enemy: {left: user.left / viewportRatio.value, top: user.top / viewportRatio.value},
                        ball: {left: ball.left / viewportRatio.value, top: ball.top / viewportRatio.value},
                        ballVecXY: {x: ballVecXY.x, y:ballVecXY.y, speed: ballVecXY.speed / viewportRatio.value},
                        score: {player1: scoreValue.player1, player2: scoreValue.player2}
                    });

                } 
                else if (ball.left >= canvas.width && user === player2)
                {
                    ball.set({ left: canvas.width / 2 - ball.width / 2, top: canvas.height / 2 - ball.width / 2});
                    ballVecXY.x = -ballVecXY.x;
                    ballVecXY.speed = 10 * viewportRatio.value;

                    scoreValue.player1++;

                    setScore({player1: scoreValue.player1, player2: scoreValue.player2});

                    socket.emit('game-ball-hit', {
                        time: Date.now(),
                        enemy: {left: user.left / viewportRatio.value, top: user.top / viewportRatio.value},
                        ball: {left: ball.left / viewportRatio.value, top: ball.top / viewportRatio.value},
                        ballVecXY: {x: ballVecXY.x, y:ballVecXY.y, speed: ballVecXY.speed / viewportRatio.value},
                        score: {player1: scoreValue.player1, player2: scoreValue.player2}
                    });

                }
                else
                {
                    if (
                        ballVecXY.x < 0 &&
                        ball.left <= player1.left + player1.width &&
                        ball.left >= player1.left &&
                        ball.top + ball.width >= player1.top &&
                        ball.top <= player1.top + player1.height)
                    {
                        if (user !== player1)
                        {
                            ballVecXY.x = 0;
                            ballVecXY.y = 0;
                        }
                        else
                        {
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
    
                            ballVecXY.x = Math.cos(Math.PI/4 * angle);
                            ballVecXY.x = ballVecXY.x > 0 ? ballVecXY.x : -ballVecXY.x;
                            ballVecXY.y = Math.sin(Math.PI/4 * angle) * reverseSign;
    
    

                            socket.emit('game-ball-hit', {
                                time: Date.now(),
                                enemy: {left: user.left / viewportRatio.value, top: user.top / viewportRatio.value},
                                ball: {left: ball.left / viewportRatio.value, top: ball.top / viewportRatio.value},
                                ballVecXY: {x: ballVecXY.x, y:ballVecXY.y, speed: ballVecXY.speed / viewportRatio.value},
                                score: {player1: scoreValue.player1, player2: scoreValue.player2}
                            });
                        }
                    }
                    else if (
                        ballVecXY.x > 0 &&
                        ball.left + ball.width >= player2.left &&
                        ball.left + ball.width <= player2.left + player2.width &&
                        ball.top + ball.width >= player2.top &&
                        ball.top <= player2.top + player2.height)
                    {
                        if (user !== player2)
                        {
                            ballVecXY.x = 0;
                            ballVecXY.y = 0;
                        } else {
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
    
                            ballVecXY.x = Math.cos(Math.PI/4 * angle);
                            ballVecXY.x = ballVecXY.x > 0 ? -ballVecXY.x : ballVecXY.x;
                            ballVecXY.y = Math.sin(Math.PI/4 * angle) * reverseSign;
    

                            socket.emit('game-ball-hit', {
                                time: Date.now(),
                                enemy: {left: user.left / viewportRatio.value, top: user.top / viewportRatio.value},
                                ball: {left: ball.left / viewportRatio.value, top: ball.top / viewportRatio.value},
                                ballVecXY: {x: ballVecXY.x, y:ballVecXY.y, speed: ballVecXY.speed/viewportRatio.value},
                                score: {player1: scoreValue.player1, player2: scoreValue.player2}
                            });
                        }
                    }
                }
                    gameData.drawTime = Date.now();
                    canvas.renderAll();
    
                lastRequestId = requestAnimationFrame(drawPong);
    
            };

            const id = setTimeout(() => {drawPong()
            }, 3000);

            return () => {  
                // window.removeEventListener('popstate', eventPopState);
                clearTimeout(id);
                // console.log('pong component unmount');
                socket.off('game-end', listenGameEnd);
                cancelAnimationFrame(lastRequestId);
                // console.log(`unmount`, canvas);
                canvas.dispose();
                updateStatus('online');
                setGameState(false);
                setGameEnd(true);
            };
        }

    }, [initGame]);

    useEffect(() => {
        
        if (readyResize === true)
        {
            let resizeTimer :any;

            const handleResizeDebounce = () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(handleResize, 500);
            }

            const handleResize = () => {

                let screenWidth = containerRef.current.offsetWidth * 0.98;
                let screenHeight = containerRef.current.offsetHeight * 0.59;
                
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

                    canvas.setWidth(screenWidth);
                    canvas.setHeight(screenWidth / 16 * 9);

                    ratio = screenWidth / 1600;
                }
                else
                {

                    canvas.setWidth(screenHeight / 9 * 16);
                    canvas.setHeight(screenHeight);


                    ratio = screenHeight / 900;

                }

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

                ballVecXY.speed = ballVecXY.speed / viewportRatio.value * ratio;
                playerSpeed.value = playerSpeed.value / viewportRatio.value * ratio;
                viewportRatio.value = ratio;
                
                
                canvas.renderAll();

            };

            window.addEventListener('resize', handleResizeDebounce);

            return () => {
                window.removeEventListener('resize', handleResizeDebounce);
            };
        }

    }, [readyResize]);


    useEffect(() => {
        function handleKeyDown(e :any) {
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
                <div className={styles.pongCanvas}>
                    <canvas id="pongCanvas">
                    </canvas>
                </div>
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
