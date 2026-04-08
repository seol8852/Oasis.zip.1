import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const weatherData = useMemo(() => {
    return location.state?.weatherInfo || { city: "경기도 오산시", temp: "15°C", desc: "맑음", icon: "01d" };
  }, [location.state?.weatherInfo]);

  const getEmotionalKeyword = (desc) => {
    if (desc.includes("맑")) return "화창한 날씨 기분 좋아지는 산뜻한";

    if (desc.includes("구름 조금") || desc.includes("튼구름") || desc.includes("약간의 구름")) {
      return "선선한 날씨 산책하며 듣기 좋은 포근한"; 
    }

    if (desc.includes("구름") || desc.includes("흐림")) {
      return "흐린 날 차분하게 듣기 좋은 카페 감성"; 
    }

    if (desc.includes("비") || desc.includes("소나기")) return "비 오는 날 창밖을 보며 듣는 감성";
    
    if (desc.includes("눈")) return "눈 오는 날 따뜻한 겨울";
    
    return "기분 전환하기 좋은 일상"; 
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const emotionalKeyword = getEmotionalKeyword(weatherData.desc);
      const searchQuery = `${emotionalKeyword} 플레이리스트`; 

      console.log("🔍 유튜브에 검색할 진짜 키워드:", searchQuery); 
      navigate('/result', { state: { searchQuery: searchQuery } });
    }, 1000); 

    return () => clearTimeout(timer);
  }, [navigate, weatherData]);

  return (
    <div style={{ width: '390px', margin: '0 auto', backgroundColor: '#e6f4f1', height: '100vh', position: 'relative' }}>
      
      <div style={{ position: 'absolute', top: '20px', left: '20px', color: '#0077b6', fontWeight: '900', fontSize: '20px', letterSpacing: '1px' }}>
        oasis.zip
      </div>

      <div style={{ width: '130px', height: '140px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0, 119, 182, 0.08)', position: 'absolute', top: '50px', right: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {weatherData.icon && (
          <img src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt="weather icon" style={{ width: '60px', height: '60px', marginTop: '-10px' }} />
        )}
        <h3 style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#333' }}>{weatherData.city}</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#555', fontWeight: 'bold' }}>{weatherData.temp} {weatherData.desc}</p>
      </div>

      <div style={{ 
        width: '350px', height: '70px', backgroundColor: '#48cae4', color: 'white', borderRadius: '20px', boxShadow: '0 6px 15px rgba(72, 202, 228, 0.4)', position: 'absolute', bottom: '100px', left: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '17px'
      }}>
        {weatherData.desc} 날씨에 맞는 노래 찾는 중...
      </div>

    </div>
  );
};

export default Analysis;