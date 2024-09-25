import { useState, useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export const useReverseGeocoding = (latitude: number, longitude: number) => {
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (latitude === 0 || longitude === 0) return;

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        const coords = new window.kakao.maps.LatLng(latitude, longitude);

        geocoder.coord2RegionCode(
          coords.getLng(),
          coords.getLat(),
          (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              for (let i = 0; i < result.length; i++) {
                // 행정동(region_type === 'H') 주소만 가져옴
                if (result[i].region_type === "H") {
                  const currentLocation = `${result[i].region_1depth_name} ${result[i].region_2depth_name} ${result[i].region_3depth_name}`;
                  setAddress(currentLocation);
                  break;
                }
              }
            } else {
              console.error("Failed to fetch address");
            }
          }
        );
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [latitude, longitude]);

  return address;
};
