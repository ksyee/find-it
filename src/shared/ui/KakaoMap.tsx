import { useEffect, useRef, useState } from 'react';

interface KakaoMapProps {
  place: string;
  className?: string;
}

const KakaoMap = ({ place, className }: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if ((window as any).kakao?.maps) {
      setIsKakaoLoaded(true);
      return;
    }

    const script = document.querySelector<HTMLScriptElement>(
      'script[src*="dapi.kakao.com"]'
    );
    if (!script) {
      return;
    }

    const handleLoad = () => {
      setIsKakaoLoaded(true);
    };

    script.addEventListener('load', handleLoad);
    return () => {
      script.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    if (!isKakaoLoaded || typeof window === 'undefined') {
      return;
    }

    const container = mapRef.current;
    if (!container) return;

    const kakao = window.kakao;
    if (!kakao || !kakao.maps) {
      return;
    }

    let canceled = false;

    const renderMap = () => {
      if (canceled) return;

      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

      const map = new kakao.maps.Map(container, options);
      const ps = new kakao.maps.services.Places();

      ps.keywordSearch(place, (data, status) => {
        if (
          canceled ||
          status !== kakao.maps.services.Status.OK ||
          !Array.isArray(data) ||
          data.length === 0
        ) {
          return;
        }

        const coords = new kakao.maps.LatLng(
          parseFloat(data[0].y),
          parseFloat(data[0].x)
        );

        map.setCenter(coords);

        new kakao.maps.Marker({
          map,
          position: coords,
        });

        const content = document.createElement('div');
        content.className = 'flex bg-white text-black border border-black px-[12px] py-[4px]';
        const label = document.createElement('span');
        label.className = 'text-xs';
        label.textContent = place;
        content.appendChild(label);

        new kakao.maps.CustomOverlay({
          map,
          position: coords,
          content,
          yAnchor: 2.8,
        });
      });
    };

    kakao.maps.load(renderMap);

    return () => {
      canceled = true;
      container.innerHTML = '';
    };
  }, [place, isKakaoLoaded]);

  return <div ref={mapRef} className={className} />;
};

export default KakaoMap;
