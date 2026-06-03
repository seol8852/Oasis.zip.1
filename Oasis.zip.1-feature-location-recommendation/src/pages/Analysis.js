import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // 아래 코드에 사용될 axios
import axiosInstance from 'axios'; // 이름 충돌 방지용 일반 axios

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const [analysisText, setAnalysisText] = useState("당신만의 오아시스를 찾는 중...");

  const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY || "bfcf264faab10bcab3edb0f120a72aa4";
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyBamIPisG9Bdlg3x7nlns6rs_8c0QwvLZA";

  const getEmotionalKeywordFromWeather = (desc) => {
    if (!desc) return "기분 전환하기 좋은 일상";
    if (desc.includes("맑")) return "화창한 날씨 기분 좋아지는 산뜻한";
    if (desc.includes("구름 조금") || desc.includes("튼구름") || desc.includes("약간의 구름")) return "선선한 날씨 산책하며 듣기 좋은 포근한";
    if (desc.includes("구름") || desc.includes("흐림")) return "흐린 날 차분하게 듣기 좋은 카페 감성";
    if (desc.includes("비") || desc.includes("소나기")) return "비 오는 날 창밖을 보며 듣는 감성";
    if (desc.includes("눈")) return "눈 오는 날 따뜻한 겨울";
    return "기분 전환하기 좋은 일상";
  };

  const getEmotionalKeywordFromLocation = (categoryCode, categoryName) => {
    if (!categoryCode) return `${categoryName || '현재 장소'}에 어울리는 분위기 있는 감성 플레이리스트`;
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

  const askGeminiForPlaylist = async (prompt) => {
    try {
      let targetModel = "gemini-1.5-flash"; 
      try {
        const modelsRes = await axiosInstance.get(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
        if (modelsRes.data && modelsRes.data.models) {
          const availableModels = modelsRes.data.models.map(m => m.name);
          if (availableModels.includes("models/gemini-2.5-flash")) targetModel = "gemini-2.5-flash";
          else if (availableModels.includes("models/gemini-2.0-flash")) targetModel = "gemini-2.0-flash";
          else if (availableModels.includes("models/gemini-1.5-flash-latest")) targetModel = "gemini-1.5-flash-latest";
          else if (availableModels.includes("models/gemini-1.5-flash")) targetModel = "gemini-1.5-flash";
        }
      } catch (err) {
        console.warn("모델 목록 로드 실패, 기본 모델 사용");
      }

      const response = await axiosInstance.post(
        `https://generativelanguage.googleapis.com/v1/models/${targetModel}:generateContent?key=${GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        let aiKeyword = response.data.candidates[0].content.parts[0].text.trim();
        return aiKeyword.replace(/^["']|["']$/g, '').replace(/\n/g, ' ');
      }
      return null;
    } catch (error) {
      console.error("Gemini API 호출 에러:", error);
      return null; 
    }
  };

  useEffect(() => {
    const analyzeContext = async () => {
      try {
        if (!state || Object.keys(state).length === 0) {
          navigate('/');
          return;
        }

        // 1. 날씨 기반
        if (state.type === 'weather') {
          const weatherData = state.weatherInfo || { desc: "맑음" };
          setAnalysisText(`'${weatherData.desc}' 날씨에 맞는 노래 찾는 중...`);
          const searchQuery = `${getEmotionalKeywordFromWeather(weatherData.desc)} 플레이리스트`;
          setTimeout(() => navigate('/result', { state: { searchQuery } }), 1500);
        } 
        
        // 2. 장소 직접 선택 (데이터 누락 방어막 보강)
        else if (state.type === 'selected_location' || state.selectedPlace) {
          const place = state.selectedPlace || {};
          const placeName = place.place_name || "선택한 장소";
          setAnalysisText(`'${placeName}'에 어울리는 노래를 찾는 중...`);
          
          const searchQuery = getEmotionalKeywordFromLocation(
            place.category_group_code || '', 
            place.category_name || ''
          );
          setTimeout(() => navigate('/result', { state: { searchQuery } }), 1500);
        } 
        
        // 3. 내 주변 위치 자동 파악 (✨ 카카오 API 교체로 정확도/안정성 극대화)
        else if (state.type === 'location') {
          setAnalysisText("주변 특징을 파악하여 AI가 음악을 고르고 있습니다...");
          let currentAddress = "대한민국 어딘가";

          try {
            if (state.lon && state.lat) {
              // 💡 coord2address 대신 coord2regioncode를 사용하여 동네 단위 주소를 완벽하게 받아옵니다.
              const addressRes = await axiosInstance.get(
                `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${state.lon}&y=${state.lat}`,
                { headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` } }
              );
              
              if (addressRes.data?.documents?.length > 0) {
                // 행정동 명칭 추출 (예: 서울특별시 강남구 역삼1동)
                currentAddress = addressRes.data.documents[0].address_name;
                setAnalysisText(`'${currentAddress}' 분위기 분석 중...`);
              }
            }
          } catch (e) {
            console.error("카카오 주소 변환 실패:", e);
          }

          const prompt = `사용자는 지금 '${currentAddress}' 동네에 있어. 이 장소의 지리적, 환경적 분위기(예: 번화가, 한적한 주택가, 대학가, 오피스 상권, 공원 등)를 고려해서 유튜브에서 검색할 만한 음악 플레이리스트 키워드를 딱 1개만 추천해줘. 다른 말은 절대 하지 말고 딱 검색어만 대답해줘. 마지막에 '플레이리스트'라는 단어를 꼭 붙여줘.`;
          const aiRecommendation = await askGeminiForPlaylist(prompt);
          
          const searchQuery = aiRecommendation || "한적한 동네 산책하며 듣기 좋은 산책 플레이리스트";
          setTimeout(() => navigate('/result', { state: { searchQuery } }), 2000);
        } 
        
        // 4. 감정/텍스트 입력
        else if (state.type === 'ai' || state.query) {
          setAnalysisText("입력하신 기분에 맞춰 AI가 음악을 선별 중입니다...");
          const queryText = state.query || "기분 좋은 날";
          
          const prompt = `사용자의 현재 기분이나 상황은 '${queryText}'야. 이 감정에 완벽하게 위로나 공감이 될 수 있는 유튜브 음악 플레이리스트 검색 키워드를 딱 1개만 추천해줘. 다른 말 없이 키워드만 대답하고, 마지막에 '플레이리스트'라는 단어를 꼭 붙여줘.`;
          const aiRecommendation = await askGeminiForPlaylist(prompt);
          
          const searchQuery = aiRecommendation || "기분 전환하기 좋은 감성 플레이리스트";
          setTimeout(() => navigate('/result', { state: { searchQuery } }), 2000);
        } 
        
        else {
          setTimeout(() => navigate('/result', { state: { searchQuery: "인기 감성 팝송 플레이리스트" } }), 1500);
        }

      } catch (globalError) {
        console.error("분석 페이지 오류 발생:", globalError);
        setTimeout(() => navigate('/result', { state: { searchQuery: "기분 좋은 카페 음악 플레이리스트" } }), 1500);
      }
    };

    analyzeContext();
  }, [navigate, state, KAKAO_REST_API_KEY]);

  return (
    <div style={{ width: '390px', margin: '0 auto', background: 'linear-gradient(180deg, #E0F2FE 0%, #F0F9FF 60%, #FFFFFF 100%)', height: '100vh', position: 'relative', fontFamily: 'sans-serif' }}>
      <div onClick={() => navigate('/')} style={{ position: 'absolute', top: '30px', left: '24px', color: '#38BDF8', fontWeight: '900', fontSize: '18px', cursor: 'pointer', zIndex: 100 }}>
        ‹ oasis.zip
      </div>

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '280px', height: '260px', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderRadius: '32px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box', border: '1px solid #BAE6FD' }}>
        <div className="spinner" style={{ marginBottom: '25px' }}></div>
        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#334155', textAlign: 'center', lineHeight: '1.4' }}>
          {analysisText}
        </div>
      </div>

      <style>{`
        .spinner {
          width: 45px; height: 45px;
          border: 4px solid #E2E8F0; border-top: 4px solid #38BDF8;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Analysis;