import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="relative bg-main_skyblue flex flex-col justify-center items-center h-screen">
      <h1 className="absolute z-10 animate-bounce text-7xl font-alfa text-center">
        Tost-It
      </h1>
      <svg
        className="absolute z-0 w-80 -translate-y-5"
        viewBox="0 0 625 494"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          y="178.657"
          width="314.514"
          height="317.98"
          transform="rotate(-8.60871 0 178.657)"
          fill="#FF9B99"
        />
        <rect
          width="314.514"
          height="317.98"
          transform="matrix(-0.991911 -0.126933 -0.126933 0.991911 476.231 40.5826)"
          fill="#FFFF66"
        />
        <rect
          width="314.514"
          height="317.98"
          transform="matrix(-0.969307 -0.245853 -0.245853 0.969307 624.597 176.82)"
          fill="#4786B3"
        />
      </svg>
    </div>
  );
};

export default Splash;
