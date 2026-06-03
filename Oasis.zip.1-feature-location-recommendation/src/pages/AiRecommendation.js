import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AiRecommendation = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');

  const examples = [
    "오늘 시험 망쳐서 너무 우울해... 위로가 필요해",
    "새벽 3시, 혼자 창밖을 보고 있는데 이상하게 몽글해",
    "친구랑 오랜만에 만나서 술 마시는 중, 행복해",
    "비 오는 날 집에서 코코아 마시며 책 읽는 기분"
  ];

  const styles = {
    container: {
      width: '100%', maxWidth: '390px', minHeight: '100vh', height: '100dvh', margin: '0 auto', position: 'relative', overflowY: 'auto', // ✨ 스크롤 허용 및 모바일 높이(100dvh) 적용
      background: 'linear-gradient(180deg, #E0F2FE 0%, #FFFFFF 100%)', display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box'
    },
    // ... 이하 생략
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    logo: { fontSize: '18px', fontWeight: '800', color: '#38BDF8', cursor: 'pointer' },
    
    titleSection: { textAlign: 'center', marginBottom: '24px' },
    mainTitle: { fontSize: '22px', fontWeight: '800', color: '#1E293B', marginBottom: '8px' },
    subTitle: { fontSize: '13px', color: '#64748B', lineHeight: '1.4' },

    // 입력 영역 카드
    inputCard: {
      background: 'rgba(255, 255, 255, 0.7)', borderRadius: '20px', padding: '20px',
      border: '1px solid #BAE6FD', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)', marginBottom: '20px'
    },
    textarea: {
      width: '100%', height: '120px', border: 'none', background: 'transparent', outline: 'none',
      fontSize: '15px', color: '#334155', resize: 'none', fontFamily: 'sans-serif'
    },

    // 버튼 스타일
    btnSubmit: {
      width: '100%', padding: '18px', borderRadius: '16px', border: 'none', color: 'white',
      fontWeight: 'bold', fontSize: '15px', background: 'linear-gradient(90deg, #38BDF8, #3B82F6)',
      cursor: 'pointer', boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)', marginBottom: '30px'
    },

    // 예시 영역
    exampleSection: { flex: 1 },
    exampleTitle: { fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '12px' },
    exampleItem: {
      background: '#FFFFFF', padding: '12px 16px', borderRadius: '12px', fontSize: '13px',
      color: '#64748B', marginBottom: '8px', cursor: 'pointer', border: '1px solid #F1F5F9'
    },

    bottomSection: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' },
    btnMood: { width: '100%', padding: '15px', borderRadius: '14px', border: 'none', color: '#3B82F6', fontWeight: 'bold', backgroundColor: '#E0F2FE' },
    btnHome: { width: '100%', padding: '15px', borderRadius: '14px', border: 'none', color: '#64748B', fontWeight: 'bold', backgroundColor: '#FFFFFF', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span onClick={() => navigate('/')} style={styles.logo}>‹ oasis.zip</span>
        <span style={{ fontSize: '11px', background: '#FFFFFF', color: '#38BDF8', padding: '4px 10px', borderRadius: '10px', fontWeight: 'bold' }}>AI Matching</span>
      </div>

      <div style={styles.titleSection}>
        <h2 style={styles.mainTitle}>AI 감성 맞춤 추천 🤖</h2>
        <p style={styles.subTitle}>지금 어떤 기분이신가요? 상황이나 감정을 자유롭게 적어주시면<br/>AI가 딱 맞는 음악을 찾아드릴게요!</p>
      </div>

      <div style={styles.inputCard}>
        <textarea 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="지금 어떤 기분이신가요? 자유롭게 적어주세요..." 
          style={styles.textarea}
        />
        <div style={{ textAlign: 'right', fontSize: '11px', color: '#94A3B8' }}>{userInput.length}/500 <span style={{marginLeft:'10px', cursor:'pointer'}} onClick={()=>setUserInput('')}>지우기</span></div>
      </div>

      <button onClick={() => navigate('/analysis', { state: { type: 'ai', query: userInput } })} style={styles.btnSubmit}>
        이 기분에 맞는 노래 추천받기!
      </button>

      <div style={styles.exampleSection}>
        <div style={styles.exampleTitle}>💡 이런 기분을 적어보세요</div>
        {examples.map((ex, i) => (
          <div key={i} onClick={() => setUserInput(ex)} style={styles.exampleItem}>"{ex}"</div>
        ))}
      </div>

      <div style={styles.bottomSection}>
        <button onClick={() => navigate('/mood')} style={styles.btnMood}>감정색상환으로 선택하기 🎨</button>
        <button onClick={() => navigate('/')} style={styles.btnHome}>처음으로 돌아가기 🏠</button>
      </div>
    </div>
  );
};

export default AiRecommendation;