import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faHouse } from "@fortawesome/free-solid-svg-icons";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-main_skyblue flex flex-col justify-center items-center min-w-[360px] min-h-[640px] h-screen">
      <section className="bg-main_bg_cloud rounded-xl relative flex flex-col justify-center items-center xs:w-80 mb:w-96 sm:w-98 xs:h-[520px] mb:h-[520px] sm:h-600">
        <h1 className="font-black text-9xl font-mono">404</h1>
        <p className="text-2xl font-mono mt-4">Page Not Found</p>
        <FontAwesomeIcon
          icon={faBan}
          beat
          className="text-9xl my-10"
          color="#2a416a"
        />
        <FontAwesomeIcon
          icon={faHouse}
          className="cursor-pointer"
          style={{ color: "#50b4fc" }}
          size="4x"
          onClick={() => {
            navigate("/");
          }}
        />
        <p className="text-xl font-mono">GO HOME</p>
      </section>
    </div>
  );
}

export default NotFound;
