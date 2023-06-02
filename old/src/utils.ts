export type ItemType = { selected: number; type: number | null }
export type GridType = ItemType[][]


// Create a blank grid and return a ranom number of bombs
export function createBlankGrid(row: number, col: number): [GridType, number] {
    const grid = new Array(col).fill(null).map(
        () => new Array(row).fill(null).map(() => ({ selected: 0, type: null }))
    );
    const max = Math.floor(row * col / 6);
    const min = Math.floor(max / 1.5);
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return [grid, num];
};


// Place num bombs on the grid, depending on the first move played
function placeBombs(grid: GridType, num: number, xFirst: number, yFirst: number) {
    const col = grid.length;
    const row = grid[0].length;
    while (num > 0) {
        const y =  Math.floor(Math.random() * col);
        const x = Math.floor(Math.random() * row);
        if (grid[y][x].type === null && !(x === xFirst && y === yFirst)) {
            grid[y][x].type = -1;
            num--;
        }
    }
    return grid;
};


// Get the number of bombs next to the box at the position (x, y)
function getNumberOfBombs(grid: GridType, x: number, y: number) {
    let count = 0;
    for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
            if ((j + y >= 0) && (i + x >= 0) && (j + y < grid.length) && (i + x < grid[0].length)) {
                if (grid[j + y][i + x].type === -1) count += 1;
            }
        }
    }
    return count;
};


// Setup the grid with bombs considering the first move played
export function setUpGrid(grid: GridType, num: number, xFirst: number, yFirst: number) {
    grid = placeBombs(grid, num, xFirst, yFirst);
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x].type === null) grid[y][x].type = getNumberOfBombs(grid, x, y)
        }
    }
    return grid;
}


// Handle the case where 0 bombs surround the box at (x, y) by recursively revealing the boxes next to it
export function handle0Bomb(grid: GridType, x: number, y: number) {
    for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
            if ((j + y >= 0) && (i + x >= 0) && (j + y < grid.length) && (i + x < grid[0].length) && !(i === 0 && j === 0)) {
                const wasSelected = grid[j + y][i + x].selected;
                grid[j + y][i + x].selected = 1;
                if(grid[j + y][i + x].type === 0 && !(wasSelected === 1)) grid = handle0Bomb(grid, i + x, j + y);
            }
        }
    }
    return grid;
}


// Check if the game is over and if all boxes without bombs have been revealed
export function isOver(grid: GridType) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x].type !== -1 && grid[y][x].selected !== 1) {
                return false;
            }
        }
    }
    return true;
}
