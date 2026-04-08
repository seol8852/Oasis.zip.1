import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();

  const [weather, setWeather] = useState({ city: "로딩중...", temp: "", desc: "", icon: "" });

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
          icon: res.data.weather[0].icon
        });
      } catch (error) {
        console.error("날씨 가져오기 실패:", error);
      }
    };

    if (WEATHER_KEY !== "424b327e43597e404a63f0bff675f2d3") {
      fetchWeather();
    }
  }, []);

  const handleRecommendClick = () => {
    navigate('/analysis', { state: { weatherInfo: weather } });
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
          width: '350px', height: '70px', backgroundColor: '#48cae4', color: 'white', border: 'none', borderRadius: '20px', boxShadow: '0 6px 15px rgba(72, 202, 228, 0.4)', position: 'absolute', bottom: '100px', left: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '17px' 
        }}
      >
        지금 자신에게 맞는 노래 추천받기!
      </button>

      <p style={{ position: 'absolute', bottom: '60px', width: '100%', textAlign: 'center', fontSize: '13px', color: '#777' }}>
        지역과 날씨가 맞지 않으신가요?
      </p>
      
    </div>
  );
};

export default Home;
