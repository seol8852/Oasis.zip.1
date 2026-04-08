import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Result = () => {
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || "날씨에 어울리는 노래";
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const YOUTUBE_KEY = "AIzaSyBgNkFgT_0yrZCtGGYIMOmrI8e-1HCz88A"; 

  useEffect(() => {
    const fetchYoutube = async () => {
      try {
        const searchRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
          params: {
            key: YOUTUBE_KEY,
            part: 'snippet',
            q: searchQuery,
            type: 'video',
            order: 'viewCount',
            maxResults: 3,

            videoEmbeddable: 'true',
            videoSyndicated: 'true'
          }
        });
        
        setSongs(searchRes.data.items || []);
        setIsLoading(false);
      } catch (error) {
        console.error("❌ 유튜브 검색 중 에러 발생:", error);
        setIsLoading(false);
      }
    };

    fetchYoutube();
    
  }, [searchQuery]);

  return (
    <div style={{ width: '390px', margin: '0 auto', backgroundColor: '#e6f4f1', minHeight: '100vh', padding: '20px', boxSizing: 'border-box' }}>
      
      <h2 style={{ color: '#0077b6', textAlign: 'center', marginTop: '10px', marginBottom: '30px', fontWeight: '900' }}>
        오늘의 오아시스 플레이리스트 🎧
      </h2>

      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '50px', fontWeight: 'bold', color: '#0077b6' }}>
          최고의 노래를 선별 중입니다...
        </div>
      ) : songs.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', fontWeight: 'bold', color: '#e63946' }}>
          현재 날씨에 맞는 노래를 찾지 못했습니다. 😢
        </div>
      ) : (
        songs.map((song) => (
          <div key={song.id.videoId} style={{ marginBottom: '30px', backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0, 119, 182, 0.1)' }}>
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${song.id.videoId}`}
              title={song.snippet.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div style={{ padding: '15px', backgroundColor: '#ffffff' }}>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {song.snippet.title}
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#48cae4', fontWeight: 'bold' }}>
                {song.snippet.channelTitle}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Result;