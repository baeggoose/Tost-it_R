import { useState, useEffect } from "react";
import { convertToGridCoords } from "../../utils/weatherUtils";

export const useLocation = (isOpen: boolean) => {
  const [location, setLocation] = useState<{ nx: number; ny: number } | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const { nx, ny } = convertToGridCoords(latitude, longitude);
          setLocation({ nx, ny });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [isOpen]);

  return location;
};
