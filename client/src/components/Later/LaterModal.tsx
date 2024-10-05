import React, { useState, useEffect, KeyboardEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus as plus } from "@fortawesome/free-solid-svg-icons";
import { addLater, editLater, deleteLater } from "../../API/laterAPI";
import { useNavigate } from "react-router-dom";
import LaterItem from "./LaterItem";

interface LaterModalProps {
  fetchLaters: () => Promise<Array<{ _id: string; title: string }>>;
  onClose: () => void;
}
const LaterModal: React.FC<LaterModalProps> = ({ onClose, fetchLaters }) => {
  const [laterText, setLaterText] = useState("");
  const [laters, setLaters] = useState<Array<{ _id: string; title: string }>>(
    []
  );
  const navigate = useNavigate();

  useEffect(() => {
    const loadLaters = async () => {
      try {
        const data = await fetchLaters();
        setLaters(data);
      } catch (error) {
        console.error("Error fetching loadLaters:", error);
        navigate("/");
      }
    };
    loadLaters();
  }, [fetchLaters, navigate]);

  const handleAddLater = async () => {
    try {
      const newLater = await addLater(laterText);
      setLaters([...laters, newLater]);
      setLaterText("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEditLater = async (id: string, newTitle: string) => {
    try {
      const updatedLater = await editLater(id, newTitle);
      setLaters((prevLaters) =>
        prevLaters.map((later) =>
          later._id === id
            ? {
                ...later,
                title: updatedLater.title,
              }
            : later
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteLater = async (id: string) => {
    try {
      await deleteLater(id);
      setLaters((prevLaters) => prevLaters.filter((later) => later._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddLater();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full xs:p-4 mb:p-5 sm:p-6 xs:max-w-xs mb:max-w-sm sm:max-w-sm max-h-600 flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">나중애벌레</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <ul className="grid grid-cols-2 p-1 my-2 xs:gap-3 mb:gap-3 gap-4 overflow-y-scroll">
          {laters.map((later) => (
            <LaterItem
              key={later._id}
              later={later}
              onEdit={handleSaveEditLater}
              onDelete={handleDeleteLater}
            />
          ))}
        </ul>
        <form className="flex justify-center" onSubmit={handleSubmit}>
          <input
            type="text"
            className="xs:my-2 my-4 mr-2 w-full rounded-md shadow bg-point_blue font-normal p-2 placeholder-white"
            placeholder="나중에 할일, 잡생각을 입력해주세요"
            maxLength={32}
            value={laterText}
            onChange={(e) => setLaterText(e.target.value)}
          />
          <button type="submit" className="cursor-pointer">
            <FontAwesomeIcon
              icon={plus}
              size="2xl"
              style={{ color: "#80CAFF", height: "45px" }}
            />
          </button>
        </form>
      </div>
    </div>
  );
};
export default LaterModal;
