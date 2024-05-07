const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const canvasDim = canvas.getBoundingClientRect();

let gridSize = $("#size").val();
let tileSize = canvas.offsetWidth / gridSize;
let spawn2 = true;
let spawn4 = true;
let spawn8 = false;
let classic = true;
const animationTime = 200; // milliseconds
const emptyGrid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

let board_img_path = "/img/empty_2048_full.png";
let border_img_path = "/img/empty_2048_border.png";
let img_paths = ["/img/tile2.PNG", "/img/tile4.PNG", "/img/tile8.PNG", 
                "/img/tile16.PNG", "/img/tile32.PNG", "/img/tile64.PNG", "/img/tile128.PNG", 
                "/img/tile256.PNG", "/img/tile512.PNG", "/img/tile1024.PNG", "/img/tile2048.PNG"];
let images;

let spawnTiles = true;

let score = 0;
let highScore = 0;
let bestTile = 0;
let wins = 0; // number of 2048 tiles created
let grid;

let oldgrid; // previous grid for undo
let prevScore; // previous score for undo
let prevHighScore; // previous high score for undo
let prevWins; // previous wins for undo
let prevBestTile; // previous best tile for undo

$(() => {
    init();
});

function init() {
    let img_promises = [];
    let prom = new Promise((resolve, reject) => {
        let img = new Image(canvas.offsetWidth, canvas.offsetHeight);
        img.src = board_img_path;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("image not loaded"));
    });
    img_promises.push(prom);
    for (let path of img_paths) {
        let prom = new Promise((resolve, reject) => {
            let img = new Image(tileSize, tileSize);
            img.src = path;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("image not loaded"));
        });
        img_promises.push(prom);
    }
    prom = new Promise((resolve, reject) => {
        let img = new Image(canvas.offsetWidth, canvas.offsetHeight);
        img.src = border_img_path;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("image not loaded"));
    });
    img_promises.push(prom);
    Promise.all(img_promises).then(function (imgs) {
        images = imgs;
        grid = makeGrid(grid);
        oldgrid = makeGrid();
        if (spawnTiles) placeRandTile(grid);

        //grid = [[0, 1, 0, 0], [2, 3, 4, 5], [10, 9, 8, 7], [0, 6, 1, 0]];
        //grid = [[0, 2, 0, 0], [1, 0, 0, 2], [0, 0, 0, 1], [1, 1, 0, 1]];
        //grid = [[2, 1, 1, 3], [3, 1, 1, 2], [2, 0, 1, 1], [0, 0, 0, 1]];
        //grid = [[0, 0, 0, 0], [4, 3, 1, 2], [2, 0, 1, 0], [2, 0, 2, 0]];
        //grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; // empty board
        //grid = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]]; // full board
        //grid = [[10, 10, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; // winning board
        
        copyGrid(oldgrid, grid);
        drawGrid(grid);
        updateStats();
        $("#size_label").html(`Board Size: ${$("#size").val()}`);
    });
    
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
    //ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    if (!classic) {
        // draw empty tiles first
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let tile = grid[i][j];
                if (tile == 0) {
                    drawTile(0, i, j);
                }
            }
        }

        // draw filled tiles next so borders are correct
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let tile = grid[i][j];
                if (tile != 0) {
                    drawTile(tile, i, j);
                }
            }
        }
    }
    else {
        ctx.drawImage(images[0], 0, 0, canvas.offsetWidth, canvas.offsetHeight);
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let tile = grid[i][j];
                if (tile != 0) {
                    ctx.drawImage(images[tile], j * tileSize, i * tileSize, tileSize, tileSize);
                }
                //ctx.strokeStyle = "#bbada0";
                //ctx.lineWidth = 23;
                //ctx.strokeRect(j * tileSize, i * tileSize, tileSize, tileSize);
            }
        }
        ctx.drawImage(images[12], 0, 0, canvas.offsetWidth, canvas.offsetHeight);
    }
}

function drawTile(num, row, col) {
    if (num == 0) {
        ctx.fillStyle = "lightgrey";
        ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 3;
        ctx.strokeRect(col * tileSize, row * tileSize, tileSize, tileSize);
    }
    else {
        ctx.fillStyle = "cornflowerblue";
        ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        if (num <= 6) {
            ctx.font = tileSize / 2 + "px fantasy";
            ctx.fillText(2 ** num, (col + 0.5) * tileSize, (row + 0.7) * tileSize);
        }
        else {
            ctx.font = tileSize / 3 + "px fantasy";
            ctx.fillText(2 ** num, (col + 0.5) * tileSize, (row + 0.62) * tileSize);
        }
        ctx.strokeStyle = "#3960A8";
        ctx.lineWidth = 3;
        ctx.strokeRect(col * tileSize, row * tileSize, tileSize, tileSize);
    }
}

function placeRandTile(grid) {
    let rand = Math.random();
    let tile = 0;
    if (spawn2) {
        if (rand < 0.75) tile = 1;
        else if (spawn4 && rand < 0.9375) tile = 2;
        else if (spawn8) tile = 3;
        else tile = 1;
    }
    else if (spawn4){
        if (rand < 0.75) tile = 2;
        else if (spawn8) tile = 3;
        else tile = 2;
    }
    else if (spawn8) tile = 3;
    let row = Math.floor(Math.random() * gridSize);
    let col = Math.floor(Math.random() * gridSize);
    while (grid[row][col] != 0) {
        row = Math.floor(Math.random() * gridSize);
        col = Math.floor(Math.random() * gridSize);
    }
    grid[row][col] = tile;
    if (2 ** tile > bestTile) bestTile = 2 ** tile;
    console.log(`${2 ** tile} placed at (${row}, ${col})`);
}

$("body").on("keydown", (event) => {
    let change = false;
    key = event.keyCode;
    //let moves = [];
    if (key >= 37 && key <= 40) {
        copyGrid(oldgrid, grid);
        prevScore = score;
        prevHighScore = highScore;
        prevBestTile = bestTile;
        prevWins = wins;
        if (key == 37 || key == 39) {
            if (key == 37) { // left arrow
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
                                    change = true;
                                    maxMove = k + 1;
                                    move = k;
                                    break;
                                }
                                else break;
                            }
                            moveTiles(i, move, i, j, "left");
                        }
                    }
                }
            }
            else if (key == 39) { // right arrow
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
                                    change = true;
                                    maxMove = k;
                                    move = k;
                                    break;
                                }
                                else break;
                            }
                            moveTiles(i, move, i, j, "right");
                        }
                    }
                }
            }
        }
        else {
            if (key == 38) { // up arrow
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
                                    change = true;
                                    maxMove = k + 1;
                                    move = k;
                                    break;
                                }
                                else break;
                            }
                            moveTiles(move, j, i, j, "up");
                        }
                    }
                }
            }
            else if (key == 40) { // down arrow
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
                                    change = true;
                                    maxMove = k;
                                    move = k;
                                    break;
                                }
                                else break;
                            }
                            moveTiles(move, j, i, j, "down");
                        }
                    }
                }
            }
        }
        if (score > highScore) highScore = score;
    }
    else if (key == 82) {
        undo();
    }
    if (change) {
        //slide(moves);
        if (spawnTiles) placeRandTile(grid);
        drawGrid(grid);
        checkGrid(grid);
        updateStats();
    }
});

function moveTiles(r1, c1, r2, c2, dir) {
    if (r1 == r2 && c1 == c2) return;
    //let move = {}; // create move for animated move (unused)
    let toRow = r1;
    let toCol = c1;
    let fromRow = r1;
    let fromCol = c1;
    if (dir == "left") {
        if (r1 != r2) console.log("Error: invalid tile swap");
        toCol = Math.min(c1, c2);
        fromCol = Math.max(c1, c2);
    }
    else if (dir == "right") {
        if (r1 != r2) console.log("Error: invalid tile swap");
        toCol = Math.max(c1, c2);
        fromCol = Math.min(c1, c2);
    }
    else if (dir == "up") {
        if (c1 != c2) console.log("Error: invalid tile swap");
        toRow = Math.min(r1, r2);
        fromRow = Math.max(r1, r2);
    }
    else if (dir == "down") {
        if (c1 != c2) console.log("Error: invalid tile swap");
        toRow = Math.max(r1, r2);
        fromRow = Math.min(r1, r2);
    }
    else {
        console.log("Error: Invalid move direction");
        return;
    }
    /*
    move.newRow = toRow;
    move.newCol = toCol;
    move.oldRow = fromRow;
    move.oldCol = fromCol;
    move.tile = grid[fromRow][fromCol];
    */
    //console.log(`Swapping (${toRow}, ${toCol}) (${grid[toRow][toCol]}) and (${fromRow}, ${fromCol}) (${grid[fromRow][fromCol]})`);
    if (grid[toRow][toCol] == grid[fromRow][fromCol]) {
        console.log(`Tiles at (${toRow}, ${toCol}) (${grid[toRow][toCol]}) and (${fromRow}, ${fromCol}) (${grid[fromRow][fromCol]}) combined`);
        grid[toRow][toCol]++;
        let newTile = 2 ** grid[toRow][toCol];
        if (newTile > bestTile) bestTile = newTile;
        console.log(`${newTile} tile formed`);
        score += newTile;
    }
    else {
        //console.log(`Tiles at (${toRow}, ${toCol}) and (${fromRow}, ${fromCol}) swapped`);
        grid[toRow][toCol] = grid[fromRow][fromCol];
    }
    grid[fromRow][fromCol] = 0;
    if (grid[toRow][toCol] == 11) {
        wins++;
        if (wins == 1) win();
    }
    //return move;
}

function undo() {
    console.log("Undo action");
    wins = prevWins;
    score = prevScore;
    highScore = prevHighScore;
    bestTile = prevBestTile;
    copyGrid(grid, oldgrid);
    updateStats();
    drawGrid(grid);
}

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

function win() {
    console.log("You win!");
    alert("You win!");
}

function checkGrid(grid) {
    let lost = true;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] == 0) {
                lost = false;
                break;
            }
            if (j != gridSize - 1 && grid[i][j] == grid[i][j + 1]) {
                lost = false;
                break;
            }
            if (i != gridSize - 1 && grid[i][j] == grid[i + 1][j]) {
                lost = false;
                break;
            }
        }
    }
    if (lost) {
        console.log("No more moves can be made, game lost");
        alert("You lose!");
    }
}

function slide(moves) { // start animation (unused)
    for (let i = 1; i <= animationTime; i++) {
        requestAnimationFrame(() => step(moves, i));
    }
}

function step(moves, frame) { // animate frame (unused)
    drawGrid(emptyGrid);
    for (let move of moves) {
        let r = move.newRow - move.oldRow;
        let c = move.newCol - move.oldCol;
        let row, col;
        if (r == 0) {
            row = move.newRow;
            if (c > 0) {
                col = move.oldCol + (c * frame) / (animationTime + 1);
            }
            else {
                col = move.newCol + (c * frame) / (animationTime + 1);
            }
        }
        else {
            col = move.newCol;
            if (r > 0) {
                row = move.oldRow + (r * frame) / (animationTime + 1);
            }
            else {
                row = move.newRow + (r * frame) / (animationTime + 1);
            }
        }
        drawTile(move.tile, row, col);
    }
}

function updateStats() {
    $("#score").html(score);
    $("#highScore").html(highScore);
    $("#bestTile").html(bestTile);
    $("#numWins").html(wins);
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

$("#reset").on("click", () => {
    score = 0;
    grid = makeGrid();
    oldgrid = makeGrid();
    placeRandTile(grid);
    updateStats();
    drawGrid(grid);
});

$("#main_options form input").on("change", () => {
    let status = $('input[name=cheat]:checked', '#main_options form').val();
    if (status == "disable") {
        $("#cheats").css("display", "none");
    }
    else {
        $("#cheats").css("display", "block");
    }
});

$("#spawnCheck").on("change", () => {
    let checked = $("#spawnCheck").prop("checked");
    spawnTiles = checked;
    if (checked) {
        console.log("Random tile spawn enabled");
        $("#spawnToggle").css("display", "block");
    }
    else {
        console.log("Random tile spawn disabled");
        $("#spawnToggle").css("display", "none");
    }
});

$("#spawn2").on("change", () => {
    let checked = $("#spawn2").prop("checked");
    spawn2 = checked;
});
$("#spawn4").on("change", () => {
    let checked = $("#spawn4").prop("checked");
    spawn4 = checked;
});
$("#spawn8").on("change", () => {
    let checked = $("#spawn8").prop("checked");
    spawn8 = checked;
});

$("#spawn").on("click", () => {
    placeRandTile(grid);
    updateStats();
    drawGrid(grid);
});