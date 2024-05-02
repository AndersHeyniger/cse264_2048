const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const canvasDim = canvas.getBoundingClientRect();

const gridSize = 4;
const tileSize = 150;
const spawn2 = true;
const spawn4 = true;
const spawn8 = false;
//let grid = [];
//let grid = [[0, 1, 0, 0], [2, 3, 4, 5], [10, 9, 8, 7], [0, 6, 1, 0]];
let grid = [[0, 2, 0, 0], [1, 0, 0, 2], [0, 0, 0, 1], [1, 1, 0, 1]];

$(() => {
    init();
});

function init() {
    //makeGrid(grid);
    drawGrid(grid);
}

function makeGrid(grid) {
    for (let i = 0; i < gridSize; i++) {
        grid.push([]);
        for (let j = 0; j < gridSize; j++) {
            grid[i].push(0);
        }
    }
}

function drawGrid(grid) {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
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
            else {
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
    let
    if (spawn2) {

    }
}

$("body").on("keydown", (event) => {
    if (event.keyCode == 37) { // left arrow
        console.log("Left shift");
        for (let i = 0; i < gridSize; i++) {
            for (let j = 1; j < gridSize; j++) {
                if (grid[i][j] != 0) {
                    let move = j;
                    for (let k = j - 1; k >= 0; k--) {
                        if (grid[i][k] == 0) {
                            move = k;
                        }
                        else if (grid[i][k] == grid[i][j]) {
                            console.log("combine!");
                            grid[i][j]++;
                            grid[i][k] = 0;
                            move = k;
                            break;
                        }
                        else break;
                    }
                    let temp = grid[i][j];
                    grid[i][j] = grid[i][move];
                    grid[i][move] = temp;
                }
            }
        }
    }
    else if (event.keyCode == 38) { // up arrow
        console.log("Up shift");
        for (let j = 0; j < gridSize; j++) {
            for (let i = 1; i < gridSize; i++) {
                if (grid[i][j] != 0) {
                    let move = i;
                    for (let k = i - 1; k >= 0; k--) {
                        if (grid[k][j] == 0) {
                            move = k;
                        }
                        else if (grid[k][j] == grid[i][j]) {
                            console.log("combine!");
                            grid[i][j]++;
                            grid[k][j] = 0;
                            move = k;
                            break;
                        }
                        else break;
                    }
                    let temp = grid[i][j];
                    grid[i][j] = grid[move][j];
                    grid[move][j] = temp;
                }
            }
        }
    }
    else if (event.keyCode == 39) { // right arrow
        console.log("Right shift");
        for (let i = 0; i < gridSize; i++) {
            for (let j = gridSize - 1; j >= 0; j--) {
                if (grid[i][j] != 0) {
                    let move = j;
                    for (let k = j + 1; k < gridSize; k++) {
                        if (grid[i][k] == 0) {
                            move = k;
                        }
                        else if (grid[i][k] == grid[i][j]) {
                            console.log("combine!");
                            grid[i][j]++;
                            grid[i][k] = 0;
                            move = k;
                            break;
                        }
                        else break;
                    }
                    let temp = grid[i][j];
                    grid[i][j] = grid[i][move];
                    grid[i][move] = temp;
                }
            }
        }
    }
    else if (event.keyCode == 40) { // down arrow
        console.log("Down shift");
        for (let j = 0; j < gridSize; j++) {
            for (let i = gridSize - 1; i >= 0; i--) {
                if (grid[i][j] != 0) {
                    let move = i;
                    for (let k = i + 1; k < gridSize; k++) {
                        if (grid[k][j] == 0) {
                            move = k;
                        }
                        else if (grid[k][j] == grid[i][j]) {
                            console.log("combine!");
                            grid[i][j]++;
                            grid[k][j] = 0;
                            move = k;
                            break;
                        }
                        else break;
                    }
                    let temp = grid[i][j];
                    grid[i][j] = grid[move][j];
                    grid[move][j] = temp;
                }
            }
        }
    }
    drawGrid(grid);
});