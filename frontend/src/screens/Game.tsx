import { useEffect, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export default function Game() {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === INIT_GAME) {
        console.log("Game initialized");
        console.log(message);
        setChess(new Chess());
        setBoard(chess.board());
      }

      if (message.type === MOVE) {
        console.log("Move received", message);
        const move = message.payload;
        chess.move(move);
        setBoard(chess.board());
      }

      if (message.type === GAME_OVER) {
        console.log("Game over", message);
      }
    };
  }, [socket, chess]);

  if (!socket) {
    return <div className="font-bold text-3xl">Connecting...</div>;
  }
  return (
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4 w-full">
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              board={board}
              socket={socket}
            />
          </div>
          <div className="col-span-2">
            <button
              onClick={() => socket.send(JSON.stringify({ type: INIT_GAME }))}
              className="text-white font-bold py-2 px-4 bg-green-600 hover:bg-green-500 w-full h-16 rounded-xl text-2xl"
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
