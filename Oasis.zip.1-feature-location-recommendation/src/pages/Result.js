import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = location.state?.searchQuery || "날씨에 어울리는 노래";
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState("");

  const YOUTUBE_KEY = process.env.REACT_APP_YOUTUBE_KEY || "AIzaSyBgNkFgT_0yrZCtGGYIMOmrI8e-1HCz88A";

  // 기존 유튜브 API 로직 완벽 유지
  const fetchYoutube = useCallback(async (pageToken = "") => {
    setIsLoading(true);
    try {
      const params = {
        key: YOUTUBE_KEY,
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        order: 'viewCount', // 조회수 순
        maxResults: 5, // UI를 위해 5개로 여유있게 세팅
        videoEmbeddable: 'true',
        videoSyndicated: 'true'
      };

      if (pageToken) params.pageToken = pageToken;

      const searchRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, { params });

      // Load More를 누른 경우 기존 배열에 추가, 아니면 새로 덮어쓰기
      if (pageToken) {
        setSongs(prev => [...prev, ...(searchRes.data.items || [])]);
      } else {
        setSongs(searchRes.data.items || []);
      }
      
      setNextPageToken(searchRes.data.nextPageToken || "");
      setIsLoading(false);
    } catch (error) {
      console.error("❌ 유튜브 검색 중 에러 발생:", error);
      setIsLoading(false);
    }
  }, [searchQuery, YOUTUBE_KEY]);

  useEffect(() => {
    fetchYoutube();
  }, [fetchYoutube]);

  const handleLoadMore = () => {
    if (nextPageToken) fetchYoutube(nextPageToken);
    else alert("더 이상 추천할 노래가 없습니다. 😢");
  };

  // 새로운 UI 테마 적용
  return (
    <div style={{ width: '390px', margin: '0 auto', background: 'linear-gradient(180deg, #E0F2FE 0%, #FFFFFF 100%)', minHeight: '100vh', padding: '24px', boxSizing: 'border-box', position: 'relative', fontFamily: 'sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span onClick={() => navigate('/')} style={{ color: '#38BDF8', fontWeight: '900', fontSize: '18px', cursor: 'pointer' }}>‹ oasis.zip</span>
        <span style={{ fontSize: '11px', background: '#FFFFFF', color: '#0EA5E9', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>Playlist</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#1E293B', fontWeight: '800', fontSize: '22px', margin: '0 0 10px 0' }}>오늘의 오아시스 🎧</h2>
        <p style={{ color: '#0EA5E9', fontSize: '13px', fontWeight: 'bold', background: 'rgba(255,255,255,0.6)', padding: '8px 12px', borderRadius: '12px', display: 'inline-block', margin: 0, border: '1px solid #BAE6FD' }}>
          "{searchQuery}"
        </p>
      </div>

      {isLoading && songs.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '60px', fontWeight: 'bold', color: '#64748B' }}>
          최고의 노래를 선별 중입니다...
        </div>
      ) : songs.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '60px', fontWeight: 'bold', color: '#EF4444' }}>
          조건에 맞는 플레이리스트를 찾지 못했습니다. 😢
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px' }}>
          {songs.map((song) => (
            <div key={song.id.videoId} style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.04)' }}>
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${song.id.videoId}`}
                title={song.snippet.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: 'block', backgroundColor: '#E2E8F0' }}
              ></iframe>
              <div style={{ padding: '16px' }}>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1E293B', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {song.snippet.title}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#38BDF8', fontWeight: 'bold' }}>
                    {song.snippet.channelTitle}
                  </p>
                  <span style={{ fontSize: '11px', color: '#94A3B8', border: '1px solid #E2E8F0', padding: '2px 6px', borderRadius: '6px' }}>YouTube</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 액션 버튼 그룹 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
        {!isLoading && songs.length > 0 && (
          <button
            onClick={handleLoadMore}
            style={{ width: '100%', padding: '16px', backgroundColor: '#E0F2FE', color: '#2563EB', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
          >
            {isLoading ? '불러오는 중...' : '다른 플레이리스트 더 보기 🔄'}
          </button>
        )}
        
        {!isLoading && (
          <button
            onClick={() => navigate('/')}
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(90deg, #38BDF8, #3B82F6)', color: 'white', border: 'none', borderRadius: '16px', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.2)', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
          >
            처음으로 돌아가기 🏠
          </button>
        )}
      </div>
    </div>
  );
};

export default Result;