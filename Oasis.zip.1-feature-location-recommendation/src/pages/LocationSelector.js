import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LocationSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lat = location.state?.lat || 37.1498; 
  const lon = location.state?.lon || 127.0772;
  const mapContainer = useRef(null);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let retryCount = 0;
    const initMap = () => {
      const { kakao } = window;
      if (!kakao || !kakao.maps || !kakao.maps.services) {
        if (retryCount++ < 10) setTimeout(initMap, 500);
        else setIsLoading(false);
        return;
      }
      const locPosition = new kakao.maps.LatLng(lat, lon);
      
      // 🎯 [오타 수정 완료!] java -> kakao로 올바르게 수정했습니다.
      const map = new kakao.maps.Map(mapContainer.current, { center: locPosition, level: 3 });
      new kakao.maps.Marker({ position: locPosition }).setMap(map);

      const ps = new kakao.maps.services.Places();

      // 카테고리별 검색을 Promise로 처리하는 함수
      const searchCategory = (categoryCode) => {
        return new Promise((resolve) => {
          ps.categorySearch(categoryCode, (data, status) => {
            if (status === kakao.maps.services.Status.OK && data) {
              resolve(data);
            } else {
              resolve([]); 
            }
          }, { location: locPosition, radius: 5000 }); // 5km 반경으로 넉넉하게 설정
        });
      };

      // AT4(관광명소), CT1(문화시설), CE7(카페) 동시 검색 수행
      Promise.all([
        searchCategory('AT4'), 
        searchCategory('CT1'),
        searchCategory('CE7')
      ]).then((results) => {
        const mergedPlaces = results.flat();

        // 만약 세 카테고리 모두 주변에 아무것도 없다면 차선책으로 일반 '맛집' 키워드 검색
        if (mergedPlaces.length === 0) {
          ps.keywordSearch('맛집', (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
              setPlaces(data.slice(0, 5));
            }
            setIsLoading(false);
          }, { location: locPosition, radius: 3000 });
          return;
        }

        // 전체 섞인 장소들을 내 위치에서 가까운 미터(m) 순서대로 정렬
        mergedPlaces.sort((a, b) => Number(a.distance) - Number(b.distance));
        
        // 중복된 장소가 들어올 수 있으므로 ID 기준으로 중복 제거
        const uniquePlaces = mergedPlaces.filter((place, index, self) =>
          self.findIndex((p) => p.id === place.id) === index
        );

        // 가장 가까운 랜드마크 top 5만 지정
        setPlaces(uniquePlaces.slice(0, 5));
        setIsLoading(false);
      }).catch((err) => {
        console.error("장소 검색 중 오류 발생:", err);
        setIsLoading(false);
      });
    };
    initMap();
  }, [lat, lon]);

  return (
    <div style={{ width: '390px', minHeight: '100vh', margin: '0 auto', background: 'linear-gradient(135deg, #F8FAFC 0%, #E0F2FE 100%)', display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      <h1 onClick={() => navigate('/')} style={{ margin: 0, fontSize: '18px', color: '#0EA5E9', cursor: 'pointer', fontWeight: '900', marginBottom: '20px' }}>← oasis.zip</h1>
      <h2 style={{ fontSize: '20px', color: '#1e293b', marginBottom: '10px', fontWeight: '800' }}>현재 내 주변 핫플 📍</h2>
      <div ref={mapContainer} style={{ width: '100%', height: '220px', borderRadius: '20px', marginBottom: '20px', backgroundColor: '#e2e8f0' }} />
      {isLoading ? <div style={{ textAlign: 'center', color: '#64748b' }}>장소 탐색 중... 🔍</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {places.map((place, idx) => (
  // 🎯 'selected_location' 타입과 함께, 장소의 모든 데이터(place)를 통째로 넘겨줍니다!
  <div key={idx} onClick={() => navigate('/analysis', { state: { type: 'selected_location', selectedPlace: place } })} style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '15px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
    <div>
      <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{place.place_name}</div>
      <div style={{ fontSize: '12px', color: '#64748b' }}>{place.distance}m</div>
    </div>
    <div style={{ color: '#0EA5E9', fontWeight: 'bold' }}>›</div>
  </div>
))}
        </div>
      )}
    </div>
  );
};
export default LocationSelector;