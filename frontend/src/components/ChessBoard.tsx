import { Color, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";

export default function ChessBoard({
  board,
  socket,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
}) {
  console.log(board);
  const [keyPressed, setKeyPressed] = useState<Square | undefined>(undefined);

  useEffect(() => {
    console.log(keyPressed);
  }, [keyPressed]);
  return (
    <div>
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => (
            <div
              key={j}
              onClick={() => setKeyPressed(square?.square)}
              className={`flex w-full h-20 justify-center items-center ${
                (j + i) % 2 === 0 ? "bg-green-600" : "bg-green-200 text-black"
              }`}
            >
              <div>{square?.type}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
