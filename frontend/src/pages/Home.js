import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  // ★ 아이콘(icon) 저장소가 추가되었습니다!
  const [weather, setWeather] = useState({ city: "로딩중...", temp: "", desc: "", icon: "" });
  
  // ★ 발급받으신 OpenWeather API 키를 넣어주세요!
  const WEATHER_KEY = "424b327e43597e404a63f0bff675f2d3";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Osan&units=metric&lang=kr&appid=${WEATHER_KEY}`
        );
        
        setWeather({
          city: "경기도 오산시", 
          temp: `${Math.round(res.data.main.temp)}°C`,
          desc: res.data.weather[0].description,
          icon: res.data.weather[0].icon // 날씨 아이콘 데이터 가져오기!
        });
      } catch (error) {
        console.error("날씨 가져오기 실패:", error);
      }
    };

    if (WEATHER_KEY !== "424b327e43597e404a63f0bff675f2d3 ") {
      fetchWeather();
    }
  }, []);

  const handleRecommendClick = () => {
    navigate('/analysis', { state: { weatherInfo: weather } });
  };

  return (
    // 배경색을 청량한 민트/하늘색 톤(#e6f4f1)으로 변경
    <div style={{ width: '390px', margin: '0 auto', backgroundColor: '#e6f4f1', height: '100vh', position: 'relative' }}>
      
      {/* 1. 로고 (오아시스 톤에 맞춘 딥 블루) */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', color: '#0077b6', fontWeight: '900', fontSize: '20px', letterSpacing: '1px' }}>
        oasis.zip
      </div>

      {/* 2. 날씨 정보 박스 (모서리 둥글게, 반투명한 흰색 배경, 그림자) */}
      <div style={{ width: '130px', height: '140px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0, 119, 182, 0.08)', position: 'absolute', top: '50px', right: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {/* 날씨 아이콘 띄우기 */}
        {weather.icon && (
          <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="weather icon" style={{ width: '60px', height: '60px', marginTop: '-10px' }} />
        )}
        <h3 style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#333' }}>{weather.city}</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#555', fontWeight: 'bold' }}>{weather.temp} {weather.desc}</p>
      </div>

      {/* 3. 추천받기 버튼 (모서리 둥글게, 시원한 스카이블루, 입체적인 그림자) */}
      <button 
        onClick={handleRecommendClick}
        style={{ 
          width: '350px', height: '70px', backgroundColor: '#48cae4', color: 'white', border: 'none', borderRadius: '20px', boxShadow: '0 6px 15px rgba(72, 202, 228, 0.4)', position: 'absolute', bottom: '100px', left: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '17px' 
        }}
      >
        지금 자신에게 맞는 노래 추천받기!
      </button>

      {/* 4. 하단 문구 */}
      <p style={{ position: 'absolute', bottom: '60px', width: '100%', textAlign: 'center', fontSize: '13px', color: '#777' }}>
        지역과 날씨가 맞지 않으신가요?
      </p>
      
    </div>
  );
};

export default Home;