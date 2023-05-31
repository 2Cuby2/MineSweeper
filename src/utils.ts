// Create a blank grid and return a ranom number of bombs
export function createBlankGrid(row, col) {
    let grid = new Array(col).fill().map(
        () => new Array(row).fill().map(() => ({selected: 0, type: null}))
    );
    let max = Math.floor(row * col / 6);
    let min = Math.floor(max / 1.5);
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    return [grid, num];
};

// Place num bombs on the grid, depending on the first move played
const placeBombs = (grid, num, xFirst, yFirst) => {
    let col = grid.length;
    let row = grid[0].length
    while(num > 0) {
        let y =  Math.floor(Math.random() * col);
        let x = Math.floor(Math.random() * row);
        if(grid[y][x].type === null && !(x === xFirst && y === yFirst)) {
            grid[y][x].type = -1;
            num--;
        }
    }
    return grid;
};

// Get the number of bombs next to the box at the position (x, y)
const getNumberOfBombs = (grid, x, y) => {
    let count = 0;
    for(let j=-1; j <= 1; j++) {
        for(let i=-1; i <= 1; i++) {
            if((j + y >= 0) && (i + x >= 0) && (j + y < grid.length) && (i + x < grid[0].length)) {
                if(grid[j + y][i + x].type === -1) count += 1;
            }
        }
    }
    return count;
};

// Setup the grid with bombs considering the first move played
export function setGrid(grid, num, xFirst, yFirst) {
    grid, num = placeBombs(grid, num, xFirst, yFirst);
    for(let y=0; y < grid.length; y++) {
        for(let x=0; x < grid[0].length; x++) {
            if(grid[y][x].type === null) grid[y][x].type = getNumberOfBombs(grid, x, y)
        }
    }
    return grid;
}

// Handle the case where 0 bombs surround the box at (x, y) by recursively revealing the boxes next to it
export function handle0Bomb(grid, x, y) {
    for(let j=-1; j <= 1; j++) {
        for(let i=-1; i <= 1; i++) {
            if((j + y >= 0) && (i + x >= 0) && (j + y < grid.length) && (i + x < grid[0].length) && !(i === 0 && j === 0)) {
                let wasSelected = grid[j + y][i + x].selected;
                grid[j + y][i + x].selected = 1;
                if(grid[j + y][i + x].type === 0 && !(wasSelected === 1)) grid = handle0Bomb(grid, i + x, j + y);
            }
        }
    }
    return grid;
}

// Check if the game is over and if all boxes without bombs have been revealed
export function isOver(grid) {
    for(let y=0; y < grid.length; y++) {
        for(let x=0; x < grid[0].length; x++) {
            if(grid[y][x].type !== -1 && grid[y][x].selected !== 1) {
                return false;
            }
        }
    }
    return true;
}
