/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
    createContext,
    useState,
    useEffect,
} from 'react';

import {
    createBlankGrid,
    setupGrid,
    handle0Bomb,
    isOver,
    GridObject,
    ItemObjectStatus,
} from './utils';


export enum GameStatus {
    NotInitialized = 0,
    Started = 1,
    Won = 2,
    Lost = 3,
}


type GameContextType = {
    grid: GridObject;
    numBombs: number;
    status: GameStatus;
    defineDimensions: (rows: number, cols: number) => void;
    restart: () => void;
    revealSquare: (x: number, y: number) => void;
    flagSquare: (x: number, y: number) => void;
};
export const GameContext = createContext<GameContextType>({
    grid: [],
    numBombs: 0,
    status: GameStatus.NotInitialized,
    defineDimensions: () => {},
    restart: () => {},
    revealSquare: () => {},
    flagSquare: () => {},
});


type GameProviderProps = { children: JSX.Element };
function GameProvider({ children }: GameProviderProps) {
    // Dimensions of the grid
    const [dimensions, setDimensions] = useState({ rows: 0, cols: 0 });
    // Grid
    const [grid, setGrid] = useState<GridObject>([]);
    // Number of bombs
    const [numBombs, setNumBombs] = useState<number>(0);
    // Game status
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotInitialized);

    const { rows, cols } = dimensions;

    useEffect(() => {
        const { grid: newGrid, num: newNumBombs } = createBlankGrid(rows, cols);
        setGrid(newGrid);
        setNumBombs(newNumBombs);
    }, [dimensions]);

    const defineDimensions = (rows: number, cols: number) => setDimensions({ rows, cols });

    const restart = () => {
        const { grid: newGrid, num: newNumBombs } = createBlankGrid(rows, cols);
        setGrid(newGrid);
        setNumBombs(newNumBombs);
        setGameStatus(GameStatus.NotInitialized);
    };

    const revealSquare = (x: number, y: number) => {
        if (!grid || !numBombs) return;

        grid[y][x].status = ItemObjectStatus.Revealed;

        // If it's the first move, set the grid
        if (gameStatus === GameStatus.NotInitialized) {
            setupGrid(grid, numBombs, x, y);
            setGameStatus(GameStatus.Started);
        }

        // If it's a bomb, game is lost
        if (grid[y][x].isBomb) {
            setGameStatus(GameStatus.Lost);
        } else {
            // If 0 bomb, recursivly reveal the other squares
            if (grid[y][x].nextBombsCount === 0) {
                handle0Bomb(grid, x, y);
            }
            setGrid(grid);
            // Check if game is over and display the winning message
            if (isOver(grid)) {
                setGameStatus(GameStatus.Won);
            }
        }
    };

    const flagSquare = (x: number, y: number) => {
        if (!grid) return;

        switch (grid[y][x].status) {
            case ItemObjectStatus.Flagged:
                grid[y][x].status = ItemObjectStatus.Hidden;
                break;
            case ItemObjectStatus.Hidden:
                grid[y][x].status = ItemObjectStatus.Flagged;
                break;
            default:
                break;
        }

        setGrid(grid);
    }

    return (
      <GameContext.Provider value={{
        grid,
        numBombs,
        status: gameStatus,
        defineDimensions,
        restart,
        revealSquare,
        flagSquare,
    }}>
        {children}
      </GameContext.Provider>
    );
}


export default GameProvider;
