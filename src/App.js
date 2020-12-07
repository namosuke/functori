import './index.css';
import './App.css';
import React, { useEffect, useState } from 'react';

export default function App() {
  const initialContents = [
    {
      type: 'Serif',
      userName: 'You',
      funcName: 'acos',
      funcDesc: '大文字小文字を区別しない &quot;自然順&quot; アルゴリズムでエントリをソートする',
      funcUrl: 'function.acos.php'
    },
    {
      type: 'Message',
      children: '7000個目の関数でCPUに勝利しました！'
    }
  ];
  const [contents, setContents] = useState(initialContents);

  return (
    <div className="pb-24">
      <header className="bg-gray-800 p-2 text-gray-100 text-center sticky top-0">PHP関数名しりとり</header>
      <ContentsView items={contents} />
      <div className="bg-gray-200 p-1 pb-3 fixed inset-x-0 bottom-0 flex text-lg">
        <input type="text" inputmode="email" placeholder=" a から始まる関数名" className="px-1 flex-grow m-1 rounded" />
        <button className="bg-blue-600 shadow-inner w-14 m-1 rounded-2xl text-gray-100" onClick={() => {
          setContents(prevContents => {
            let nowContents = prevContents.concat();
            nowContents.push({
              type: 'Message',
              children: '7000個目の関数でCPUに勝利しました！'
            });
            return nowContents;
          })
        }}>Go!</button>
      </div>
    </div>
  );
}

function ContentsView(props) {
  useEffect(() => {
    document.querySelector('#root').scrollIntoView(false);
  });
  const listContents = props.items.map((content, index) =>
    content.type === 'Serif' ? <Serif userName={content.userName} funcName={content.funcName} funcDesc={content.funcDesc} funcUrl={content.funcUrl} key={index} /> : <Message key={index}>{content.children}</Message>
  );
  return (
    <>{listContents}</>
  )
}

function Message(props) {
  return (
    <div className="text-gray-200 p-3 text-center text-sm">{props.children}</div>
  )
}

function Serif(props) {
  return (
    <div className="flex items-center">
      <div className="text-gray-100 w-7 ml-2">{props.userName}</div>
      <div className={'rounded-xl m-3 shadow-md min-w-0 break-words ' + (props.userName === 'CPU' ? 'bg-gray-50' : 'bg-you')}>
        <div className="text-gray-900 p-2">{props.funcName}</div>
        <div className="text-gray-600 text-sm border-t border-gray-400">
          <a href="https://www.php.net/manual/ja/{props.funcUrl}" target="_blank" rel="noopener noreferrer" className="block w-full h-full p-2" dangerouslySetInnerHTML={{ __html: props.funcDesc }}></a>
        </div>
      </div>
    </div>
  )
}