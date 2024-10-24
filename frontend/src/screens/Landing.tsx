import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center pt-10">
      <div className="flex gap-16 w-3/5">
        <div>
          <img src="/chessBoard.jpeg" alt="chessBoard" className="max-w-4/5" />
        </div>
        <div>
          <h1 className="text-6xl font-bold">
            Play Chess Online on the #-1 Site!
          </h1>
          <button
            onClick={() => navigate("/game")}
            className="text-white font-bold py-2 px-4 rounded bg-blue-500 hover:bg-blue-700 mt-10"
          >
            Play Online
          </button>
        </div>
      </div>
    </div>
  );
}
