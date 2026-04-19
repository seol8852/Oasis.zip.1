import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LocationSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const mapContainer = useRef(null);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 카카오맵 렌더링 및 장소 검색 Effect
  useEffect(() => {
    // 1. 위치 정보 체크
    if (!state.lat || !state.lon) {
      alert('위치 정보를 확인할 수 없습니다. 다시 시도해주세요.');
      navigate('/');
      return;
    }

    // 2. 카카오맵 스크립트 로드 대기 (index.html에서 로드된 객체 확인)
    const initMap = () => {
      const { kakao } = window;

      // kakao 객체가 아직 없으면 약간 대기 후 다시 시도 (재귀)
      if (!kakao || !kakao.maps || !kakao.maps.services) {
        console.log("Waiting for Kakao Maps to load...");
        setTimeout(initMap, 500);
        return;
      }

      console.log("Kakao Map API is ready.");

      // 지도를 담을 DOM 엘리먼트가 준비되지 않았다면 대기
      if (!mapContainer.current) {
        console.log("Waiting for map container DOM...");
        setTimeout(initMap, 500);
        return;
      }

      // kakao.maps.load 콜백 안에서 실제 지도를 초기화해야 안전함
      kakao.maps.load(() => {
        const position = new kakao.maps.LatLng(state.lat, state.lon);

        const mapOptions = {
          center: position,
          level: 3,
        };

        const map = new kakao.maps.Map(mapContainer.current, mapOptions);

        new kakao.maps.Marker({
          position: position,
          map: map
        });

        const ps = new kakao.maps.services.Places(map);

        ps.categorySearch('CE7', (data, status) => {
            let allPlaces = [];
            if (status === kakao.maps.services.Status.OK) allPlaces = [...data];

            ps.categorySearch('AT4', (data2, status2) => {
                if (status2 === kakao.maps.services.Status.OK) allPlaces = [...allPlaces, ...data2];

                ps.categorySearch('FD6', (data3, status3) => {
                    if (status3 === kakao.maps.services.Status.OK) allPlaces = [...allPlaces, ...data3];

                    // 집(가짜 데이터)을 예외 처리로 추가
                    const homePlace = {
                        id: 'home-special-id',
                        place_name: '포근한 우리 집',
                        category_group_name: '집/휴식',
                        category_group_code: 'HOME',
                        category_name: '집',
                        distance: '0',
                        x: state.lon,
                        y: state.lat
                    };
                    allPlaces.push(homePlace);

                    allPlaces.sort((a, b) => parseInt(a.distance) - parseInt(b.distance));
                    setPlaces(allPlaces.slice(0, 10));
                    setIsLoading(false);

                    allPlaces.slice(0, 10).forEach(place => {
                        // 집(가짜 데이터)은 지도 마커 생성 생략 또는 기본 마커 사용
                        if(place.id !== 'home-special-id') {
                            new kakao.maps.Marker({
                                map: map,
                                position: new window.kakao.maps.LatLng(place.y, place.x),
                                title: place.place_name,
                                image: new window.kakao.maps.MarkerImage(
                                    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                                    new window.kakao.maps.Size(24, 35)
                                )
                            });
                        }
                    });
                }, {useMapCenter: true, radius: 500});
            }, {useMapCenter: true, radius: 500});
        }, {useMapCenter: true, radius: 500});
      });
    };

    // 맵 초기화 함수 최초 실행
    initMap();

  }, [navigate, state.lat, state.lon]);

  const handlePlaceSelect = (place) => {
    navigate('/analysis', {
        state: {
            type: 'selected_location',
            selectedPlace: place,
            lat: state.lat,
            lon: state.lon
        }
    });
  };

  return (
    <div style={{ width: '390px', margin: '0 auto', backgroundColor: '#e6f4f1', minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '20px', backgroundColor: 'white', zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'relative' }}>
        <div
          onClick={() => navigate('/')}
          style={{ color: '#0077b6', fontWeight: '900', fontSize: '20px', letterSpacing: '1px', cursor: 'pointer', display: 'inline-block' }}
        >
          oasis.zip
        </div>
        <div style={{ fontSize: '14px', color: '#333', marginTop: '10px', fontWeight: 'bold' }}>
            당신은 지금 어디에 있나요? 📍
        </div>
      </div>

      <div
        id="map"
        ref={mapContainer}
        style={{ width: '100%', height: '250px', backgroundColor: '#ddd' }}
      >
        {isLoading && <div style={{textAlign: 'center', paddingTop: '110px', color: '#777'}}>지도를 불러오는 중...</div>}
      </div>

      <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', overflowY: 'auto', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', marginTop: '-15px', zIndex: 10, position: 'relative', boxShadow: '0 -5px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333' }}>내 주변 핫플레이스 목록</h3>

        {isLoading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#777' }}>주변 장소를 탐색 중입니다...</div>
        ) : places.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#777' }}>
                주변에 추천할 만한 장소가 보이지 않아요. 😢<br/>
            </div>
        ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {places.map((place) => (
                    <li
                        key={place.id}
                        onClick={() => handlePlaceSelect(place)}
                        style={{
                            padding: '15px',
                            marginBottom: '10px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    >
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#333', marginBottom: '4px' }}>
                                {place.place_name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                {place.category_group_name || '분류 없음'} {place.distance !== '0' ? `· ${place.distance}m` : ''}
                            </div>
                        </div>
                        <div style={{ color: '#0077b6', fontSize: '18px' }}>›</div>
                    </li>
                ))}
            </ul>
        )}
      </div>

    </div>
  );
};

export default LocationSelector;