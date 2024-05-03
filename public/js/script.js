const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const canvasDim = canvas.getBoundingClientRect();

let gridSize = $("#size").val();
let tileSize = canvas.offsetWidth / gridSize;
const spawn2 = true;
const spawn4 = true;
const spawn8 = false;
let grid;
let oldgrid;


$(() => {
    init();
});

function init() {
    //grid = [[0, 1, 0, 0], [2, 3, 4, 5], [10, 9, 8, 7], [0, 6, 1, 0]];
    //grid = [[0, 2, 0, 0], [1, 0, 0, 2], [0, 0, 0, 1], [1, 1, 0, 1]];
    //grid = [[2, 1, 1, 3], [3, 1, 1, 2], [2, 0, 1, 1], [0, 0, 0, 1]];
    grid = makeGrid(grid);
    oldgrid = makeGrid();
    placeRandTile(grid);
    copyGrid(oldgrid, grid);
    drawGrid(grid);
    $("#size_label").html(`Board Size: ${$("#size").val()}`);
}

function makeGrid() {
    let grid = [];
    for (let i = 0; i < gridSize; i++) {
        grid.push([]);
        for (let j = 0; j < gridSize; j++) {
            grid[i].push(0);
        }
    }
    return grid;
}

function drawGrid(grid) {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // draw empty tiles first
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let tile = grid[i][j];
            if (tile == 0) {
                ctx.fillStyle = "lightgrey";
                ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
                ctx.strokeStyle = "gray";
                ctx.lineWidth = 3;
                ctx.strokeRect(j * tileSize, i * tileSize, tileSize, tileSize);
            }
        }
    }

    // draw filled tiles next so borders are correct
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let tile = grid[i][j];
            if (tile != 0) {
                ctx.fillStyle = "cornflowerblue";
                ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                if (tile <= 6) {
                    ctx.font = tileSize / 2 + "px fantasy";
                    ctx.fillText(2 ** tile, (j + 0.5) * tileSize, (i + 0.7) * tileSize);
                }
                else {
                    ctx.font = tileSize / 3 + "px fantasy";
                    ctx.fillText(2 ** tile, (j + 0.5) * tileSize, (i + 0.62) * tileSize);
                }
                ctx.strokeStyle = "#3960A8";
                ctx.lineWidth = 3;
                ctx.strokeRect(j * tileSize, i * tileSize, tileSize, tileSize);
            }
        }
    }
}

function placeRandTile(grid) {
    let rand = Math.random();
    let tile = 1;
    if (spawn2) {
         if (rand < 0.75) tile = 1;
         else if (spawn4) tile = 2;
    }
    else tile = 2;
    let row = Math.floor(Math.random() * gridSize);
    let col = Math.floor(Math.random() * gridSize);
    while (grid[row][col] != 0) {
        row = Math.floor(Math.random() * gridSize);
        col = Math.floor(Math.random() * gridSize);
    }
    grid[row][col] = tile;
    console.log(`${2**tile} placed at (${row}, ${col})`);
}

$("body").on("keydown", (event) => {
    let change = false;
    
    if (event.keyCode == 37) { // left arrow
        copyGrid(oldgrid, grid);
        console.log("Left shift");
        for (let i = 0; i < gridSize; i++) {
            let maxMove = 0;
            for (let j = 1; j < gridSize; j++) {
                if (grid[i][j] != 0) {
                    let move = j;
                    for (let k = j - 1; k >= maxMove; k--) {
                        if (grid[i][k] == 0) {
                            change = true;
                            move = k;
                        }
                        else if (grid[i][k] == grid[i][j]) {
                            console.log(`Tiles at (${i}, ${j}) and (${i}, ${k}) combined`);
                            change = true;
                            grid[i][j]++;
                            grid[i][k] = 0;
                            maxMove = k + 1;
                            move = k;
                            console.log(`${2**grid[i][j]} tile formed`);
                            break;
                        }
                        else break;
                    }
                    if (change) {
                        let temp = grid[i][j];
                        grid[i][j] = grid[i][move];
                        grid[i][move] = temp;
                    }
                }
            }
        }
    }
    else if (event.keyCode == 38) { // up arrow
        copyGrid(oldgrid, grid);
        console.log("Up shift");
        for (let j = 0; j < gridSize; j++) {
            let maxMove = 0;
            for (let i = 1; i < gridSize; i++) {
                if (grid[i][j] != 0) {
                    let move = i;
                    for (let k = i - 1; k >= maxMove; k--) {
                        if (grid[k][j] == 0) {
                            change = true;
                            move = k;
                        }
                        else if (grid[k][j] == grid[i][j]) {
                            console.log(`Tiles at (${i}, ${j}) and (${k}, ${j}) combined`);
                            grid[i][j]++;
                            change = true;
                            grid[k][j] = 0;
                            maxMove = k + 1;
                            move = k;
                            console.log(`${2**grid[i][j]} tile formed`);
                            break;
                        }
                        else break;
                    }
                    if (change) {
                        let temp = grid[i][j];
                        grid[i][j] = grid[move][j];
                        grid[move][j] = temp;
                    }
                }
            }
        }
    }
    else if (event.keyCode == 39) { // right arrow
        copyGrid(oldgrid, grid);
        console.log("Right shift");
        for (let i = 0; i < gridSize; i++) {
            let maxMove = gridSize;
            for (let j = gridSize - 1; j >= 0; j--) {
                if (grid[i][j] != 0) {
                    let move = j;
                    for (let k = j + 1; k < maxMove; k++) {
                        if (grid[i][k] == 0) {
                            change = true;
                            move = k;
                        }
                        else if (grid[i][k] == grid[i][j]) {
                            console.log(`Tiles at (${i}, ${j}) and (${i}, ${k}) combined`);
                            change = true;
                            grid[i][j]++;
                            grid[i][k] = 0;
                            maxMove = k;
                            move = k;
                            console.log(`${2**grid[i][j]} tile formed`);
                            break;
                        }
                        else break;
                    }
                    if (change) {
                        let temp = grid[i][j];
                        grid[i][j] = grid[i][move];
                        grid[i][move] = temp;
                    }
                }
            }
        }
    }
    else if (event.keyCode == 40) { // down arrow
        copyGrid(oldgrid, grid);
        console.log("Down shift");
        for (let j = 0; j < gridSize; j++) {
            let maxMove = gridSize;
            for (let i = gridSize - 1; i >= 0; i--) {
                if (grid[i][j] != 0) {
                    let move = i;
                    for (let k = i + 1; k < maxMove; k++) {
                        if (grid[k][j] == 0) {
                            change = true;
                            move = k;
                        }
                        else if (grid[k][j] == grid[i][j]) {
                            console.log(`Tiles at (${i}, ${j}) and (${k}, ${j}) combined`);
                            change = true;
                            grid[i][j]++;
                            grid[k][j] = 0;
                            maxMove = k;
                            move = k;
                            console.log(`${2**grid[i][j]} tile formed`);
                            break;
                        }
                        else break;
                    }
                    if (change) {
                        let temp = grid[i][j];
                        grid[i][j] = grid[move][j];
                        grid[move][j] = temp;
                    }
                }
            }
        }
    }
    else if (event.keyCode == 82) {
        console.log("Undo action");
        copyGrid(grid, oldgrid);
        drawGrid(grid);
    }
    if (change) {
        placeRandTile(grid);
        drawGrid(grid);
    }
});

function copyGrid(dest, source) {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            dest[i][j] = source[i][j];
        }
    }
}

function resizeGrid(grid, oldSize, newSize) {
    if (oldSize == newSize) return;
    else if (oldSize < newSize) {
        for (let i = 0; i < oldSize; i++) {
            for (let j = 0; j < newSize - oldSize; j++) {
                grid[i].push(0);
            }
        }
        for (let i = oldSize; i < newSize; i++) {
            grid.push([]);
            for (let j = 0; j < newSize; j++) {
                grid[i].push(0);
            }
        }
    }
    else {
        grid = grid.slice(0, newSize);
        for (let i = 0; i < newSize; i++) {
            grid[i] = grid.slice(0, newSize);
        }
    }
}

$("#size").on("input", (event) => {
    let oldSize = gridSize;
    gridSize = $("#size").val();
    tileSize = canvas.offsetWidth / gridSize;
    $("#size_label").html(`Board Size: ${gridSize}`);
    resizeGrid(grid, oldSize, gridSize);
    oldgrid = makeGrid();
    copyGrid(oldgrid, grid);
    //console.log(grid.toString());
    drawGrid(grid);
});