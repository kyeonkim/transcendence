"use client"
import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useChatSocket } from '@/app/main_frame/socket_provider';
import { useCookies } from "next-client-cookies";

import  GameProfile  from "./gameProfile";
import  GameEnd from "./gameEnd";

// 새로 고침했을 때, 상위 컴포넌트에서 참가자 데이터를 받아오는가? 아니면 back에 요청을 하는가?

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = CANVAS_WIDTH / 16 * 9;
const BOARD_HEIGHT = CANVAS_HEIGHT / 9;
const BOARD_WIDTH = CANVAS_WIDTH;
const BALL_SIZE = CANVAS_WIDTH / 50;
const BAR_HEIGHT = CANVAS_HEIGHT / 5;
const BAR_WIDTH = CANVAS_WIDTH / 60;

function initialData() {
    return (
        {
            p1: [BAR_WIDTH * 2 , CANVAS_HEIGHT / 2 - BAR_HEIGHT / 2],
            p2: [CANVAS_WIDTH - (BAR_WIDTH * 3), CANVAS_HEIGHT / 2 - BAR_HEIGHT / 2],
            ball: [(CANVAS_WIDTH/2) - BALL_SIZE / 2, (CANVAS_HEIGHT/2) - BALL_SIZE / 2],
            score: [0, 0]
        }
    );
};

export default function Pong (props :any){
    const socket = useChatSocket();

    const [gameEnd, setGameEnd] = useState(false);
    const [endData, setEndData] = useState({});

    const [inGameData, setInGameData] = useState({});

    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [board, setBoard] = useState<fabric.Canvas>();
    const [ball, setBall] = useState<fabric.Rect>();
    const [player1, setPlayer1] = useState<fabric.Rect>();
    const [player2, setPlayer2] = useState<fabric.Rect>();
    
    const [user, setUser] = useState<fabric.Rect>();
    const [enemy, setEnemy] = useState<fabric.Rect>();
    const [gameData, setGameData] = useState({
        startTime: 0,
    })

    const [user1Score, setUser1Score] = useState<fabric.Text>();
    const [user2Score, setUser2Score] = useState<fabric.Text>();
    const [scoreValue, setScoreValue] = useState({player1: 0, player2: 0});
    const [ready, setReady] = useState(0);

    const [player1Speed, setPlayer1Speed] = useState(0);

    const [ballVecXY, setBallVecXY] = useState({
        x: 10,
        y: 0
    });
    const [ballVecLen, setBallVecLen] = useState(Math.sqrt(Math.pow(6, 2) + Math.pow(6, 2)));

    const [ballMaxSpeed, setBallMaxSpeed] = useState(16);
    const [ballMinSpeed, setBallMinSpeed] = useState(16);
    const [ballSpeed, setBallSpeed] = useState(16);

    const [isArrowPressed, setIsArrowPressed] = useState({
        arrowUp: false,
        arrowDown: false
    });
    const [ballFix, setBallFix] = useState({newData: false, time: 0, enemy: {}, ball: {}, ballVecXY: {}, score:{}});
    // const [isArrowUp, setIsArrowUp] = useState(0);
    // const [isArrowDown, setIsArrowDown] = useState(0);

    // const arrowupRef = useRef(isArrowUp);
    // const arrowdownRef = useRef(isArrowDown);
	const   cookies = useCookies();
    const   score1Ref = useRef(user1Score);
    const   score2Ref = useRef(user2Score);

    const handleGameEnd = () => {
        console.log('end? is it?');
    }

    const initPong = () => {
        // 초기 canvas 세팅

        const pongCanvas = new fabric.Canvas("pongCanvas", {
            // canvas 만들기
            height: CANVAS_HEIGHT,
            width: CANVAS_WIDTH,
            backgroundColor: "black",
        });
    
        const scoreBoard = new fabric.Canvas("scoreBoard", {
            // scoreBoard 만들기
            height: BOARD_HEIGHT,
            width: BOARD_WIDTH,
            backgroundColor: "white",
        })
    
        setCanvas(pongCanvas);
        setBoard(scoreBoard);
    
        // 백에서 데이터 가져오기
        const data = initialData();
    
        console.log(data);
    
        let tmp_user1 = new fabric.Rect({
            left: data.p1[0],
            top: data.p1[1],
            height: BAR_HEIGHT,
            width: BAR_WIDTH,
            fill: "white",
        });
    
        setPlayer1(tmp_user1);
        pongCanvas.add(tmp_user1);
    
        let tmp_user2 = new fabric.Rect({
            left: data.p2[0],
            top: data.p2[1],
            height: BAR_HEIGHT,
            width: BAR_WIDTH,
            fill: "white",
        });
    
        setPlayer2(tmp_user2);
        pongCanvas.add(tmp_user2);
    
        let circle = new fabric.Rect({
            left: data.ball[0],
            top: data.ball[1],
            height: BALL_SIZE,
            width: BALL_SIZE,
            fill: "white",
        });

        setBall(circle);
        pongCanvas.add(circle); // add 로 칸바스에 추가할 수 있음
    
        // net
        for (let i = 0; i <= CANVAS_HEIGHT; i += 50)
        {
            let net = new fabric.Rect({ 
                left: (CANVAS_WIDTH / 2) - 2,
                top: i,
                width: 4,
                height: 30,
                fill: "white",
            });
            pongCanvas.add(net);
        }

        // score 표기하기
        let user1_score = new fabric.Textbox(`${data.score[0]}`,{
            width: BOARD_WIDTH / 8,
            left: BOARD_WIDTH / 2 - BOARD_WIDTH / 4,
            top: 0,
			textAlign: "left",
        });
        let user2_score = new fabric.Textbox(`${data.score[1]}`,{
            width: BOARD_WIDTH / 8,
            left: BOARD_WIDTH / 2 + BOARD_WIDTH / 8,
            top: 0,
            textAlign: 'right',
        });
        
        let scoreBar = new fabric.Textbox('-', {
            width: BOARD_WIDTH / 8,
            left: BOARD_WIDTH / 4 * 2 - 5,
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

        return () => {
            console.log("disposal");
            pongCanvas.dispose();
            scoreBoard.dispose();
            console.log("disposal done");
        }
    };

    // function drawPong() {

    //     // 플레이어 이동
    //     if (isArrowPressed.arrowUp === true && user.top > 0) {
    //         user.set('top', Math.max(user.top - 10, 0));
    //         socket.emit(`game-user-position`, {y: user.top});
    //     }
    //     if (isArrowPressed.arrowDown === true && user.top < CANVAS_HEIGHT - BAR_HEIGHT) {
    //         user.set('top', Math.min(user.top + 10, CANVAS_HEIGHT - BAR_HEIGHT));
    //         socket.emit(`game-user-position`, {y: user.top});
    //     }
    //     // 공 이동
    //     ball.set('left', ball.left + ballVecXY.x);
    //     ball.set('top', ball.top + ballVecXY.y);

    //     // game-ball-fix - kyeonkim
    //     if (ballFix.newData === true)
    //     {
    //         console.log('ballFix data - ', ballFix);
            
    //         ball.set(`left`, ballFix.ball.left);
    //         ball.set(`top`, ballFix.ball.top);
    //         ballVecXY.x = ballFix.ballVecXY.x;
    //         ballVecXY.y = ballFix.ballVecXY.y;
    //         // enemy.set('left', ballFix.enemy.left);
    //         // enemy.set('top', ballFix.enemy.top);
    //         scoreValue.player1 = ballFix.score.player1;
    //         scoreValue.player2 = ballFix.score.player2;
    //         user1Score.set("text",`${scoreValue.player1}`);
    //         user2Score.set("text",`${scoreValue.player2}`);
    //         ballFix.newData = false;
    //     }
    //     // 공 화면 위-아래 튕기기
    //     if (ball.top <= 0 || ball.top >= canvas.height - BALL_SIZE)
    //     {
    //         ballVecXY.y = -ballVecXY.y;
    //         // game-ball-hit event - kyeonkim
    //     }
    //     // 공 화면 바깥에 닿았는지 확인
    //     if (ball.left + BALL_SIZE <= 0)
    //     {
    //         ball.set({ left: canvas.width / 2 - BALL_SIZE / 2, top: canvas.height / 2 - BALL_SIZE / 2});
    //         ballVecXY.x = -ballVecXY.x;
    //         // game-ball-hit event - kyeonkim

    //         scoreValue.player2++;
    //         user2Score.set("text",`${scoreValue.player2}`);
    //         console.log("scoreValue.player2 : ", scoreValue.player2);
    //         socket.emit('game-ball-hit', {time: Date.now(), enemy: user, ball: ball, ballVecXY: ballVecXY, score: scoreValue});

    //         // scoreValue.player2++;
    //         // socket.emit('game-ball-hit', {time: Date.now(), enemy: user, ball: ball, ballVecXY: ballVecXY, score: scoreValue});
    //         // user2Score.set("text",`${scoreValue.player2}`);
    //     } 
    //     else if (ball.left >= canvas.width)
    //     {
    //         ball.set({ left: canvas.width / 2 - BALL_SIZE / 2, top: canvas.height / 2 - BALL_SIZE / 2});
    //         ballVecXY.x = -ballVecXY.x;
    //         // game-ball-hit event - kyeonkim
    //         scoreValue.player1++;
    //         socket.emit('game-ball-hit', {time: Date.now(), enemy: user, ball: ball, ballVecXY: ballVecXY, score: scoreValue});
    //         user1Score.set("text",`${scoreValue.player1}`);
    //     }
    //     else
    //     {
    //         // 공 플레이어1 에 닿는지 확인
    //         if (ballVecXY.x < 0 &&
    //             ball.left <= player1.left + player1.width &&
    //             ball.left >= player1.left &&
    //             ball.top + BALL_SIZE >= player1.top &&
    //             ball.top <= player1.top + player1.height)
    //         {
    //             const angle = (ball.top - (player1.top + (player1.height / 2)))/(player1.height / 2);
    //             ballVecXY.x = Math.cos(Math.PI/4 * angle) * ballSpeed;
    //             ballVecXY.x = ballVecXY.x > 0 ? ballVecXY.x : -ballVecXY.x;
    //             ballVecXY.y = Math.sin(Math.PI/4 * angle) * ballSpeed;
    //             // game-ball-hit event - kyeonkim
    //             // console.log('ballVecXY.x - ', ballVecXY.x, ' and ballVecXY.y - ', ballVecXY.y);
    //             // user === player1 > send
    //             if (user === player1)
    //                 socket.emit('game-ball-hit', {time: Date.now(), enemy: user, ball: ball, ballVecXY: ballVecXY, score: scoreValue});
    //         }
    //         // 공 플레이어2 에 닿는지 확인
    //         else if (
    //             ballVecXY.x > 0 &&
    //             ball.left + BALL_SIZE >= player2.left &&
    //             ball.left + BALL_SIZE <= player2.left + player2.width &&
    //             ball.top + BALL_SIZE >= player2.top &&
    //             ball.top <= player2.top + player2.height)
    //         {
    //             const angle = (ball.top - (player2.top + (player2.height / 2)))/(player2.height / 2);
    //             ballVecXY.x = Math.cos(Math.PI/4 * angle) * ballSpeed;
    //             ballVecXY.x = ballVecXY.x > 0 ? -ballVecXY.x : ballVecXY.x;
    //             ballVecXY.y = Math.sin(Math.PI/4 * angle) * ballSpeed;
    //             // user === player2 > send
    //             // game-ball-hit event - kyeonkim
    //             if (user === player2)
    //                 socket.emit('game-ball-hit', {time: Date.now(), enemy: user, ball: ball, ballVecXY: ballVecXY, score: scoreValue});
    //         }
    //     }
    //     // 다시 그리기
    //     canvas.renderAll();
    //     board.renderAll();
    //     // user1Score.renderAll();
    //     // user2Score.renderAll();

    // };

    useEffect(() => {
        initPong();
        setReady(1);
    }, []);
    
    useEffect(() => {
        if(ready === 1)
        {
            console.log("init player : ", player1, player2);
            console.log(`run pong`,ready, user);
            socket.on(`game-init`, (data :any) => {
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
                console.log("init user : ", user, ready);
                setInGameData(data);
                setReady(2);
            });
            socket.emit(`game-start`, {user_id: Number(cookies.get('user_id')), user_nickname: cookies.get('nick_name')});
        }
        
        return () => {
            socket.off('game-init');
        }

    }, [ready]);
    
    useEffect(() => {

        if(ready === 2)
        {
            socket.on(`game-user-position`, (data :any) => {
                console.log(`game : ${data.y}`, enemy);
                enemy.top = data.y;
            });
            socket.on('game-ball-fix', (data: any) => {
                console.log(`game-ball-fix on`, data);
                ballFix.newData = true;
                ballFix.enemy = data.enemy;
                ballFix.ball = data.ball;
                ballFix.ballVecXY = data.ballVecXY;
                ballFix.score = data.score;
            })
            setReady(3);
        }

        return () => {
            socket.off('game-user-position');
            socket.off('game-ball-fix');
        };

    }, [ready]);


    useEffect(() => {
        let lastRequestId :number; 

        if(ready === 3)
        {
            socket.on('game-end', (data :any) => {
                // 게임 종료 인식하는 이벤트
                cancelAnimationFrame(lastRequestId);

                // 종료 컴포넌트 렌더하게 만들기
                    // data에 nickname 및 결과 데이터 들어있음.
                    setEndData(data);
                    // 게임 실행 종료
                    setGameEnd(true);
                    // 조건부 렌더링
            })
            console.log('before requestAnaimationFrame-drawPong begin');

            const drawPong = () => {

                // 플레이어 이동
                if (isArrowPressed.arrowUp === true && user.top > 0) {
                    user.set('top', Math.max(user.top - 10, 0));
                    socket.emit(`game-user-position`, {y: user.top});
                }
                if (isArrowPressed.arrowDown === true && user.top < CANVAS_HEIGHT - BAR_HEIGHT) {
                    user.set('top', Math.min(user.top + 10, CANVAS_HEIGHT - BAR_HEIGHT));
                    socket.emit(`game-user-position`, {y: user.top});
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
                    // enemy.set('left', ballFix.enemy.left);
                    // enemy.set('top', ballFix.enemy.top);
                    scoreValue.player1 = ballFix.score.player1;
                    scoreValue.player2 = ballFix.score.player2;
                    user1Score.set("text",`${scoreValue.player1}`);
                    user2Score.set("text",`${scoreValue.player2}`);
                    ballFix.newData = false;
                }
                // 공 화면 위-아래 튕기기
                if (ball.top <= 0 || ball.top >= canvas.height - BALL_SIZE)
                {
                    ballVecXY.y = -ballVecXY.y;
                    // game-ball-hit event - kyeonkim
                }
                // 공 화면 바깥에 닿았는지 확인
                if (ball.left + BALL_SIZE <= 0)
                {
                    ball.set({ left: canvas.width / 2 - BALL_SIZE / 2, top: canvas.height / 2 - BALL_SIZE / 2});
                    ballVecXY.x = -ballVecXY.x;
                    // game-ball-hit event - kyeonkim
        
                    scoreValue.player2++;
                    user2Score.set("text",`${scoreValue.player2}`);
                    console.log("scoreValue.player2 : ", scoreValue.player2);
                    socket.emit('game-ball-hit', {time: Date.now(), enemy: user, ball: ball, ballVecXY: ballVecXY, score: scoreValue});
        
                    // scoreValue.player2++;
                    // socket.emit('game-ball-hit', {time: Date.now(), enemy: user, ball: ball, ballVecXY: ballVecXY, score: scoreValue});
                    // user2Score.set("text",`${scoreValue.player2}`);
                } 
                else if (ball.left >= canvas.width)
                {
                    ball.set({ left: canvas.width / 2 - BALL_SIZE / 2, top: canvas.height / 2 - BALL_SIZE / 2});
                    ballVecXY.x = -ballVecXY.x;
                    // game-ball-hit event - kyeonkim
                    scoreValue.player1++;
                    socket.emit('game-ball-hit', {time: Date.now(), enemy: user, ball: ball, ballVecXY: ballVecXY, score: scoreValue});
                    user1Score.set("text",`${scoreValue.player1}`);
                }
                else
                {
                    // 공 플레이어1 에 닿는지 확인
                    if (ballVecXY.x < 0 &&
                        ball.left <= player1.left + player1.width &&
                        ball.left >= player1.left &&
                        ball.top + BALL_SIZE >= player1.top &&
                        ball.top <= player1.top + player1.height)
                    {
                        const angle = (ball.top - (player1.top + (player1.height / 2)))/(player1.height / 2);
                        ballVecXY.x = Math.cos(Math.PI/4 * angle) * ballSpeed;
                        ballVecXY.x = ballVecXY.x > 0 ? ballVecXY.x : -ballVecXY.x;
                        ballVecXY.y = Math.sin(Math.PI/4 * angle) * ballSpeed;
                        // game-ball-hit event - kyeonkim
                        // console.log('ballVecXY.x - ', ballVecXY.x, ' and ballVecXY.y - ', ballVecXY.y);
                        // user === player1 > send
                        if (user === player1)
                            socket.emit('game-ball-hit', {time: Date.now(), enemy: user, ball: ball, ballVecXY: ballVecXY, score: scoreValue});
                    }
                    // 공 플레이어2 에 닿는지 확인
                    else if (
                        ballVecXY.x > 0 &&
                        ball.left + BALL_SIZE >= player2.left &&
                        ball.left + BALL_SIZE <= player2.left + player2.width &&
                        ball.top + BALL_SIZE >= player2.top &&
                        ball.top <= player2.top + player2.height)
                    {
                        const angle = (ball.top - (player2.top + (player2.height / 2)))/(player2.height / 2);
                        ballVecXY.x = Math.cos(Math.PI/4 * angle) * ballSpeed;
                        ballVecXY.x = ballVecXY.x > 0 ? -ballVecXY.x : ballVecXY.x;
                        ballVecXY.y = Math.sin(Math.PI/4 * angle) * ballSpeed;
                        // user === player2 > send
                        // game-ball-hit event - kyeonkim
                        if (user === player2)
                            socket.emit('game-ball-hit', {time: Date.now(), enemy: user, ball: ball, ballVecXY: ballVecXY, score: scoreValue});
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
        }

        return () => {
            console.log('before pong component unmount - cancelanimationframe');
            socket.off('game-end');
            cancelAnimationFrame(lastRequestId);
            
        };

    }, [ready]);


    useEffect(() => {
        function handleKeyDown(e :any) {
                let speed = player1Speed;
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
        
            <div>
                <canvas id="pongCanvas"></canvas>
                <canvas id="scoreBoard"></canvas>
                <GameProfile
                    inGameData={inGameData}/>
            </div>
        );
    }
    else if (gameEnd === true)
    {
        return (
            <div>
                <GameEnd
                    endData={endData} />
            </div>
        );
    }
};
