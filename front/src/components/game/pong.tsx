"use client"
import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

// 새로 고침했을 때, 상위 컴포넌트에서 참가자 데이터를 받아오는가? 아니면 back에 요청을 하는가?

function initialData() {
    return (
        {
            p1: [30, 170],
            p2: [760, 70],
            ball: [400, 195],
            score: [0, 0]
        }
    );
};

export default function Pong (props :any){
    
    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [board, setBoard] = useState<fabric.Canvas>();
    const [ball, setBall] = useState<fabric.Circle>();
    const [player1, setPlayer1] = useState<fabric.Rect>();
    const [player2, setPlayer2] = useState<fabric.Rect>();
    const [score, setScore] = useState<fabric.Text>();
    const [scoreValue, setScoreValue] = useState([0, 0]);

    const [player1Speed, setPlayer1Speed] = useState(0);

    const [ballVecXY, setBallVecXY] = useState({
        x: 6,
        y: 6
    });
    const [ballVecLen, setBallVecLen] = useState(Math.sqrt(Math.pow(6, 2) + Math.pow(6, 2)));

    const [ballMaxSpeed, setBallMaxSpeed] = useState(8);
    const [ballMinSpeed, setBallMinSpeed] = useState(4);

    const [isArrowPressed, setIsArrowPressed] = useState({
        ArrowUp: false,
        ArrowDown: false
    });

    const   scoreRef = useRef(score);

    const handleGameEnd = () => {
        console.log('end? is it?');
    }

    useEffect(() => {
        // 초기 canvas 세팅

        const pongCanvas = new fabric.Canvas("pongCanvas", {
            // canvas 만들기
            height: 400,
            width: 800,
            backgroundColor: "black",
        });
    
        const scoreBoard = new fabric.Canvas("scoreBoard", {
            // scoreBoard 만들기
            height: 50,
            width: 800,
            backgroundColor: "white",
        })
    
        setCanvas(pongCanvas);
        setBoard(scoreBoard);
    
        // 백에서 데이터 가져오기
        const data = initialData();
    
        console.log(data);
    
        var tmp_user1 = new fabric.Rect({
            left: data.p1[0],
            top: data.p1[1],
            height: 60,
            width: 10,
            fill: "white",
        });
    
        setPlayer1(tmp_user1);
        pongCanvas.add(tmp_user1);
    
        var tmp_user2 = new fabric.Rect({
            left: data.p2[0],
            top: data.p2[1],
            height: 60,
            width: 10,
            fill: "white",
        });
    
        setPlayer2(tmp_user2);
        pongCanvas.add(tmp_user2);
    
        var circle = new fabric.Circle({
            left: data.ball[0],
            top: data.ball[1],
            radius: 10,
            fill: "white",
        });

        setBall(circle);
        pongCanvas.add(circle);
        
    
        // score 표기하기
        var tmp_score = new fabric.Text(`${data.score.join(' - ')}`,{
            left: 350,
            top: 0,
        });
    
        setScore(tmp_score);
        scoreBoard.add(tmp_score);
    
    
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

    }, []);


    useEffect(() => {

        // 자체 계산 - 백에서는 방식 달라질 예정
    
        var lastRequestId :number;
    

        function drawing() {
            // 공 이동
            bawll.set('left', ball.left + ballVecXY.x);
            ball.set('top', ball.top + ballVecXY.y);
      
            // 공 화면 위-아래 튕기기
            if (ball.top <= 0 || ball.top >= canvas.height - ball.radius * 2)
            {
                ballVecXY.y = -ballVecXY.y;
            }
      

            // 공 화면 바깥에 닿았는지 확인
                // scoreValue를 set으로 설정해야함.
            if (ball.left <= 0 || ball.left >= canvas.width - ball.radius * 2)
            {
                if (ball.left <= 0)
                {
                    ball.set({ left: canvas.width / 2, top: canvas.height / 2 });
                    ballVecXY.x = -ballVecXY.x;

                    scoreValue[1]++;
                    score.set("text", `${scoreValue.join(' - ')}`);
                }
                else if (ball.left >= canvas.width - ball.radius * 2)
                {
                    ball.set({ left: canvas.width / 2, top: canvas.height / 2 });
                    ballVecXY.x = -ballVecXY.x;
    
                    scoreValue[0]++;
                    score.set("text", `${scoreValue.join(' - ')}`);
                }
    
            }
            else
            {
                if (
                    // 공 플레이어에 닿는지 확인
                    ballVecXY.x < 0 &&
                    ball.left <= player1.left + player1.width &&
                    ball.top >= player1.top &&
                    ball.top <= player1.top + player1.height
                )
                {
                    ballVecXY.x = -ballVecXY.x;
                    // 추가적으로 player 이동 방향 및 속도 기반으로 X 조정
                    if (ballVecXY.y > 0 && player1Speed > 0 || ballVecXY.y < 0 && player1Speed < 0)
                    {
                        console.log('same direction');
                        // 동일 방향
                            // 사실상 player_speed의 음수 양수 말고는 방식이 동일한 것 같음.
                        if (ballVecXY.y > 0)
                        {
                            // 위로 갈 때
                            // 유저 속도 절삭
                            const changedPlayerSpeed = (player1Speed * 8 / 20)
                            const accumballVecY = ballVecXY.y + changedPlayerSpeed;

                            const currentBallLength = Math.SQRT2 * (Math.pow(ballVecXY.x, 2) + Math.pow(accumballVecY, 2));
                            
                            if (currentBallLength > ballMaxSpeed)
                            {
                                ballVecXY.x = ballVecXY.x * ( ballMaxSpeed / currentBallLength );
                                ballVecXY.y = accumballVecY * ( ballMaxSpeed / currentBallLength );
                            }
                            else
                            {
                                ballVecXY.y = accumballVecY;
                            }
                        }
                        else
                        {
                            // 아래로 갈 때
                            const changedPlayerSpeed = (player1Speed * 8 / 20)
                            const accumballVecY = ballVecXY.y + changedPlayerSpeed;
                            const currentBallLength = Math.SQRT2 * (Math.pow(ballVecXY.x, 2) + Math.pow(accumballVecY, 2));
                            
                            if (currentBallLength > ballMaxSpeed)
                            {
                                ballVecXY.x = ballVecXY.x * ( ballMaxSpeed / currentBallLength );
                                ballVecXY.y = accumballVecY * ( ballMaxSpeed / currentBallLength );
                            }
                            else
                            {
                                ballVecXY.y = accumballVecY;
                            }

                        }
                    }
                    else
                    {
                        console.log('opposite direction');
                        // 반대 방향
                        if (ballVecXY.y > 0)
                        {
                            // 위로 갈 때
                            // 유저 속도 절삭
                            const changedPlayerSpeed = (player1Speed * 8 / 20)
                            const accumballVecY = ballVecXY.y + changedPlayerSpeed;
                            const currentBallLength = Math.SQRT2 * (Math.pow(ballVecXY.x, 2) + Math.pow(accumballVecY, 2));
                            
                            if (currentBallLength < ballMinSpeed)
                            {
                                ballVecXY.x = ballVecXY.x * ( ballMinSpeed / currentBallLength );
                                ballVecXY.y = accumballVecY * ( ballMinSpeed / currentBallLength );
                            }
                            else
                            {
                                ballVecXY.y = accumballVecY;
                            }
                        }
                        else
                        {
                            // 아래로 갈 때
                            const changedPlayerSpeed = (player1Speed * 8 / 20)
                            const accumballVecY = ballVecXY.y + changedPlayerSpeed;
                            const currentBallLength = Math.SQRT2 * (Math.pow(ballVecXY.x, 2) + Math.pow(accumballVecY, 2));
                            
                            if (currentBallLength < ballMinSpeed)
                            {
                                ballVecXY.x = ballVecXY.x * ( ballMinSpeed / currentBallLength );
                                ballVecXY.y = accumballVecY * ( ballMinSpeed / currentBallLength );
                            }
                            else
                            {
                                ballVecXY.y = accumballVecY;
                            }
                        }

                    }

                    console.log('ballVecXY.x - ', ballVecXY.x, ' and ballVecXY.y - ', ballVecXY.y)
                    // 추가적으로 ball 속도 조정
                }
                else if (
                    // 공 npc에 닿는지 확인
                    ballVecXY.x > 0 &&
                    ball.left + (2 * ball.radius) >= player2.left &&
                    ball.top >= player2.top &&
                    ball.top <= player2.top + player2.height
                  )
                {
                    ballVecXY.x = -ballVecXY.x;

                }
            }

            // 다시 그리기
            canvas.renderAll();
            score.renderAll();

            // requestAnimationFrame 재귀 - 스택 상 재귀는 아니고, callback을 재귀 호출한다고 보는게 나음. 그래서 stack overflow 안난다고 함.
            if (scoreValue[0] !== 5 && scoreValue[1] !== 5)
            {
                lastRequestId = requestAnimationFrame(drawing);
            }
            else
            {
                handleGameEnd();
            }
          }
      
        lastRequestId = requestAnimationFrame(drawing);


        return () => {
            cancelAnimationFrame(lastRequestId);
        };

    }, [canvas, score, scoreValue, ball, ballVecXY, ballMinSpeed, ballMaxSpeed, player1, player2, player1Speed]);






    useEffect(() => {

        function handleKeyDown(e :any) {

            if (e.repeat === true)
            {
                var speed = player1Speed;
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

    return (
        <div>
            <canvas id="scoreBoard"></canvas>
            <canvas id="pongCanvas"></canvas>
        </div>
    );

};
