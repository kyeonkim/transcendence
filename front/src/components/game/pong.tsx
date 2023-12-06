"use client"
import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useChatSocket } from '@/app/main_frame/socket_provider';
import { useCookies } from "next-client-cookies";

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
    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [board, setBoard] = useState<fabric.Canvas>();
    const [ball, setBall] = useState<fabric.Circle>();
    const [player1, setPlayer1] = useState<fabric.Rect>();
    const [player2, setPlayer2] = useState<fabric.Rect>();
    
    const [user, setUser] = useState<fabric.Rect>();
    const [enemy, setEnemy] = useState<fabric.Rect>();

    const [user1Score, setUser1Score] = useState<fabric.Text>();
    const [user2Score, setUser2Score] = useState<fabric.Text>();
    const [scoreValue, setScoreValue] = useState([0, 0]);
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
            left: BOARD_WIDTH / 2 - BOARD_WIDTH / 8,
            top: 0,
			textAlign: "right",
        });
        let user2_score = new fabric.Textbox(`${data.score[1]}`,{
            width: BOARD_WIDTH / 8,
            left: BOARD_WIDTH / 4 * 2,
            top: 0,
            textAlign: 'left',
        });
    
        setUser1Score(user1_score);
        setUser2Score(user2_score);
        scoreBoard.add(user1_score);
        scoreBoard.add(user2_score);
    
    
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

    const runPong = () => {
        let lastRequestId :number;

        function drawing() {
            // 플레이어 이동
            // console.log(`allow up : ${isArrowUp} and allow down : ${isArrowDown}`);
            // console.log("drawingdrawingdrawingdrawing : ", user);
            if (isArrowPressed.arrowUp === true && user.top > 0) {
                user.set('top', Math.max(user.top - 10, 0));
                socket.emit(`game`, {y: user.top});
            }
            if (isArrowPressed.arrowDown === true && user.top < CANVAS_HEIGHT - BAR_HEIGHT) {
                user.set('top', Math.min(user.top + 10, CANVAS_HEIGHT - BAR_HEIGHT));
                socket.emit(`game`, {y: user.top});
            }
            // 공 이동
            ball.set('left', ball.left + ballVecXY.x);
            ball.set('top', ball.top + ballVecXY.y);

            // 공 화면 위-아래 튕기기
            if (ball.top <= 0 || ball.top >= canvas.height - BALL_SIZE)
                ballVecXY.y = -ballVecXY.y;
            // 공 화면 바깥에 닿았는지 확인
                // scoreValue를 set으로 설정해야함.
            if (ball.left + BALL_SIZE <= 0)
            {
                ball.set({ left: canvas.width / 2 - BALL_SIZE / 2, top: canvas.height / 2 - BALL_SIZE / 2});
                ballVecXY.x = -ballVecXY.x;
                scoreValue[1]++;
                user2Score.set("text",`${scoreValue[1]}`);
            } 
            else if (ball.left >= canvas.width)
            {
                ball.set({ left: canvas.width / 2 - BALL_SIZE / 2, top: canvas.height / 2 - BALL_SIZE / 2});
                ballVecXY.x = -ballVecXY.x;
                scoreValue[0]++;
                user1Score.set("text",`${scoreValue[0]}`);
            }
            else
            {
                // 공 플레이어에 닿는지 확인
                // if (ballVecXY.x < 0 && ball.left - BALL_SIZE / 2 <= player1.left + player1.width && ball.top >= player1.top && ball.top <= player1.top + player1.height)
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
                    console.log('ballVecXY.x - ', ballVecXY.x, ' and ballVecXY.y - ', ballVecXY.y);
                    {
                        // 추가적으로 player 이동 방향 및 속도 기반으로 X 조정
                        // if (ballVecXY.y > 0 && player1Speed > 0 || ballVecXY.y < 0 && player1Speed < 0)
                        // {
                        //     console.log('same direction');
                        //     // 동일 방향
                        //         // 사실상 player_speed의 음수 양수 말고는 방식이 동일한 것 같음.
                        //     if (ballVecXY.y > 0)
                        //     {
                        //         // 위로 갈 때
                        //         // 유저 속도 절삭
                        //         const changedPlayerSpeed = (player1Speed * 8 / 20)
                        //         const accumballVecY = ballVecXY.y + changedPlayerSpeed;

                        //         const currentBallLength = Math.SQRT2 * (Math.pow(ballVecXY.x, 2) + Math.pow(accumballVecY, 2));
                                
                        //         if (currentBallLength > ballMaxSpeed)
                        //         {
                        //             ballVecXY.x = ballVecXY.x * ( ballMaxSpeed / currentBallLength );
                        //             ballVecXY.y = accumballVecY * ( ballMaxSpeed / currentBallLength );
                        //         }
                        //         else
                        //         {
                        //             ballVecXY.y = accumballVecY;
                        //         }
                        //     }
                        //     else
                        //     {
                        //         // 아래로 갈 때
                        //         const changedPlayerSpeed = (player1Speed * 8 / 20)
                        //         const accumballVecY = ballVecXY.y + changedPlayerSpeed;
                        //         const currentBallLength = Math.SQRT2 * (Math.pow(ballVecXY.x, 2) + Math.pow(accumballVecY, 2));
                                
                        //         if (currentBallLength > ballMaxSpeed)
                        //         {
                        //             ballVecXY.x = ballVecXY.x * ( ballMaxSpeed / currentBallLength );
                        //             ballVecXY.y = accumballVecY * ( ballMaxSpeed / currentBallLength );
                        //         }
                        //         else
                        //         {
                        //             ballVecXY.y = accumballVecY;
                        //         }
                            //     }
                    }
                    // else
                    {
                        //     console.log('opposite direction');
                        //     // 반대 방향
                        //     if (ballVecXY.y > 0)
                        //     {
                        //         // 위로 갈 때
                        //         // 유저 속도 절삭
                        //         const changedPlayerSpeed = (player1Speed * 8 / 20)
                        //         const accumballVecY = ballVecXY.y + changedPlayerSpeed;
                        //         const currentBallLength = Math.SQRT2 * (Math.pow(ballVecXY.x, 2) + Math.pow(accumballVecY, 2));
                                
                        //         if (currentBallLength < ballMinSpeed)
                        //         {
                        //             ballVecXY.x = ballVecXY.x * ( ballMinSpeed / currentBallLength );
                        //             ballVecXY.y = accumballVecY * ( ballMinSpeed / currentBallLength );
                        //         }
                        //         else
                        //         {
                        //             ballVecXY.y = accumballVecY;
                        //         }
                        //     }
                        //     else
                        //     {
                        //         // 아래로 갈 때
                        //         const changedPlayerSpeed = (player1Speed * 8 / 20)
                        //         const accumballVecY = ballVecXY.y + changedPlayerSpeed;
                        //         const currentBallLength = Math.SQRT2 * (Math.pow(ballVecXY.x, 2) + Math.pow(accumballVecY, 2));
                                
                        //         if (currentBallLength < ballMinSpeed)
                        //         {
                        //             ballVecXY.x = ballVecXY.x * ( ballMinSpeed / currentBallLength );
                        //             ballVecXY.y = accumballVecY * ( ballMinSpeed / currentBallLength );
                        //         }
                        //         else
                        //         {
                        //             ballVecXY.y = accumballVecY;
                        //         }
                        //     }

                        // }
                        // console.log('ballVecXY.x - ', ballVecXY.x, ' and ballVecXY.y - ', ballVecXY.y)
                        // 추가적으로 ball 속도 조정
                    }
                }
                // else if (
                //     // 공 npc에 닿는지 확인
                //     ballVecXY.x > 0 &&
                //     ball.left + (2 * ball.radius) >= player2.left &&
                //     ball.top >= player2.top &&
                //     ball.top <= player2.top + player2.height
                // )
                else if (
                    ballVecXY.x > 0 &&
                    ball.left + BALL_SIZE >= player2.left &&
                    ball.left + BALL_SIZE <= player2.left + player2.width &&
                    ball.top + BALL_SIZE >= player2.top &&
                    ball.top <= player2.top + player2.height)
                {
                    ballVecXY.x = -ballVecXY.x;
                }
            }

            // 다시 그리기
            canvas.renderAll();
            board.renderAll();
            // user1Score.renderAll();
            // user2Score.renderAll();

            // requestAnimationFrame 재귀 - 스택 상 재귀는 아니고, callback을 재귀 호출한다고 보는게 나음. 그래서 stack overflow 안난다고 함.
            // if (scoreValue[0] !== 5 && scoreValue[1] !== 5)
            // {
            lastRequestId = requestAnimationFrame(drawing);
            // }
            // else
            // {
                // handleGameEnd();
            // }
        }
        lastRequestId = requestAnimationFrame(drawing);
        return () => {
            cancelAnimationFrame(lastRequestId);
        };

    };

    useEffect(() => {
        initPong();
        setReady(1);
    }, []);
    
    useEffect(() => {
        if(ready === 1)
        {
            console.log("init player : ", player1, player2);
            console.log(`run pong`,ready, user);
            socket.on(`initGame`, (data :any) => {
                console.log('initGame');
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
                setReady(2);
            });
            socket.emit(`gameStart`, {user_id: Number(cookies.get('user_id'))});
        }
    }, [ready]);
    
    useEffect(() => {
        if(ready === 2)
        {
            socket.on(`game`, (data :any) => {
                console.log(`game : ${data.y}`, enemy);
                enemy.top = data.y;
            });
            runPong();
        }
    }, [ready]);

    useEffect(() => {
        function handleKeyDown(e :any) {
                let speed = player1Speed;
                if (e.key === 'ArrowUp') {
                    console.log('Arrow up');
                    isArrowPressed.arrowUp = true;
                    console.log(`allow up : ${isArrowPressed.arrowUp}`);
                    // speed = Math.max(speed - 0.1, -20);
                } 
                else if (e.key === 'ArrowDown') 
                {
                    console.log('Arrow down');
                    isArrowPressed.arrowDown = true;
                    console.log(`allow down : ${isArrowPressed.arrowDown}`);
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
    return (
        <div>
            <canvas id="pongCanvas"></canvas>
            <canvas id="scoreBoard"></canvas>
        </div>
    );
};
