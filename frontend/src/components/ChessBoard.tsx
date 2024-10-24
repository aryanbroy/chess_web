import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
import { MOVE } from "../screens/Game";

export default function ChessBoard({
  board,
  socket,
  chess,
  setBoard,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  chess: Chess;
  setBoard: (
    board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
  ) => void;
}) {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [moveError, setMoveError] = useState(false);

  const handleMove = (j: number, i: number) => {
    const convertedToMove = String.fromCharCode(j + 97) + (8 - i).toString();
    if (!from) {
      setFrom(convertedToMove);
    } else {
      setTo(convertedToMove);
    }
  };

  useEffect(() => {
    const move = {
      from,
      to,
    };
    console.log(move);

    if (from.length > 0 && to.length > 0) {
      setMoveError(false);
      try {
        chess.move(move);
        setBoard(chess.board());
        socket.send(
          JSON.stringify({
            type: MOVE,
            move,
          })
        );
      } catch (error) {
        console.log(error);
        setMoveError(true);
      }
    }

    setFrom("");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  return (
    <div>
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => (
            <div
              key={j}
              onClick={() => handleMove(j, i)}
              className={`flex w-full h-20 justify-center items-center ${
                (j + i) % 2 === 0 ? "bg-green-600" : "bg-green-200 text-black"
              }`}
            >
              <div>{square?.type}</div>
            </div>
          ))}
        </div>
      ))}

      {moveError && (
        <div className="text-red-500 font-semibold mt-5 text-2xl">
          Invalid move
        </div>
      )}
    </div>
  );
}
