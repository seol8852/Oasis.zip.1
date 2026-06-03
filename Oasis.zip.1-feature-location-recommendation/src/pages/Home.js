import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ◀ 여기서 발생한 react-serif 에러를 정상 수정했습니다!

const Home = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const WEATHER_KEY = process.env.REACT_APP_WEATHER_KEY;

  // 백그라운드에서 날씨 정보 미리 로드
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (!WEATHER_KEY) return;
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Osan&units=metric&lang=kr&appid=${WEATHER_KEY}`
        );
        setWeather({
          icon: res.data.weather[0].icon,
          city: "경기도 오산시",
          temp: `${Math.round(res.data.main.temp)}°C`,
          desc: res.data.weather[0].description
        });
      } catch (err) {
        console.error("날씨 정보 로드 실패:", err);
      }
    };
    fetchWeather();
  }, [WEATHER_KEY]);

  // 위치 정보 기반 페이지 이동 함수
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => navigate('/nearby', { state: { lat: pos.coords.latitude, lon: pos.coords.longitude } }),
        () => navigate('/nearby', { state: { lat: 37.1498, lon: 127.0772 } })
      );
    } else {
      navigate('/nearby', { state: { lat: 37.1498, lon: 127.0772 } });
    }
  };

  const styles = {
    container: {
      width: '390px',
      height: '100vh',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #E0F2FE 0%, #F0F9FF 60%, #FFFFFF 100%)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box'
    },
    header: {
      padding: '30px 24px 0',
      display: 'flex',
      justifyContent: 'flex-start'
    },
    logo: {
      margin: 0,
      fontSize: '26px',
      fontWeight: '800',
      color: '#38BDF8',
      letterSpacing: '-0.5px'
    },
    centerSection: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    loadingCard: {
      width: '220px',
      height: '220px',
      backgroundColor: '#FFFFFF',
      borderRadius: '32px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
      // 중앙 로딩 카드가 끊임없이 둥둥 위아래로 움직이는 애니메이션 추가
      animation: 'floatCard 3s ease-in-out infinite'
    },
    loadingText: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#475569'
    },
    bottomSection: {
      padding: '0 24px 35px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    btnWeather: {
      width: '100%',
      padding: '18px',
      borderRadius: '16px',
      border: 'none',
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: '15px',
      cursor: 'pointer',
      background: 'linear-gradient(90deg, #38BDF8 0%, #3B82F6 100%)',
      boxShadow: '0 4px 12px rgba(56, 189, 248, 0.2)'
    },
    btnLocation: {
      width: '100%',
      padding: '18px',
      borderRadius: '16px',
      border: 'none',
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: '15px',
      cursor: 'pointer',
      background: 'linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
    },
    btnAi: {
      width: '100%',
      padding: '18px',
      borderRadius: '16px',
      border: 'none',
      color: '#2563EB',
      fontWeight: 'bold',
      fontSize: '15px',
      cursor: 'pointer',
      backgroundColor: '#E0F2FE'
    },
    footerText: {
      textAlign: 'center',
      fontSize: '12px',
      color: '#94A3B8',
      marginTop: '8px',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      {/* 상단 로고 */}
      <div style={styles.header}>
        <h1 style={styles.logo}>oasis.zip</h1>
      </div>

      {/* 중앙 계속 움직이는 로딩 카드 */}
      <div style={styles.centerSection}>
        <div style={styles.loadingCard}>
          <div className="spinner"></div>
          <div style={styles.loadingText}>오아시스를 찾는 중...</div>
        </div>
      </div>

      {/* 하단 3개 버튼 레이아웃 */}
      <div style={styles.bottomSection}>
        <button 
          onClick={() => navigate('/analysis', { state: { type: 'weather', weatherInfo: weather } })} 
          style={styles.btnWeather}
        >
          지금 날씨에 맞는 노래 추천받기!
        </button>
        
        <button 
          onClick={handleLocationClick} 
          style={styles.btnLocation}
        >
          내 주변 장소에 맞는 노래 추천받기!
        </button>
        
        <button 
          onClick={() => navigate('/ai-recommendation')} 
          style={styles.btnAi}
        >
          AI 감성 맞춤 추천받기! 🤖
        </button>

        <div style={styles.footerText}>
          버튼을 눌러 오아시스를 경험해보세요 🎵
        </div>
      </div>

      {/* 회전하는 스피너 & 둥둥 뜨는 카드 CSS 애니메이션 */}
      <style>{`
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #E2E8F0;
          border-top: 4px solid #38BDF8;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
};

export default Home;