'use client';
import React, { useEffect } from 'react';
import GoongMap from '@goongmaps/goong-js';
import axios from 'axios';

const MapComponent = ({ placeId }: { placeId: string }) => {
  useEffect(() => {
    const map: any = new GoongMap.Map({
      container: 'map',
      style: 'https://tiles.goong.io/assets/goong_map_web.json',
      center: [107.58886404892952, 16.46378913563872],
      zoom: 13,
      accessToken: 'UEpN0X9kbuPcRA7s62ANe1kzWCo6ikMTCBTRFnYg',
    });

    // Hàm gọi API để lấy tọa độ từ Goong
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get('http://localhost:5001/goong/coordinates', { params: { placeId } });
        console.log('API Response:', response.data);

        const location = response.data?.data?.results?.[0]?.geometry?.location;

        if (location) {
          const { lat, lng } = location;

          map.setCenter([lng, lat]);
          new GoongMap.Marker().setLngLat([lng, lat]).addTo(map);
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
