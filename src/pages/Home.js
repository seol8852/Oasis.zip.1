import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();

  const [weather, setWeather] = useState({ city: "로딩중...", temp: "", desc: "", icon: "" });

  const WEATHER_KEY = process.env.REACT_APP_WEATHER_KEY || "424b327e43597e404a63f0bff675f2d3";

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
          icon: res.data.weather[0].icon
        });
      } catch (error) {
        console.error("날씨 가져오기 실패:", error);
      }
    };

    fetchWeather();
  }, []);

  const handleRecommendClick = () => {
    navigate('/analysis', { state: { type: 'weather', weatherInfo: weather } });
  };

  const handleLocationRecommendClick = () => {
    // GPS(브라우저 위치) 실패 시 IP 기반으로 대략적인 위치를 가져오는 대체 함수
    const fallbackToIPLocation = async () => {
      try {
        console.log("IP 기반 위치 검색을 시도합니다...");
        const res = await axios.get('https://ipapi.co/json/');
        if (res.data && res.data.latitude && res.data.longitude) {
          navigate('/location-selector', { // LocationSelector 페이지로 이동
            state: {
              lat: res.data.latitude,
              lon: res.data.longitude,
            }
          });
        } else {
          alert("네트워크 위치 정보도 가져올 수 없습니다. 잠시 후 다시 시도해주세요.");
        }
      } catch (err) {
        console.error("IP 위치 가져오기 실패:", err);
        alert("위치 정보를 가져올 수 없습니다. 인터넷 연결 상태를 확인해주세요.");
      }
    };

    if (navigator.geolocation) {
      // 1. 브라우저 GPS 위치 요청
      navigator.geolocation.getCurrentPosition(
        (position) => {
          navigate('/location-selector', { // LocationSelector 페이지로 이동
            state: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            }
          });
        },
        (error) => {
          // 2. GPS 실패 시 (권한 거부, 기기 GPS 꺼짐 등) IP 기반 위치로 대체
          console.warn("브라우저 위치(GPS)를 가져오지 못했습니다. IP 위치로 대체합니다.", error.message);
          fallbackToIPLocation();
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
      );
    } else {
      // 브라우저가 위치 기능을 전혀 지원하지 않는 경우
      fallbackToIPLocation();
    }
  };

  return (
    <div style={{ width: '390px', margin: '0 auto', backgroundColor: '#e6f4f1', height: '100vh', position: 'relative' }}>

      <div style={{ position: 'absolute', top: '20px', left: '20px', color: '#0077b6', fontWeight: '900', fontSize: '20px', letterSpacing: '1px' }}>
        oasis.zip
      </div>

      <div style={{ width: '130px', height: '140px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0, 119, 182, 0.08)', position: 'absolute', top: '50px', right: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

        {weather.icon && (
          <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="weather icon" style={{ width: '60px', height: '60px', marginTop: '-10px' }} />
        )}
        <h3 style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#333' }}>{weather.city}</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#555', fontWeight: 'bold' }}>{weather.temp} {weather.desc}</p>
      </div>

      <button 
        onClick={handleRecommendClick}
        style={{ 
          width: '350px', height: '65px', backgroundColor: '#48cae4', color: 'white', border: 'none', borderRadius: '20px', boxShadow: '0 6px 15px rgba(72, 202, 228, 0.4)', position: 'absolute', bottom: '150px', left: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '17px'
        }}
      >
        지금 날씨에 맞는 노래 추천받기!
      </button>

      <button
        onClick={handleLocationRecommendClick}
        style={{
          width: '350px', height: '65px', backgroundColor: '#0077b6', color: 'white', border: 'none', borderRadius: '20px', boxShadow: '0 6px 15px rgba(0, 119, 182, 0.4)', position: 'absolute', bottom: '70px', left: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '17px'
        }}
      >
        내 주변 장소에 맞는 노래 추천받기!
      </button>

      <p style={{ position: 'absolute', bottom: '30px', width: '100%', textAlign: 'center', fontSize: '13px', color: '#777' }}>
        버튼을 눌러 오아시스를 경험해보세요 🎵
      </p>
      
    </div>
  );
};

export default Home;