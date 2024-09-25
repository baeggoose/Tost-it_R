import { useState, useEffect } from "react";
import { convertToGridCoords } from "../../utils/weatherUtils";

export const useLocation = (isOpen: boolean) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    nx: number;
    ny: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const { nx, ny } = convertToGridCoords(latitude, longitude);
          setLocation({ latitude, longitude, nx, ny });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("위치 정보를 가져올 수 없습니다.");
          setIsLoading(false);
        },
        { timeout: 10000, maximumAge: 0 }
      );
    }
  }, [isOpen]);

  return { location, isLoading, error };
};
