'use client';
import React, { useEffect } from 'react';
import GoongMap from '@goongmaps/goong-js';
import axios from 'axios';
import MSTFetch from '@/core/services/fetch';

const MapComponent = ({ placeId }: { placeId: string }) => {
  useEffect(() => {
    const map: any = new GoongMap.Map({
      container: 'map',
      style: 'https://tiles.goong.io/assets/goong_map_web.json',
      center: [107.58886404892952, 16.46378913563872],
      zoom: 13,
      accessToken: process.env.NEXT_PUBLIC_GOONG_MAP_KEY,
    });

    // Hàm gọi API để lấy tọa độ từ Goong
    const fetchCoordinates = async () => {
      try {
        const response = await MSTFetch.get('/goong/coordinates', { params: { placeId } });

        const location = response.data?.results?.[0]?.geometry?.location;

        if (location) {
          const { lat, lng } = location;

          // Tự động focus vào tọa độ
          map.flyTo({
            center: [lng, lat],
          });

          new GoongMap.Marker()
            .setLngLat([lng, lat])
            .addTo(map);
        } else {
          console.error('Không tìm thấy tọa độ hợp lệ từ API.');
        }
      } catch (error: any) {
        console.error('Lỗi khi gọi API:', error.message);
      }
    };

    fetchCoordinates();

    return () => map.remove();
  }, [placeId]);

  return <div className="w-full h-96 border-2 rounded-xl my-2" id="map" />;
};

export default MapComponent;
