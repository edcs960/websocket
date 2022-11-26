import './App.css';
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {useEffect, useState} from "react";

function App() {
    /*const [chatList, setChatList] = useState([]);
    const [chat, setChat] = useState('');

    let {pinNum} = useParams();
    const client = useRef({});

    const  connect = () =>{
        client.current = new Stomp.client({
            brokerURL : "http://localhost:8080/stomp/quiz",
            onConnect:()=>{
                console.log("success");
                subscribe();
            },
        });
        client.current.activate();
    };

    const publish = (chat) => {
        if(!client.current.connected) return;

        client.current.publish({
            destination : '/pub/quiz/message',
            body: JSON.stringify({
                pinNum : pinNum,
                chat : chat,
            }),
        });

        setChat('');
    };

    const subscribe = () => {
        client.current.subscribe("/sub/quiz-play/room/" + pinNum, (body) => {
           const json_body = JSON.parse(body.body);
           setChatList((_chat_list)=>[
               ..._chat_list, json_body
           ]);
        });
    };

    const disconnect = () => {
        client.current.deactivate();
    };

    const handleChange = (event) => { // 채팅 입력 시 state에 값 설정
        setChat(event.target.value);
    };

    const handleSubmit = (event, chat) => { // 보내기 버튼 눌렀을 때 publish
        event.preventDefault();

        publish(chat);
    };

    useEffect(()=>{
        connect();

        return () => disconnect();
    })*/

    const [chatList,setChatList] = useState([]);

    let sockJs = new SockJS("http://localhost:8080/stomp/quiz");
    let stomp = Stomp.over(sockJs);
    let nick = Math.random();
    let pinNum = "123456";

    stomp.connect({}, () => {
        console.log("STOMP Connection");

        stomp.subscribe("/sub/quiz-play/room/" + pinNum, (chat) => {
            console.log(chat);
            let content = JSON.parse(chat.body);
            console.log("connect부분 : " + JSON.stringify(content));
        });
        //stomp.send('/pub/quiz/in', {}, JSON.stringify({pinNum: pinNum, nick:nick, message:"입장"}));
    });

    const send = () => {
        let command = "command";
        let msg = document.getElementById("msg");
        let point = document.getElementById("point");
        let answer = document.getElementById("answer");
        let worng = document.getElementById("worng");

        stomp.send('/pub/quiz/message', {}, JSON.stringify({
            pinNum: pinNum,
            nick:nick,
            messageType:command,
            msg:msg.value,
            point:point.value,
            answer:answer.value,
            worng:worng.value,
        }));
        msg.value='';
    }

    return (
        <>
            {/*<div className={'chat-list'}>{chatList}</div>
            <form onSubmit={(event) => handleSubmit(event, chat)}>
                <div>
                    <input type={'text'} name={'chatInput'} onChange={handleChange} value={chat} />
                </div>
                <input type={'submit'} value={'의견 보내기'} />
            </form>*/}
            <div>
                {chatList}
            </div>
            <input type="text" id="msg" name="msg" />
            <input type="text" id="point" name="point" />
            <input type="text" id="answer" name="answer" />
            <input type="text" id="worng" name="worng" />
            <button onClick={send}>
                전송
            </button>
        </>
    );
}

export default App;
