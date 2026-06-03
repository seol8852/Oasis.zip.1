import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Mood = () => {
  const navigate = useNavigate();
  const [activeMood, setActiveMood] = useState('joy');

  const moods = {
    joy: { name: '기쁨', sub: 'Joy', color: '#FFD043', query: '신나고 기쁜 노래' },
    peace: { name: '평화', sub: 'Calm', color: '#34C2F9', query: '마음이 편안해지는 노래' },
    sadness: { name: '슬픔', sub: 'Sad', color: '#6CA6FA', query: '슬프고 잔잔한 위로 노래' },
    anger: { name: '분노', sub: 'Anger', color: '#EF4444', query: '스트레스를 날려버릴 강렬하고 신나는 노래' },
    focus: { name: '집중', sub: 'Focus', color: '#A796FF', query: '공부할 때 듣기 좋은 집중 노래' }
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '390px',
      minHeight: '100vh',
      height: '100dvh',
      margin: '0 auto',
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'auto',
      // 💡 [수정됨] 투명도를 대폭 올려서(A6: 약 65%, 4D: 약 30%) 색상이 진하고 선명하게 보이도록 변경
      background: `linear-gradient(180deg, ${moods[activeMood].color}A6 0%, ${moods[activeMood].color}4D 40%, #F8FAFC 80%, #FFFFFF 100%)`,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box',
      transition: 'background 0.5s ease'
    },
    header: { 
      padding: '20px 24px 0', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      flexShrink: 0
    },
    logo: { 
      margin: 0, 
      fontSize: '16px', 
      fontWeight: '900', 
      color: '#1E293B', // 배경이 진해졌으므로 로고 글씨를 어둡게 변경해 가독성 확보
      cursor: 'pointer' 
    },
    badge: {
      fontSize: '11px', 
      background: 'rgba(255,255,255,0.8)', 
      color: '#1E293B', 
      padding: '4px 10px', 
      borderRadius: '20px', 
      fontWeight: 'bold',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
    },
    titleSection: { 
      textAlign: 'center', 
      marginTop: '15px',
      flexShrink: 0
    },
    mainTitle: { 
      fontSize: '24px', 
      fontWeight: '800', 
      color: '#1E293B', 
      marginBottom: '6px' 
    },
    subTitle: { 
      fontSize: '13px', 
      color: '#334155', // 서브타이틀도 더 잘 보이게 톤 다운
      fontWeight: '600'
    },
    
    circleArea: { 
      position: 'relative', 
      width: '100%', 
      height: '260px',
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0
    },
    centerSphere: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100px',
      height: '100px', 
      borderRadius: '50%', 
      background: 'rgba(255, 255, 255, 0.9)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      zIndex: 2, 
      border: '4px solid #FFFFFF'
    },
    
    chipContainer: { 
      display: 'flex', 
      flexWrap: 'wrap', 
      justifyContent: 'center', 
      gap: '8px', 
      padding: '10px 24px',
      flexShrink: 0
    },
    chip: (key) => ({
      padding: '9px 16px', 
      borderRadius: '20px', 
      border: 'none', 
      fontWeight: '700', 
      fontSize: '13px', 
      cursor: 'pointer',
      background: activeMood === key ? moods[key].color : '#FFFFFF',
      color: activeMood === key ? '#FFFFFF' : '#64748B',
      boxShadow: activeMood === key ? '0 4px 10px rgba(0,0,0,0.1)' : '0 2px 6px rgba(0,0,0,0.05)', 
      transition: 'all 0.3s ease'
    }),

    bottomSection: { 
      marginTop: 'auto', 
      padding: '15px 24px 30px 24px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '10px',
      flexShrink: 0
    },
    btnSubmit: { 
      width: '100%', 
      padding: '16px', 
      borderRadius: '16px', 
      border: 'none', 
      color: 'white', 
      fontWeight: 'bold', 
      fontSize: '15px',
      background: 'linear-gradient(90deg, #1E293B 0%, #334155 100%)', // 하단 버튼을 다크톤으로 잡아주어 밸런스 조정
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    btnTextIn: { 
      width: '100%', 
      padding: '15px', 
      borderRadius: '16px', 
      border: 'none', 
      color: '#1E293B', 
      fontWeight: 'bold', 
      fontSize: '15px',
      backgroundColor: 'rgba(255,255,255,0.6)', 
      cursor: 'pointer' 
    },
    btnHome: { 
      width: '100%', 
      padding: '15px', 
      borderRadius: '16px', 
      border: 'none', 
      color: '#64748B', 
      fontWeight: 'bold', 
      fontSize: '15px',
      backgroundColor: '#FFFFFF', 
      boxShadow: '0 4px 10px rgba(0,0,0,0.03)', 
      cursor: 'pointer' 
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span onClick={() => navigate('/')} style={styles.logo}>‹ oasis.zip</span>
        <span style={styles.badge}>Emotional Palette</span>
      </div>

      <div style={styles.titleSection}>
        <h2 style={styles.mainTitle}>지금 당신의 감정은?</h2>
        <p style={styles.subTitle}>감정 버튼을 눌러 오아시스를 열어보세요</p>
      </div>

      <div style={styles.circleArea}>
        <div style={styles.centerSphere}>
          <div style={{fontSize:'10px', color:'#1E293B', fontWeight:'800', letterSpacing:'0.5px'}}>OASIS</div>
          <div style={{fontSize:'13px', fontWeight:'700', color:'#475569', marginTop:'1px'}}>선택</div>
        </div>
        
        {Object.entries(moods).map(([key, m], idx) => {
          const angles = [270, 342, 54, 126, 198]; 
          const radius = 95; 
          const x = Math.cos(angles[idx] * Math.PI / 180) * radius;
          const y = Math.sin(angles[idx] * Math.PI / 180) * radius;
          
          return (
            <div 
              key={key} 
              onClick={() => setActiveMood(key)} 
              style={{
                position: 'absolute', 
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${activeMood === key ? '1.1' : '1'})`,
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: m.color,
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                color: '#FFFFFF', 
                fontSize: '11px', 
                fontWeight: '700', 
                cursor: 'pointer', 
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: activeMood === key ? `0 8px 20px ${m.color}80` : '0 4px 10px rgba(0,0,0,0.1)',
                border: activeMood === key ? '3px solid #FFFFFF' : '2px solid rgba(255,255,255,0.5)',
                zIndex: 3
              }}
            >
              <div style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{m.name}</div>
              <div style={{fontSize:'9px', opacity: 0.9, fontWeight:'500', marginTop:'1px'}}>{m.sub}</div>
            </div>
          );
        })}
      </div>

      <div style={styles.chipContainer}>
        {Object.keys(moods).map(key => (
          <button key={key} onClick={() => setActiveMood(key)} style={styles.chip(key)}>
            {moods[key].name}
          </button>
        ))}
      </div>

      <div style={styles.bottomSection}>
        <button 
          onClick={() => navigate('/analysis', { state: { type: 'ai', query: moods[activeMood].query } })} 
          style={styles.btnSubmit}
        >
          이 기분으로 노래 추천받기!
        </button>
        <button onClick={() => navigate('/ai-recommendation')} style={styles.btnTextIn}>
          텍스트로 감정 입력하기 ✍️
        </button>
        <button onClick={() => navigate('/')} style={styles.btnHome}>
          처음으로 돌아가기 🏠
        </button>
      </div>
    </div>
  );
};

export default Mood;