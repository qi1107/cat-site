import { useState, useEffect } from 'react';
import cloudbase from '@cloudbase/js-sdk';

// 1. 初始化 CloudBase (会自动读取 .env.local 里的环境变量)
const app = cloudbase.init({
  env: import.meta.env.VITE_CB_ENV,
  accessKey: import.meta.env.VITE_CB_KEY
});

// 2. 获取关系型数据库 (PostgreSQL) 实例
const db = app.rdb();

function CatCard(props) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', margin: '10px auto', maxWidth: '500px', boxShadow: '0 2px 8px #ddd' }}>
      {/* 加了 onError，如果找不到图片就不显示烂图图标 */}
      <img 
        src={"/" + props.name + ".jpg"} 
        alt={props.name} 
        width="200" 
        style={{ borderRadius: '12px', marginBottom: '15px' }} 
        onError={(e) => { e.target.style.display = 'none' }} 
      />
      <h2 style={{ color: '#E65100' }}>{props.name}（{props.age}）</h2>
      <p>{props.desc}</p>
    </div>
  );
}

function App() {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(true);

  // 3. 页面加载时拉取数据
  useEffect(() => {
    fetchCats();
  }, []);

  async function fetchCats() {
    try {
      // 查询 cats 表的所有数据，按 created_at 倒序排列
      const { data, error } = await db
        .from('cats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCats(data || []);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  }

  // 4. 添加猫咪
  async function addCat() {
    if (!name.trim()) return;
    
    try {
      // 向 cats 表插入数据
      const { error } = await db
        .from('cats')
        .insert([{ name: name, desc: desc, age: '未知' }]);

      if (error) throw error;
      
      // 插入成功后，重新拉取最新数据刷新页面
      await fetchCats();
      
      // 清空输入框
      setName('');
      setDesc('');
    } catch (error) {
      console.error('添加失败:', error);
      alert('添加失败，请看控制台报错');
    }
  }

  return (
    <div style={{ backgroundColor: '#FFF3E0', minHeight: '100vh', padding: '30px', fontFamily: 'Microsoft YaHei, sans-serif' }}>
      <h1 style={{ color: '#E65100', textAlign: 'center', marginBottom: '30px' }}>我的喂猫服务</h1>
      
      {/* 渲染猫咪列表 */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>正在加载云端数据...</p>
      ) : (
        cats.map(cat => (
          <CatCard key={cat.id} name={cat.name} desc={cat.desc} age={cat.age} />
        ))
      )}

      {/* 添加猫咪的表单 */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', margin: '20px auto', maxWidth: '500px', boxShadow: '0 2px 8px #ddd' }}>
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
            添加到云端
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;