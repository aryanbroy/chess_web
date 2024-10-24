import { useEffect, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const COUNT = "count";

export default function Game() {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [invalidMoveError, setInvalidMoveError] = useState(false);
  const [allMoves, setAllMoves] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === INIT_GAME) {
        setIsPlaying(true);
        setGameOver(false);
        setWinner(null);
        console.log("Game initialized");
        console.log(message);
        setChess(new Chess());
        setBoard(chess.board());
      }

      if (message.type === MOVE) {
        console.log("Move received", message);
        setInvalidMoveError(false);
        try {
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
        } catch (error) {
          console.log(error);
          setInvalidMoveError(true);
        }
      }

      if (message.type === GAME_OVER) {
        console.log("Game over", message);
        setGameOver(true);
        setWinner(message.payload.winner);
      }

      if (message.type === COUNT) {
        console.log(message);
        setAllMoves(message.payload.latestMove);
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
              from={from}
              setFrom={setFrom}
              to={to}
              setTo={setTo}
            />
          </div>
          <div className="col-span-2">
            {!isPlaying ? (
              <button
                onClick={() => socket.send(JSON.stringify({ type: INIT_GAME }))}
                className="text-white font-bold py-2 px-4 bg-green-600 hover:bg-green-500 w-full h-16 rounded-xl text-2xl"
              >
                Play
              </button>
            ) : (
              <div>
                <h3 className="text-4xl font-bold">Moves</h3>
                <div className="text-3xl font-bold flex gap-4">
                  {allMoves.map((move, i) => (
                    <div key={i}>
                      <div>{move}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {gameOver && (
              <div className="text-4xl font-bold mt-10">{winner} won!!</div>
            )}
            {invalidMoveError && (
              <div className="text-red-500 font-semibold mt-5 text-2xl">
                Invalid move
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
