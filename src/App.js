import './index.css';
import './App.css';
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

// TODO: 今いくつめか表示する機能

let regex = {};
fetch('./regex.json').then(response => response.json()).then(data => regex = data);

export default function App() {
  const initialContents = [
    {
      type: 'Message',
      children: "PHP関数名しりとりへようこそ！<br>PHP関数名しりとりは、あなたとCPUで交互にPHPの関数名を言い合うゲームです。<br>あなたは1つ前の関数の最後のアルファベットから始まる関数名を思い出し、入力してください。<br>降参したり、\"md5\"のように数字で終わる関数名を言ったほうが負けになります。<br>終了すると記録をSNSで共有できます。<br>どれだけ続けられるか挑戦してみてください！"
    },
    {
      type: 'Serif',
      userName: 'CPU',
      funcName: 'abs',
      funcUrl: 'function.abs.php',
      funcDesc: '絶対値'
    }
  ];
  const [contents, setContents] = useState(initialContents);
  const [saids, setSaids] = useState({ abs: true });

  return (
    <div className="pb-24">
      <header className="bg-gray-800 p-2 text-gray-100 text-center sticky top-0">PHP関数名しりとり</header>
      <ContentsView items={contents} />
      <Form setC={setContents} saids={saids} setS={setSaids} />
    </div>
  );
}

function Form(props) {
  const setContents = props.setC;
  let saids = props.saids;
  const setSaids = props.setS;
  const { register, handleSubmit, errors, reset, setError } = useForm({ mode: 'onChange' });
  const [isEnable, setIsEnable] = useState(true);
  const [lastWord, setLastWord] = useState('s');
  function onSubmit(data) {
    let key = data.funcName.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
    reset();  // フォームクリア
    if (key.slice(0, 1) !== lastWord) {
      setError('funcName', { type: "manual", message: `${regex[key][0]} は ${lastWord} から始まっていません` });
      return;
    }
    const addSaids = (key) => {
      setSaids(prevSaids => {
        prevSaids[key] = true;
        return prevSaids;
      });
    }
    if (!(key in saids)) {
      addSaids(key);
    } else {
      setError('funcName', { type: "manual", message: regex[key][0] + " は既に言われています" });
      return;
    }
    let lastWordToCPU = regex[key][0].slice(-1);
    setContents(prevContents => {
      let nowContents = prevContents.concat();
      nowContents.push({
        type: 'Serif',
        userName: 'You',
        funcName: regex[key][0],
        funcUrl: regex[key][1],
        funcDesc: regex[key][2]
      });
      return nowContents;
    });
    if (/[0-9]$/.test(key)) {
      gameOver('関数名の最後に数字が付いているため、あなたの負けです');
      return;
    }
    // CPUのターン
    const shuffled = shuffle(Object.keys(regex));
    let bring = null;
    for (const element of shuffled) {
      if (element.slice(0, 1) === lastWordToCPU && !(element in saids)) {
        bring = element;
        break;
      }
    }
    if (bring === null) {
      // CPU負け
      gameOver('CPUが降参しました<br><br>あなたの勝ちです！おめでとうございます！お疲れ様でした！<br>9304個もの関数の中からCPUに勝てる人、本当にいるんですね…！！！', true);
      return;
    }
    addSaids(bring);
    setContents(prevContents => {
      let nowContents = prevContents.concat();
      nowContents.push({
        type: 'Serif',
        userName: 'CPU',
        funcName: regex[bring][0],
        funcUrl: regex[bring][1],
        funcDesc: regex[bring][2]
      });
      return nowContents;
    });
    setLastWord(regex[bring][0].slice(-1));
  }
  function gameOver(text, win = false) {
    setIsEnable(false);
    setContents(prevContents => {
      let nowContents = prevContents.concat();
      nowContents.push({
        type: 'Message',
        children: text + `<div class="text-center">記録：${Object.keys(saids).length}個<br><br>↓SNSで記録を共有してね！<br><br><a href="https://twitter.com/intent/tweet?text=記録：${Object.keys(saids).length}個目の関数でCPUに${win ? '勝ち' : '負け'}ました%0a%23PHP関数名しりとり%0ahttps://functori.netlify.app" target="_blank" rel="noopener noreferrer" class="inline-block"><img src="twitter.png" alt="Twitter" class="text-center w-12"/></a></div>`
      });
      return nowContents;
    })
  }

  return (
    <>
      {errors.funcName?.type === 'manual' && isEnable &&
        <div className="bg-yellow-100 p-1 pb-2 fixed inset-x-0 bottom-12 text-yellow-700">{errors.funcName.message}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className={"bg-gray-200 p-1 pb-3 fixed inset-x-0 bottom-0 flex text-lg " + (!isEnable && 'hidden')}>
        <input type="text" spellCheck="false" autoCapitalize="off" inputMode="email" autoComplete="off" placeholder={" " + lastWord + " から始まる関数名"} className="px-1 flex-grow m-1 rounded" name="funcName" ref={register({
          validate: {
            exist: value => {
              let key = value.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
              return (key in regex);
            }
          }
        })} />
        <button className={'shadow-inner w-14 m-1 rounded-2xl text-gray-100 ' + (errors.funcName ? 'bg-pink-600' : 'bg-blue-600')} type={errors.funcName ? 'button' : 'submit'} onClick={errors.funcName && (() => { gameOver('降参しました') })}>{errors.funcName ? '降参' : 'Go!'}</button>
      </form>
    </>
  );
}

function shuffle([...array]) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 動的表示部分
function ContentsView(props) {
  // スクロールを最下部へ
  useEffect(() => {
    let element = document.documentElement;
    let bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
  });
  const listContents = props.items.map((content, index) =>
    content.type === 'Serif' ? <Serif userName={content.userName} funcName={content.funcName} funcDesc={content.funcDesc} funcUrl={content.funcUrl} key={index} /> : <Message key={index}>{content.children}</Message>
  );
  return (
    <>{listContents}</>
  )
}

// 単純表示部分
function Message(props) {
  return (
    <div className="text-gray-200 p-3 text-center text-sm" dangerouslySetInnerHTML={{ __html: props.children }}></div>
  )
}

// 吹き出し表示部分
function Serif(props) {
  return (
    <div className="flex items-center">
      <div className="text-gray-100 w-7 ml-2">{props.userName}</div>
      <div className={'rounded-xl m-3 shadow-md min-w-0 break-words ' + (props.userName === 'CPU' ? 'bg-gray-50' : 'bg-you')}>
        <div className="text-gray-900 p-2">{props.funcName}</div>
        <div className="text-gray-600 text-sm border-t border-gray-400">
          <a href={'https://www.php.net/manual/ja/' + props.funcUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full p-2" dangerouslySetInnerHTML={{ __html: props.funcDesc }}></a>
        </div>
      </div>
    </div>
  )
}