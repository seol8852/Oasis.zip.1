import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const [analysisText, setAnalysisText] = useState("당신만의 오아시스를 찾는 중...");

  // 카카오 REST API 키
  const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY || "0c88817011af7d25b887d2cd03c979d1";

  // 구글 Gemini API 키
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyBamIPisG9Bdlg3x7nlns6rs_8c0QwvLZA";

  const getEmotionalKeywordFromWeather = (desc) => {
    if (desc.includes("맑")) return "화창한 날씨 기분 좋아지는 산뜻한";
    if (desc.includes("구름 조금") || desc.includes("튼구름") || desc.includes("약간의 구름")) return "선선한 날씨 산책하며 듣기 좋은 포근한";
    if (desc.includes("구름") || desc.includes("흐림")) return "흐린 날 차분하게 듣기 좋은 카페 감성";
    if (desc.includes("비") || desc.includes("소나기")) return "비 오는 날 창밖을 보며 듣는 감성";
    if (desc.includes("눈")) return "눈 오는 날 따뜻한 겨울";
    return "기분 전환하기 좋은 일상";
  };

  const getEmotionalKeywordFromLocation = (categoryCode, categoryName) => {
    if (categoryCode === 'HOME') return "편안한 집에서 휴식할 때 듣는 감성 팝송";

    switch (categoryCode) {
      case 'CE7': return "잔잔한 카페 재즈 커피와 어울리는 로파이(Lo-fi)";
      case 'SW8':
      case 'BK9':
      case 'PO3': return "지루한 대기시간을 달래주는 트렌디한 팝송 퇴근길 지옥철 노동요";
      case 'AT4':
      case 'CT1': return "고궁 산책에 어울리는 퓨전 국악 전시회 감성의 앰비언트 뮤직";
      case 'PK6':
      case 'CS2': return "드라이브 출발 전 신나는 비트 야식 사러 가는 가벼운 발걸음 시티팝";
      case 'FD6': return "맛있는 식사와 함께하는 기분 좋은 팝송";
      case 'SC4':
      case 'AC5': return "도서관 집중할 때 듣기 좋은 백색소음 공부할 때 듣는 피아노";
      case 'MT1':
      case 'PM9':
      case 'HP8': return "마음을 편안하게 해주는 힐링 뉴에이지";
      case 'PS3': return "동심으로 돌아가는 맑은 기분의 인디 음악";
      case 'OL7': return "신나는 드라이브 팝송";
      case 'AD5': return "호캉스 휴식을 위한 칠아웃(Chill-out) 라운지 음악";
      default: return `${categoryName || '현재 장소'}에 어울리는 분위기 있는 감성 플레이리스트`;
    }
  };

  const askGeminiForPlaylist = async (address) => {
    try {
      const prompt = `사용자는 지금 '${address}'에 있어. 이 장소의 지리적, 환경적 분위기(예: 도심, 바다, 산, 주택가, 대학가 등)를 고려해서 유튜브에서 검색할 만한 음악 플레이리스트 키워드를 딱 1개만 추천해줘. (예시: "한적한 동네 산책하며 듣기 좋은 어쿠스틱", "활기찬 대학가에서 듣는 트렌디한 K-POP"). 다른 말은 하지 말고 딱 검색어만 문자열로 대답해줘. 마지막에 '플레이리스트'라는 단어를 꼭 붙여줘.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        let aiKeyword = response.data.candidates[0].content.parts[0].text.trim();
        aiKeyword = aiKeyword.replace(/^["']|["']$/g, '').replace(/\n/g, ' ');
        return aiKeyword;
      }
      return null;
    } catch (error) {
      console.error("Gemini API 호출 실패:", error);
      return null;
    }
  };

  useEffect(() => {
    const analyzeContext = async () => {
      if (state.type === 'weather') {
        const weatherData = state.weatherInfo || { city: "경기도 오산시", temp: "15°C", desc: "맑음", icon: "01d" };
        setAnalysisText(`'${weatherData.desc}' 날씨에 맞는 노래 찾는 중...`);

        const emotionalKeyword = getEmotionalKeywordFromWeather(weatherData.desc);
        const searchQuery = `${emotionalKeyword} 플레이리스트`;

        setTimeout(() => {
          navigate('/result', { state: { searchQuery } });
        }, 1500);

      } else if (state.type === 'selected_location') {
        // 사용자가 직접 장소를 선택한 경우
        const place = state.selectedPlace;
        setAnalysisText(`'${place.place_name}'에 어울리는 노래를 찾는 중...`);
        const searchQuery = getEmotionalKeywordFromLocation(place.category_group_code, place.category_name);

        setTimeout(() => {
          navigate('/result', { state: { searchQuery } });
        }, 1500);

      } else if (state.type === 'location') {
        // AI 추천 로직 (주변에 장소가 없을 때 LocationSelector에서 호출)
        setAnalysisText("주변 특징을 파악하여 AI가 음악을 고르고 있습니다...");

        const addressRes = await axios.get(
          `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${state.lon}&y=${state.lat}`,
          { headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` } }
        );

        let currentAddress = "대한민국 어딘가";
        if (addressRes.data.documents && addressRes.data.documents.length > 0) {
          currentAddress = addressRes.data.documents[0].address.address_name;
          setAnalysisText(`'${currentAddress}'의 분위기를 AI가 분석 중...`);
        }

        const aiRecommendation = await askGeminiForPlaylist(currentAddress);

        let searchQuery = aiRecommendation || "한적한 동네 산책하며 듣기 좋은 산책 플레이리스트";

        setTimeout(() => {
          navigate('/result', { state: { searchQuery } });
        }, 2000);

      } else {
        navigate('/');
      }
    };

    analyzeContext();
  }, [navigate, state]);

  return (
    <div style={{ width: '390px', margin: '0 auto', backgroundColor: '#e6f4f1', height: '100vh', position: 'relative' }}>
      
      <div
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: '20px', left: '20px', color: '#0077b6', fontWeight: '900', fontSize: '20px', letterSpacing: '1px', cursor: 'pointer', zIndex: 100 }}
      >
        oasis.zip
      </div>

      <div style={{ 
        width: '350px', height: '100px', backgroundColor: '#48cae4', color: 'white', borderRadius: '20px', boxShadow: '0 6px 15px rgba(72, 202, 228, 0.4)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '16px', padding: '0 20px', textAlign: 'center', boxSizing: 'border-box'
      }}>
        <div style={{ marginBottom: '10px' }}>🔍</div>
        {analysisText}
      </div>

    </div>
  );
};

export default Analysis;