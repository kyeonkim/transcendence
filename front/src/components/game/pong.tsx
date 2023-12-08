"use client"
import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useChatSocket } from '@/app/main_frame/socket_provider';
import { useCookies } from "next-client-cookies";

import  GameProfile  from "./gameProfile";
import  GameEnd from "./gameEnd";

// 새로 고침했을 때, 상위 컴포넌트에서 참가자 데이터를 받아오는가? 아니면 back에 요청을 하는가?

// const CANVAS_WIDTH = 1600;
// const CANVAS_HEIGHT = CANVAS_WIDTH / 16 * 9;
// const BOARD_HEIGHT = CANVAS_HEIGHT / 9;
// const BOARD_WIDTH = CANVAS_WIDTH;
// const BALL_SIZE = CANVAS_WIDTH / 50;
// const BAR_HEIGHT = CANVAS_HEIGHT / 5;
// const BAR_WIDTH = CANVAS_WIDTH / 60;

// function initialData() {
//     return (
//         {
//             p1: [BAR_WIDTH * 2 , CANVAS_HEIGHT / 2 - BAR_HEIGHT / 2],
//             p2: [initialSize.canvas_width - (BAR_WIDTH * 3), CANVAS_HEIGHT / 2 - BAR_HEIGHT / 2],
//             ball: [(initialSize.canvas_width/2) - BALL_SIZE / 2, (CANVAS_HEIGHT/2) - BALL_SIZE / 2],
//             score: [0, 0]
//         }
//     );
// };

export default function Pong (props :any){
    const socket = useChatSocket();
    const { rank, mode } = props;
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
    const [board, setBoard] = useState<fabric.Canvas>();
    const [ball, setBall] = useState<fabric.Rect>();
    const [player1, setPlayer1] = useState<fabric.Rect>();
    const [player2, setPlayer2] = useState<fabric.Rect>();
    
    // const [canvasSize, setCanvasSize] = useState();


    const [user, setUser] = useState<fabric.Rect>();
    const [enemy, setEnemy] = useState<fabric.Rect>();
    const [gameData, setGameData] = useState({
        startTime: 0,
    })

    const [user1Score, setUser1Score] = useState<fabric.Text>();
    const [user2Score, setUser2Score] = useState<fabric.Text>();
    const [scoreValue, setScoreValue] = useState({player1: 0, player2: 0});

    // const [ready, setReady] = useState(0);

    const [viewportUpdate, setViewportUpdate] = useState(false);
    const [initCanvas, setInitCanvas] = useState(false);
    const [readyResize, setReadyResize] = useState(false);
    const [initUserSetting, setInitUserSetting] = useState(false);
    const [initListener, setInitListener] = useState(false);
    const [initGame, setInitGame] = useState(false);

    const [playerSpeed, setPlayerSpeed] = useState(10);
    const [reverseSign, setReverseSign] = useState(1);

    const [ballVecXY, setBallVecXY] = useState({
        x: 3,
        y: 0
    });
    const [ballVecLen, setBallVecLen] = useState(Math.sqrt(Math.pow(6, 2) + Math.pow(6, 2)));

    const [ballSpeed, setBallSpeed] = useState(10);

    const [isArrowPressed, setIsArrowPressed] = useState({
        arrowUp: false,
        arrowDown: false
    });
    const [ballFix, setBallFix] = useState({newData: false, time: 0, enemy: {top:0, left:0}, ball: {top:0, left:0}, ballVecXY: {x:0, y:0}, score:{}});
    
    const   [lastRatio, setLastRatio] = useState(1.0);

    // viewportRatio 1 = 1600:900
    const   [viewportRatio, setViewportRatio] = useState(1.0);

	const   cookies = useCookies();
    const   myRef = useRef(null);
    
    
    console.log("in game rank : ", rank);
    console.log("in game mode : ", mode);

    mode = false;


    // 초기에 canvas 그리기 전에 width, height 설정 필요
    const handleInitialSize = () => {

        var screenWidth = 1440;
        var screenHeight = 720;

        // var screenWidth = myRef.current.offsetWidth;
        // var screenHeight = myRef.current.offsetHeight;
        

        // const computedStyle = window.getComputedStyle(myRef.current);

        // var screenWidth = parseFloat(computedStyle.width);
        // var screenHeight = parseFloat(computedStyle.height);

        console.log('initial container size - ', screenWidth, screenHeight);

        if (screenWidth > screenHeight)
        {

            const ratio = screenHeight / 900; // 0.6
        
            console.log('initial ratio (height fix) - ', ratio);

            setInitialSize({
                canvas_width: screenHeight / 9 * 16,
                canvas_height: screenHeight,
                board_width: screenHeight / 9 * 16,
                board_height: screenHeight / 9,
                ball_size: screenHeight / 9 * 16 / 50,
                bar_width: screenHeight / 9 * 16 / 60, // 16
                bar_height: screenHeight / 5 // 108
            });

            // 공 속도 조정
            setViewportRatio(ratio);
            setPlayerSpeed(playerSpeed * ratio);
            setBallSpeed(ballSpeed * ratio);
            setBallVecXY({x: ballVecXY.x * ratio, y: 0});
        }
        else
        {
            const ratio = screenWidth / 1600;

            console.log('initial ratio (width fix) - ', ratio);

            setInitialSize({
                canvas_width: screenWidth,
                canvas_height: screenWidth / 16 * 9,
                board_width: screenWidth,
                board_height: screenWidth / 16 * 9 / 9,
                ball_size: screenWidth / 50,
                bar_width: screenWidth / 60,
                bar_height: screenWidth / 16 * 9 / 5
            });

            setViewportRatio(ratio);
            setPlayerSpeed(playerSpeed * ratio);
            setBallSpeed(ballSpeed * ratio);
            setBallVecXY({x: ballVecXY.x * ratio, y: 0});
        }

    }

    useEffect(() => {
        console.log('myRef value is - ', myRef);
        if (myRef !== null)
        {
            handleInitialSize();
            setInitCanvas(true);
            // setReadyResize(true);
        }
    }, [myRef]);

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
        
            const scoreBoard = new fabric.Canvas("scoreBoard", {
                // scoreBoard 만들기
                height: initialSize.board_height,
                width: initialSize.board_width,
                backgroundColor: "white",
            })
        
            setCanvas(pongCanvas);
            setBoard(scoreBoard);
        
            // 백에서 데이터 가져오기
            // const data = initialData();
        
            // console.log(data);
        
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
            for (let i = 0; i <= initialSize.canvas_height; i += 50)
            {
                let net = new fabric.Rect({ 
                    left: (initialSize.canvas_width / 2) - 2,
                    top: i,
                    width: 4,
                    height: 30,
                    fill: "white",
                });
                pongCanvas.add(net);
            }
    
            // score 표기하기
            let user1_score = new fabric.Textbox(`${0}`,{
                width: initialSize.board_width / 8,
                left: initialSize.board_width / 2 - initialSize.board_width / 4,
                top: 0,
                textAlign: "left",
            });
            let user2_score = new fabric.Textbox(`${0}`,{
                width: initialSize.board_width / 8,
                left: initialSize.board_width / 2 + initialSize.board_width / 8,
                top: 0,
                textAlign: 'right',
            });
            
            let scoreBar = new fabric.Textbox('-', {
                width: initialSize.board_width / 8,
                left: initialSize.board_width / 4 * 2 - 5,
                top: 0,
                textAlign: 'left',
            })
    
            setUser1Score(user1_score);
            setUser2Score(user2_score);
            scoreBoard.add(user1_score);
            scoreBoard.add(user2_score);
            scoreBoard.add(scoreBar);
        
        
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

            setReadyResize(true);
            setInitUserSetting(true);
    
            return () => {
                console.log("disposal");
                pongCanvas.dispose();
                scoreBoard.dispose();
                console.log("disposal done");
            }
    
        }
       
    }, [initCanvas]);

    // useEffect(() => {
        
    //     // ratio 적용 가능할 것 같음.
    //     if (initCanvas === true)
    //     {
    //         const pongCanvas = new fabric.Canvas("pongCanvas", {
    //             // canvas 만들기
    //             height: CANVAS_HEIGHT,
    //             width: CANVAS_WIDTH,
    //             backgroundColor: "black",
    //         });
        
    //         const scoreBoard = new fabric.Canvas("scoreBoard", {
    //             // scoreBoard 만들기
    //             height: BOARD_HEIGHT,
    //             width: BOARD_WIDTH,
    //             backgroundColor: "white",
    //         })
        
    //         setCanvas(pongCanvas);
    //         setBoard(scoreBoard);
        
    //         // 백에서 데이터 가져오기
    //         const data = initialData();
        
    //         console.log(data);
        
    //         let tmp_user1 = new fabric.Rect({
    //             left: data.p1[0],
    //             top: data.p1[1],
    //             height: BAR_HEIGHT,
    //             width: BAR_WIDTH,
    //             fill: "white",
    //         });
        
    //         setPlayer1(tmp_user1);
    //         pongCanvas.add(tmp_user1);
        
    //         let tmp_user2 = new fabric.Rect({
    //             left: data.p2[0],
    //             top: data.p2[1],
    //             height: BAR_HEIGHT,
    //             width: BAR_WIDTH,
    //             fill: "white",
    //         });
        
    //         setPlayer2(tmp_user2);
    //         pongCanvas.add(tmp_user2);
        
    //         let circle = new fabric.Rect({
    //             left: data.ball[0],
    //             top: data.ball[1],
    //             height: BALL_SIZE,
    //             width: BALL_SIZE,
    //             fill: "white",
    //         });
    
    //         setBall(circle);
    //         pongCanvas.add(circle); // add 로 칸바스에 추가할 수 있음
        
    //         // net
    //         for (let i = 0; i <= CANVAS_HEIGHT; i += 50)
    //         {
    //             let net = new fabric.Rect({ 
    //                 left: (CANVAS_WIDTH / 2) - 2,
    //                 top: i,
    //                 width: 4,
    //                 height: 30,
    //                 fill: "white",
    //             });
    //             pongCanvas.add(net);
    //         }
    
    //         // score 표기하기
    //         let user1_score = new fabric.Textbox(`${data.score[0]}`,{
    //             width: BOARD_WIDTH / 8,
    //             left: BOARD_WIDTH / 2 - BOARD_WIDTH / 4,
    //             top: 0,
    //             textAlign: "left",
    //         });
    //         let user2_score = new fabric.Textbox(`${data.score[1]}`,{
    //             width: BOARD_WIDTH / 8,
    //             left: BOARD_WIDTH / 2 + BOARD_WIDTH / 8,
    //             top: 0,
    //             textAlign: 'right',
    //         });
            
    //         let scoreBar = new fabric.Textbox('-', {
    //             width: BOARD_WIDTH / 8,
    //             left: BOARD_WIDTH / 4 * 2 - 5,
    //             top: 0,
    //             textAlign: 'left',
    //         })
    
    //         setUser1Score(user1_score);
    //         setUser2Score(user2_score);
    //         scoreBoard.add(user1_score);
    //         scoreBoard.add(user2_score);
    //         scoreBoard.add(scoreBar);
        
        
    //         // Canvas 수정 막기
    //         pongCanvas.selection = false;
        
    //         pongCanvas.forEachObject(function (obj :any) {
    //             obj.selectable = false;
    //             obj.evented = false;
    //         });
    
    //         setReadyResize(true);
    //         setInitUserSetting(true);
    
    //         return () => {
    //             console.log("disposal");
    //             pongCanvas.dispose();
    //             scoreBoard.dispose();
    //             console.log("disposal done");
    //         }
    
    //     }
       
    // }, [initCanvas]);

    useEffect(() => {

        console.log("init player : ", player1, player2);
        console.log(`run pong`, user);

        if (initUserSetting === true)
        {
            const listenGameInit = (data :any) => {
                console.log('game-init');
    
                // 세팅할 때 자신, 상대 일부 데이터 필요함 (GameProfile 용도)
                console.log('ready data - ', data);
    
                gameData.startTime = Date.now();
                if (data.room.user1_id === Number(cookies.get('user_id')))
                {
                    setUser(player1);
                    setEnemy(player2);
                } else {
                    setUser(player2);
                    setEnemy(player1);
                }
                console.log("init player : ", player1, player2);
                console.log("init user : ", user);
                setInGameData(data.gameData);
                setInitListener(true);
            }
    
            socket.on(`game-init`, listenGameInit);
            socket.emit(`game-start`, {user_id: Number(cookies.get('user_id')), user_nickname: cookies.get('nick_name'), rank: true, game_mode: false});
    
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
                console.log(`game-user-position on: ${data.y * viewportRatio}`, enemy);
                console.log('game-user-position on - data : ', data);
                console.log('game-user-position on - viewportRatio : ', viewportRatio);
                enemy.top = data.y * viewportRatio;
            }
    
            const listenGameBallFix = (data :any) => {
                console.log(`game-ball-fix on`, data);
                ballFix.newData = true;

                ballFix.enemy = data.enemy;
                ballFix.ball = data.ball;
                ballFix.ballVecXY = data.ballVecXY;
                
                ballFix.score = data.score;

                // 넘겨 받은 enemy와 ball 등에 set이 안들어있다. 직접 수정해야하나?
                // ballFix.enemy = data.enemy.set({left: data.enemy.left * viewportRatio, top: data.enemy.top * viewportRatio});
                // ballFix.ball = data.ball.set({left: data.ball.left * viewportRatio, top: data.ball.top * viewportRatio});
                // ballFix.ballVecXY = data.ballVecXY.set({x: data.ballVecXY.x * viewportRatio, y: data.ballVecXY.y * viewportRatio});
        
                ballFix.enemy.top = ballFix.enemy.top * viewportRatio;
                ballFix.enemy.left = ballFix.enemy.left * viewportRatio;
                ballFix.ball.top = ballFix.ball.top * viewportRatio;
                ballFix.ball.left = ballFix.ball.left * viewportRatio;
                ballFix.ballVecXY.x = ballFix.ballVecXY.x * viewportRatio;
                ballFix.ballVecXY.y = ballFix.ballVecXY.y * viewportRatio;
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


    const calculateGameBallHit = () => {

        var newBall = ball;
        var newEnemy = user;

        var obj = {
            "time": Date.now(),
            enemy: newEnemy.set({left: user.left / viewportRatio, top: user.top / viewportRatio}),
            ball: newBall.set({left: ball.left / viewportRatio, top: ball.top / viewportRatio}),
            ballVecXY: {x: ballVecXY.x / viewportRatio, y:ballVecXY.y / viewportRatio},
            score: scoreValue,
        }
        return (obj);
    };


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
                    // 조건부 렌더링
            }

            let lastRequestId :number; 
    
            socket.on('game-end', listenGameEnd);
    
            console.log('before requestAnaimationFrame-drawPong begin');

            const drawPong = () => {
                
                // console.log('drawing data check - ', canvas, board, ball, user);

                // 플레이어 이동
                if (isArrowPressed.arrowUp === true && user.top > 0) {
                    user.set('top', Math.max(user.top - (reverseSign * playerSpeed), 0));
                    socket.emit(`game-user-position`, {y: user.top / viewportRatio});
                }
                if (isArrowPressed.arrowDown === true && user.top < canvas.height - user.height) {
                    user.set('top', Math.min(user.top + (reverseSign * playerSpeed), canvas.height - user.height));
                    socket.emit(`game-user-position`, {y: user.top / viewportRatio});
                }
                // 공 이동
                ball.set('left', ball.left + ballVecXY.x);
                ball.set('top', ball.top + ballVecXY.y);
        
                // game-ball-fix - kyeonkim
                if (ballFix.newData === true)
                {
                    console.log('ballFix data - ', ballFix);
                    
                    ball.set(`left`, ballFix.ball.left);
                    ball.set(`top`, ballFix.ball.top);
                    ballVecXY.x = ballFix.ballVecXY.x;
                    ballVecXY.y = ballFix.ballVecXY.y;
                    enemy.set('left', ballFix.enemy.left);
                    enemy.set('top', ballFix.enemy.top);
                    scoreValue.player1 = ballFix.score.player1;
                    scoreValue.player2 = ballFix.score.player2;
                    user1Score.set("text",`${scoreValue.player1}`);
                    user2Score.set("text",`${scoreValue.player2}`);
                    ballFix.newData = false;
                }
                // 공 화면 위-아래 튕기기
                if (ball.top <= 0 || ball.top >= canvas.height - ball.width)
                {
                    ballVecXY.y = -ballVecXY.y;
                    // game-ball-hit event - kyeonkim
                }
                // 공 화면 바깥에 닿았는지 확인
                if (ball.left + ball.width  <= 0)
                {
                    console.log('ball out - left');
                    ball.set({ left: (canvas.width / 2 - ball.width / 2), top: (canvas.height / 2 - ball.width / 2)});
                    ballVecXY.x = -ballVecXY.x;
                    // game-ball-hit event - kyeonkim
        
                    scoreValue.player2++;
                    user2Score.set("text",`${scoreValue.player2}`);
                    console.log("scoreValue.player2 : ", scoreValue.player2);
                    // 계수 반영해서 보내기
                    // socket.emit('game-ball-hit', calculateGameBallHit());
                    socket.emit('game-ball-hit', {
                        time: Date.now(),
                        enemy: {left: user.left / viewportRatio, top: user.top / viewportRatio},
                        ball: {left: ball.left / viewportRatio, top: ball.top / viewportRatio},
                        ballVecXY: {x: ballVecXY.x / viewportRatio, y:ballVecXY.y / viewportRatio},
                        score: scoreValue});
                    // ball.set({left: ball.left * viewportRatio, top: ball.top * viewportRatio});
                    // user.set({left: user.left * viewportRatio, top: user.top * viewportRatio});
                    // scoreValue.player2++;
                    // socket.emit('game-ball-hit', {time: Date.now(), enemy: user, ball: ball, ballVecXY: ballVecXY, score: scoreValue});
                    // user2Score.set("text",`${scoreValue.player2}`);
                } 
                else if (ball.left >= canvas.width)
                {
                    console.log('ball out - right');
                    ball.set({ left: canvas.width / 2 - ball.width / 2, top: canvas.height / 2 - ball.width / 2});
                    ballVecXY.x = -ballVecXY.x;
                    // game-ball-hit event - kyeonkim
                    scoreValue.player1++;
                    // 계수 반영해서 보내기

                    // socket.emit('game-ball-hit', calculateGameBallHit());
                    // ball.set({left: ball.left * viewportRatio, top: ball.top * viewportRatio});
                    // user.set({left: user.left * viewportRatio, top: user.top * viewportRatio});
                    socket.emit('game-ball-hit', {
                        time: Date.now(),
                        enemy: {left: user.left / viewportRatio, top: user.top / viewportRatio},
                        ball: {left: ball.left / viewportRatio, top: ball.top / viewportRatio},
                        ballVecXY: {x: ballVecXY.x / viewportRatio, y:ballVecXY.y / viewportRatio},
                        score: scoreValue
                    });
                    user1Score.set("text",`${scoreValue.player1}`);
                }
                else
                {
                    // 공 플레이어1 에 닿는지 확인
                    if (ballVecXY.x < 0 &&
                        ball.left <= player1.left + player1.width &&
                        ball.left >= player1.left &&
                        ball.top + ball.width >= player1.top &&
                        ball.top <= player1.top + player1.height)
                    {
                        // console.log('ball hit to player1');
                        // console.log('palyer1 position - ', user.left / viewportRatio, user.top /viewportRatio);
                        const angle = (ball.top - (player1.top + (player1.height / 2)))/(player1.height / 2);
                        ballVecXY.x = Math.cos(Math.PI/4 * angle) * ballSpeed;
                        ballVecXY.x = ballVecXY.x > 0 ? ballVecXY.x : -ballVecXY.x;
                        ballVecXY.y = Math.sin(Math.PI/4 * angle) * reverseSign * ballSpeed;

                        // game-ball-hit event - kyeonkim
                        // console.log('ballVecXY.x - ', ballVecXY.x, ' and ballVecXY.y - ', ballVecXY.y);
                        // user === player1 > send
                        if (user === player1)
                        {
                            console.log('player1 now hit - ', viewportRatio);
                            console.log('player1 position - ', user.left / viewportRatio, user.top /viewportRatio);
                            console.log('player1 position / viewport - ', user.top / viewportRatio);
                            
                            socket.emit('game-ball-hit', calculateGameBallHit());
                            
                            ball.set({left: ball.left * viewportRatio, top: ball.top * viewportRatio});
                            user.set({left: user.left * viewportRatio, top: user.top * viewportRatio});

                            // socket.emit('game-ball-hit', {
                            //     time: Date.now(),
                            //     enemy: user.set({left: user.left / viewportRatio, top: user.top / viewportRatio}),
                            //     ball: ball.set({left: ball.left / viewportRatio, top: ball.top / viewportRatio}),
                            //     ballVecXY: {x: ballVecXY.x / viewportRatio, y:ballVecXY.y / viewportRatio},
                            //     score: scoreValue});
                        }
                    }
                    // 공 플레이어2 에 닿는지 확인
                    else if (
                        ballVecXY.x > 0 &&
                        ball.left + ball.width >= player2.left &&
                        ball.left + ball.width <= player2.left + player2.width &&
                        ball.top + ball.width >= player2.top &&
                        ball.top <= player2.top + player2.height)
                    {
                        // console.log('ball hit to player2');
                        // console.log('palyer2 position - ', user.left / viewportRatio, user.top /viewportRatio);
                        const angle = (ball.top - (player2.top + (player2.height / 2)))/(player2.height / 2);
                        ballVecXY.x = Math.cos(Math.PI/4 * angle) * ballSpeed;
                        ballVecXY.x = ballVecXY.x > 0 ? -ballVecXY.x : ballVecXY.x;
                        ballVecXY.y = Math.sin(Math.PI/4 * angle) * reverseSign * ballSpeed;
                        // user === player2 > send
                        // game-ball-hit event - kyeonkim
                        if (user === player2)
                        {
                            console.log('player2 now hit - ', viewportRatio);
                            console.log('player2 position - ', user.left / viewportRatio, user.top /viewportRatio);
                            console.log('player2 position / viewport - ', user.top / viewportRatio);

                            socket.emit('game-ball-hit', calculateGameBallHit());

                            ball.set({left: ball.left * viewportRatio, top: ball.top * viewportRatio});
                            user.set({left: user.left * viewportRatio, top: user.top * viewportRatio});

                            // socket.emit('game-ball-hit', {
                            //     time: Date.now(),
                            //     enemy: user.set({left: user.left / viewportRatio, top: user.top / viewportRatio}),
                            //     ball: ball.set({left: ball.left / viewportRatio, top: ball.top / viewportRatio}),
                            //     ballVecXY: {x: ballVecXY.x / viewportRatio, y:ballVecXY.y / viewportRatio},
                            //     score: scoreValue});
                        }
                    }
                }
                // 다시 그리기
                canvas.renderAll();
                board.renderAll();
                // user1Score.renderAll();
                // user2Score.renderAll();
    
                lastRequestId = requestAnimationFrame(drawPong);
    
            };
            drawPong();
        
            return () => {
                console.log('before pong component unmount - cancelanimationframe');
                socket.off('game-end', listenGameEnd);
                cancelAnimationFrame(lastRequestId);
                
            };
        }

    }, [initGame])

    // 화면 크기가 변하면 canvas 안에 있는 값들도 재설정
    useEffect(() => {
        
        if (readyResize === true)
        {
            // resize 관련 함수
            const handleResize = () => {
                console.log("handleResize!!!");
                var screenWidth = myRef.current.offsetWidth;
                var screenHeight = myRef.current.offsetHeight;
                    
                // const computedStyle = window.getComputedStyle(myRef.current);

                // var screenWidth = parseFloat(computedStyle.width);
                // var screenHeight = parseFloat(computedStyle.height);

                if (screenWidth > screenHeight)
                {
                    canvas.setDimensions({
                        width: screenHeight / 9 * 16,
                        height: screenHeight
                    });
                    board.setDimensions({
                        width: screenHeight / 9 * 16,
                        height: screenHeight
                    });

                    const ratio = screenHeight / 900;
                    setBallSpeed(ballSpeed / viewportRatio * ratio);
                    setPlayerSpeed(playerSpeed / viewportRatio * ratio);
                    setBallVecXY({x: ballVecXY.x / viewportRatio * ratio, y: ballVecXY.y / viewportRatio * ratio});
                    setViewportRatio(ratio);
                }
                else
                {
                    canvas.setDimensions({
                        width: screenWidth,
                        height: screenWidth / 16 * 9
                    });
                    board.setDimensions({
                        width: screenHeight / 16 * 9,
                        height: screenHeight
                    });

                    const ratio = screenWidth / 1600;
                    setBallSpeed(ballSpeed / viewportRatio * ratio);
                    setPlayerSpeed(playerSpeed / viewportRatio * ratio);
                    setBallVecXY({x: ballVecXY.x / viewportRatio * ratio, y: ballVecXY.y / viewportRatio * ratio});
                    setViewportRatio(ratio);
                }


            };

            // 기존 ratio 저장
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }

    }, [readyResize]);


    useEffect(() => {
        function handleKeyDown(e :any) {
                let speed = playerSpeed;
                if (e.key === 'ArrowUp') {
                    // console.log('Arrow up');
                    isArrowPressed.arrowUp = true;
                    // console.log(`allow up : ${isArrowPressed.arrowUp}`);
                    // speed = Math.max(speed - 0.1, -20);
                } 
                else if (e.key === 'ArrowDown') 
                {
                    // console.log('Arrow down');
                    isArrowPressed.arrowDown = true;
                    // console.log(`allow down : ${isArrowPressed.arrowDown}`);
                    // speed = Math.min(speed + 0.1, 20);
                }
            // setPlayer1Speed(speed);
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

    /*
    useEffect(() => {

        function handleKeyDown(e :any) {

            if (e.repeat === true)
            {
                let speed = player1Speed;
                if (e.key === 'ArrowUp')
                {
                    console.log('pressed');
                    if (speed === 0)
                        speed += -0.1;
                    else
                        speed += speed;
                    if (speed <= -20)
                        speed = -20;
                    // socket으로 이벤트 보내기
                    if (player1.top > 0)
                    {
                        if (player1.top < 20)
                        {
                            player1.set('top', player1.top - player1.top);
                        }
                        else
                        {
                            player1.set('top', player1.top + speed);
                        }
                    }
                }
                else if (e.key === 'ArrowDown')
                {
                    console.log("pressed");
                    if (speed === 0)
                        speed += 0.1;
                    else
                        speed += speed;
                    if (speed >= 20)
                        speed = 20;
                    // socket으로 이벤트 보내기
                    if (player1.top < 340)
                    {
                        if (player1.top > 340 - speed)
                        {
                            player1.set('top', player1.top + (340 - speed - player1.top));
                        }
                        else
                        {
                            player1.set('top', player1.top - speed);
                        }
                    }
                }
                setPlayer1Speed(speed);
            }
            else
            {
                setIsArrowPressed((prev) => ({
                    ...prev,
                    [e.code]: true,
                  }));
            }

        };
    
        function handleKeyUp(e :any) {
    
            if (e.key === "ArrowUp" || e.key === "ArrowDown")
            {
                console.log('keyuped');
                setPlayer1Speed(0);
                setIsArrowPressed((prev) => ({
                    ...prev,
                    [e.code]: false,
                    }));
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        }

    }, [player1Speed, player1])
    */
    /*
    useEffect(() => {

        let animationFrameId :any;
    
        const checkKeyState = () => {
            if (isArrowPressed.ArrowUp) {
                console.log('repeated');
                // if (player_speed === 0)
                //   player_speed += -0.1;
                // else
                //   player_speed += player_speed 
                // if (player_speed >= -20)
                //     player_speed = -20;
                // // socket으로 이벤트 보내기
                // if (player1.top > 0)
                // {
                //     if (player1.top < 20)
                //     {
                //         player1.set('top', player1.top - player1.top);
                //     }
                //     else
                //     {
                //         player1.set('top', player1.top + player_speed);
                //     }
                // }
                canvas.renderAll();
            }
            else if (isArrowPressed.ArrowDown)
            {
                console.log("repeated");
                // if (player_speed === 0)
                //     player_speed += 0.1;
                // else
                //     player_speed += player_speed 
                // if (player_speed >= 20)
                //     player_speed = 20;
                // // socket으로 이벤트 보내기
                // if (player1.top < 340)
                // {
                //     if (player1.top > 340 - player_speed)
                //     {
                //         player1.set('top', player1.top + (340 - player_speed - player1.top));
                //     }
                //     else
                //     {
                //         player1.set('top', player1.top + player_speed);
                //     }
                // }
                canvas.renderAll();
            }
            else
            {
                cancelAnimationFrame(animationFrameId);
            }
            animationFrameId = requestAnimationFrame(checkKeyState);
        }

        checkKeyState();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };

    }, [isArrowPressed]);
    */


    if (gameEnd === false)
    {
        return (
        
            <div ref={myRef}>
                <canvas id="pongCanvas"></canvas>
                <canvas id="scoreBoard"></canvas>
                {inGameData && (
                    <GameProfile
                        inGameData={inGameData}/>
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
