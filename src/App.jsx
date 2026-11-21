import { useState, useEffect } from 'react';
import './App.css'; // 如果需要样式，建议把样式写这里，或者用下面的行内样式

const initialCats = [
  { id: 1, name: '小橘', desc: '一只爱晒太阳的橘猫，3 岁，性格温顺。', age: '3 岁' },
  { id: 2, name: '奶牛', desc: '性格活泼，爱跑爱跳。', age: '2 岁' },
];

// 拆分的猫咪卡片组件
function CatCard(props) {
  return (
    <div className="card" style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', margin: '10px auto', maxWidth: '500px', boxShadow: '0 2px 8px #ddd' }}>
      {/* 👇 就是加在这里的这行代码 👇 */}
      <img src={"/" + props.name + ".jpg"} alt={props.name} width="200" style={{ borderRadius: '12px', marginBottom: '15px' }} />
      
      <h2 style={{ color: '#E65100' }}>{props.name}（{props.age}）</h2>
      <p>{props.desc}</p>
    </div>
  );
}

function App() {
  // 1. 状态管理：猫咪列表、输入框的名字、描述
  const [cats, setCats] = useState(() => {
    const saved = localStorage.getItem('cats');
    return saved ? JSON.parse(saved) : initialCats;
  });
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  
  // 保留你原来小橘详情的需求
  const [showDetail, setShowDetail] = useState(false);

  // 2. 副作用：每次 cats 变化时，自动存入浏览器的 localStorage
  useEffect(() => {
    localStorage.setItem('cats', JSON.stringify(cats));
  }, [cats]);

  // 3. 添加新猫咪的方法
  function addCat() {
    if (!name.trim()) return;
    setCats([...cats, { id: Date.now(), name: name, desc: desc, age: '未知' }]);
    setName('');
    setDesc('');
  }

  return (
    <div style={{ backgroundColor: '#FFF3E0', minHeight: '100vh', padding: '30px', fontFamily: 'Microsoft YaHei, sans-serif' }}>
      <h1 style={{ color: '#E65100', textAlign: 'center', marginBottom: '30px' }}>我的喂猫服务</h1>
      
      {/* 渲染猫咪列表 */}
      {cats.map(cat => (
        <CatCard key={cat.id} name={cat.name} desc={cat.desc} age={cat.age} />
      ))}

      {/* 添加猫咪的表单 */}
      <div className="card" style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', margin: '20px auto', maxWidth: '500px', boxShadow: '0 2px 8px #ddd' }}>
        <h2 style={{ color: '#E65100' }}>添加猫咪</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="名字" 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <input 
            value={desc} 
            onChange={e => setDesc(e.target.value)} 
            placeholder="描述" 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <button 
            onClick={addCat}
            style={{ backgroundColor: '#FF7043', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
          >
            添加猫咪
          </button>
        </div>
      </div>

      {/* 原版小橘的详细需求（为了让你知道这个功能没丢，我给它单独留了个位置，你可以选择保留或删掉） */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={() => setShowDetail(!showDetail)}
          style={{ backgroundColor: '#FF7043', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
        >
          {showDetail ? "收起小橘详细需求" : "展开小橘详细需求"}
        </button>
        {showDetail && (
          <div style={{ marginTop: '10px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', display: 'inline-block', textAlign: 'left', boxShadow: '0 2px 8px #ddd' }}>
            <p>对牛奶过敏，只能喂清水</p>
            <p>每天需要陪玩 20 分钟</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

