import './index.css';
import './App.css';

export default function App() {
  return (
    <div>
      <header className="bg-gray-800 p-2 text-gray-100 text-center sticky top-0">PHP関数名しりとり</header>
      <div className="flex items-center sm:container mx-auto">
        <div className="text-gray-100 w-6 ml-2">You</div>
        <div className="rounded-xl m-3 shadow-md" style={{ backgroundColor: 'hsl(120, 78%, 59%)' }}>
          <div className="text-gray-900 p-2">acos</div>
          <div className="text-gray-600 text-sm border-t border-gray-400">
            <a href="https://www.php.net/manual/ja/function.acos.php" target="_blank" rel="noopener noreferrer" className="block w-full h-full p-2">
              大文字小文字を区別しない &quot;自然順&quot; アルゴリズムでエントリをソートする
            </a>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 p-1 pb-3 fixed inset-x-0 bottom-0 flex text-lg">
        <input type="text" inputmode="email" placeholder=" a から始まる関数名" className="px-1 flex-grow m-1 rounded" />
        <button className="bg-green-400 shadow-inner w-11 m-1 rounded text-gray-100" style={{ backgroundColor: 'hsl(178, 100%, 39%)' }}>Go!</button>
      </div>
    </div>
  );
}
