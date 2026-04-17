import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LocationSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const mapContainer = useRef(null);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // 1. 스크립트 로드 Effect
  useEffect(() => {
    // 이미 스크립트가 로드되어 있는 경우 방지
    if (document.getElementById('kakao-map-script')) {
      if (window.kakao && window.kakao.maps) {
        setIsScriptLoaded(true);
      }
      return;
    }

    const KAKAO_MAP_APP_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY || "0c88817011af7d25b887d2cd03c979d1"; // 카카오 맵 JS도 같은 키를 쓰거나, JS용 키가 따로 있다면 교체

    const script = document.createElement("script");
    script.id = "kakao-map-script";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&libraries=services&autoload=false`;
    script.async = true;

    script.onload = () => {
      console.log("Kakao Map SDK script loaded.");
      window.kakao.maps.load(() => {
        console.log("Kakao maps API loaded.");
        setIsScriptLoaded(true);
      });
    };

    script.onerror = () => {
      console.error("Failed to load Kakao Map SDK script.");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트가 언마운트 될 때 스크립트를 제거하면 다시 마운트 될 때 문제가 생길 수 있으므로 제거하지 않음
    };
  }, []);

  // 2. 지도 생성 및 장소 검색 Effect
  useEffect(() => {
    if (!isScriptLoaded || !mapContainer.current) {
      // 스크립트가 로드되지 않았거나, 지도를 담을 div가 준비되지 않았으면 실행하지 않음
      return;
    }

    if (!state.lat || !state.lon) {
      alert('위치 정보를 확인할 수 없습니다. 다시 시도해주세요.');
      navigate('/');
      return;
    }

    console.log("Map container is ready, initializing map...");
    const position = new window.kakao.maps.LatLng(state.lat, state.lon);

    const mapOptions = {
      center: position,
      level: 3,
    };

    const map = new window.kakao.maps.Map(mapContainer.current, mapOptions);
    console.log("Kakao Map initialized successfully.");

    new window.kakao.maps.Marker({
      position: position,
      map: map
    });

    const ps = new window.kakao.maps.services.Places(map);

    ps.categorySearch('CE7', (data, status) => {
        let allPlaces = [];
        if (status === window.kakao.maps.services.Status.OK) allPlaces = [...data];

        ps.categorySearch('AT4', (data2, status2) => {
            if (status2 === window.kakao.maps.services.Status.OK) allPlaces = [...allPlaces, ...data2];

            ps.categorySearch('FD6', (data3, status3) => {
                if (status3 === window.kakao.maps.services.Status.OK) allPlaces = [...allPlaces, ...data3];

                allPlaces.sort((a, b) => parseInt(a.distance) - parseInt(b.distance));
                setPlaces(allPlaces.slice(0, 10));
                setIsLoading(false);

                allPlaces.slice(0, 10).forEach(place => {
                    new window.kakao.maps.Marker({
                        map: map,
                        position: new window.kakao.maps.LatLng(place.y, place.x),
                        title: place.place_name,
                        image: new window.kakao.maps.MarkerImage(
                            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                            new window.kakao.maps.Size(24, 35)
                        )
                    });
                });
            }, {useMapCenter: true, radius: 500});
        }, {useMapCenter: true, radius: 500});
    }, {useMapCenter: true, radius: 500});

  }, [isScriptLoaded, state.lat, state.lon, navigate]);

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

      <div style={{ padding: '20px', color: '#0077b6', fontWeight: '900', fontSize: '20px', letterSpacing: '1px', backgroundColor: 'white', zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        oasis.zip
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
                                {place.category_group_name || '분류 없음'} · {place.distance}m
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