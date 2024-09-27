import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const SnakeGame = () => {
  const gridSize = 15; // Reduced from 30 to 15
  const cellSize = 40; // Increased from 20 to 40 px
  const startPosition = Math.floor(gridSize / 2);

  const [snake, setSnake] = useState([{ x: startPosition, y: startPosition }]);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [food, setFood] = useState(null);

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    } while (
      snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    return newFood;
  }, [snake, gridSize]);

  useEffect(() => {
    if (!food) {
      setFood(generateFood());
    }
  }, [food, generateFood]);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      if (
        head.x < 0 ||
        head.x >= gridSize ||
        head.y < 0 ||
        head.y >= gridSize
      ) {
        setGameOver(true);
        return prevSnake;
      }

      if (food && head.x === food.x && head.y === food.y) {
        setFood(null);
        return [head, ...newSnake];
      }

      newSnake.unshift(head);
      newSnake.pop();
      return newSnake;
    });
  }, [direction, gameOver, gridSize, food]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection((prev) => (prev !== "DOWN" ? "UP" : prev));
          break;
        case "ArrowDown":
          setDirection((prev) => (prev !== "UP" ? "DOWN" : prev));
          break;
        case "ArrowLeft":
          setDirection((prev) => (prev !== "RIGHT" ? "LEFT" : prev));
          break;
        case "ArrowRight":
          setDirection((prev) => (prev !== "LEFT" ? "RIGHT" : prev));
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    const gameInterval = setInterval(moveSnake, 200);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [moveSnake]);

  const getCellContent = (rowIndex, colIndex) => {
    const isSnakeHead = snake[0].x === colIndex && snake[0].y === rowIndex;
    const isSnakeBody = snake
      .slice(1)
      .some((segment) => segment.x === colIndex && segment.y === rowIndex);
    const isFood = food && food.x === colIndex && food.y === rowIndex;

    if (isSnakeHead) {
      return (
        <Image
          src="/diddy.png"
          alt="Snake Head"
          width={cellSize}
          height={cellSize}
        />
      );
    } else if (isSnakeBody) {
      return <div className="w-full h-full bg-green-500"></div>;
    } else if (isFood) {
      return (
        <Image src="/oil.png" alt="Food" width={cellSize} height={cellSize} />
      );
    }
    return null;
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div
        className="grid gap-0 bg-white border border-gray-300"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        }}
      >
        {[...Array(gridSize)].map((_, rowIndex) =>
          [...Array(gridSize)].map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-[${cellSize}px] h-[${cellSize}px] border border-gray-200`}
            >
              {getCellContent(rowIndex, colIndex)}
            </div>
          ))
        )}
      </div>
      {gameOver && (
        <div className="absolute text-red-500 text-2xl">Game Over!</div>
      )}
      <div className="absolute top-0 left-0 m-4 text-black">
        Snake length: {snake.length}, Food position:{" "}
        {food ? `${food.x},${food.y}` : "None"}
      </div>
    </div>
  );
};

export default SnakeGame;
