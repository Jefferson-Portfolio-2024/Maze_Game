const socket = io('http://172.20.10.2:5000');

let navigator;
let role;
let goal;
let range;
// grid vairables
let cellSize = 90;
let cols, rows;
let grid = [];
let gameStart = false;
// blinding varibales
let blindEndTime = 0;
let lastBlindToggle = 0;
let blindInterval = 5000;
let blindDuration = 2000;
let blinded = false;
// clock varibales
let gameStratTime;
let navigatorTimeRemaining;
let timeLimit = 120000;
// win conditions
let navigatorReachedGoal = false;
let timeRanOut = false;

socket.on("assignRole", (playerRole) => {
    role = playerRole;
    console.log("Assigned Role: ", role);
});

socket.on("startGame", () => {
    console.log("starting game...");
    document.getElementById("guide-start-screen").style.display = 'none';
    gameStart = true;
    gameStartTime = millis();
    setup();
});

socket.on("navigatorPos", (data) => {
    if(role === "guide")
    {
        navigator.pos = createVector(data.pos.x, data.pos.y);
    }
});

function startGame()
{
    console.log("start button clicked");
    socket.emit("playerReady");
}

function calculateNavigatorTimeReamining()
{
    let elaspedTime = millis() - gameStartTime;
    navigatorTimeRemaining = Math.max(0, timeLimit - elaspedTime);
}

function displayNavigatorTimerRemaining()
{
    fill(255);
    textFont(customFont);
    textSize(16);
    textAlign(LEFT, TOP);
    let timeRemainingSeconds = Math.ceil(navigatorTimeRemaining / 1000);
    text("Time Remaining: " + timeRemainingSeconds + " seconds", 10, 10);
}

//check to see if there is a winner
function checkWinCondition()
{
    if(navigator.pos.x === goal.x && navigator.pos.y === goal.y)
    {
        navigatorReachedGoal = true;
        console.log("The Navigator has reached the goal");
    }
}

// check to see if they lost
function checkLoseCondition()
{
    let elaspedTime = millis() - gameStartTime;
    if (elaspedTime >= timeLimit)
    {
        timeRanOut = true;
    }
}

// this will be used to display the win screen
function displayWinScreen()
{
    fill(255, 215, 0);
    textFont(customFont);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("You Win!\nPress ctrl+R to play again", windowWidth / 2, windowHeight / 2);
}

// this will be used to display the losing screen
function displayLoseScreen()
{
    fill(255, 0, 0);
    textFont(customFont);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("You Lose!\nPress ctrl+R to play again", windowWidth / 2, windowHeight / 2);
}

function preload()
{
    customFont = loadFont("PixeloidSansBold-PKnYd.ttf");
}

function setup()
{
    randomSeed(4686);
    console.log("Setting everything up...");
    createCanvas(1430, 750);
    frameRate(60);
    setupMaze(role);
}

function setupMaze(playerRole)
{
    cols = Math.floor(1430 / cellSize);
    rows = Math.floor(750 / cellSize);
    grid = generateMaze(cols, rows);
    navigator = new Navigator(0, 0);
    goal = createVector(cols - 1, rows - 1);

    if(playerRole === "navigator")
    {
        range = 0;
    }
    else if(playerRole === "guide")
    {
        range = Math.max(cols, rows);
    }
}

// the draw function will draw everything
function draw()
{
    if(gameStart)
    {
        background(0);
        drawMaze();
        drawNavigatorAndGoal();
        //check the win condition
        checkWinCondition();
        // check the lose condition
        checkLoseCondition();
        // calculate the time remaining
        calculateNavigatorTimeReamining();
        // display the timer for the navigator only
        if(role === "navigator")
        {
            displayNavigatorTimerRemaining();
        }

        //check the win conditions
        if(navigatorReachedGoal)
        {
            displayWinScreen();
            noLoop();
        }
        else if(timeRanOut)
        {
            displayLoseScreen();
            noLoop();
        }

        if(role === "guide" && blinded)
        {
            fill(0);
            rect(0, 0, windowWidth, windowHeight);
            textFont(customFont);
            textSize(32);
            textAlign(CENTER, CENTER);
            fill(255, 0, 0);
            text("Blinded!!", windowWidth / 2, windowHeight / 2);
        }
        if(millis() - blindEndTime >= 0)
        {
            blinded = false;
        }
        if(!blinded && millis() - lastBlindToggle >= blindInterval)
        {
            blinded = true;
            lastBlindToggle = millis();
            blindEndTime = millis() + blindDuration;
        }
    }
}

function keyPressed() {
    if (role === 'navigator') 
    {
        navigator.handleInput(key);
    }
}

function drawMaze()
{
    let startX = Math.max(0, navigator.pos.x - range);
    let endX = Math.min(cols - 1, navigator.pos.x + range);
    let startY = Math.max(0, navigator.pos.y - range);
    let endY = Math.min(rows - 1, navigator.pos.y + range);

    for(let i = startX; i<= endX; i++)
    {
        for(let j = startY; j <= endY; j++)
        {
            let cell = grid[index(i, j)];
            if(cell)
            {
                cell.show();
            }
        }
    }
}

// this will draw the navigator and the goal
function drawNavigatorAndGoal()
{
    // color the navigator
    fill(0, 255, 0);
    rect(navigator.pos.x * cellSize, navigator.pos.y * cellSize, cellSize, cellSize);
    // color the goal
    fill(255, 215, 0);
    rect(goal.x * cellSize, goal.y * cellSize, cellSize, cellSize);
}

// creates the navigator class
class Navigator
{
    // constructor will handle the position
    constructor(x, y)
    {
        this.pos = createVector(x, y);
    }
    // this will handle the input of the navigator moving
    handleInput(key)
    {
        // this copies the position vector of the navigator and stores into
        // newPos variable
        let newPos = this.pos.copy();
        // move up if there is no wall
        if(key === "w" && !grid[index(this.pos.x, this.pos.y)].walls[0])
        {
            newPos.y--;
        }
        // move to the right of there is no wall
        if(key === "d" && !grid[index(this.pos.x, this.pos.y)].walls[1])
        {
            newPos.x++;
        }
        // move to the down if there is no wall
        if(key === "s" && !grid[index(this.pos.x, this.pos.y)].walls[2])
        {
            newPos.y++;
        }
        // move forward move up if there is no wall
        if(key === "a" && !grid[index(this.pos.x, this.pos.y)].walls[3])
        {
            newPos.x--;
        }
        //check if the index is valid
        if(index(newPos.x, newPos.y) !== -1)
        {
            this.pos = newPos;
            socket.emit("navigatorPos", { pos: this.pos });
        }
    }
}

/*
this file will generate the same maze for both screens and players
This will implement a maze algorithm and will basically set the game up
 */
class Cell
{
    constructor(i, j)
    {
        this.i = i;
        this.j = j;
        // this will look at the walls of the grid
        // Top, right, bottom, left
        this.walls = [true, true, true, true];
        this.visited = false;
    }
    
    show()
    {
        let x = this.i * cellSize;
        let y = this.j * cellSize;
        stroke(255);
        if(this.walls[0])
        {
            // draws a line at the top
            line(x, y, x + cellSize, y);
        }
        if(this.walls[1])
        {
            // draws line to the right
            line(x + cellSize, y, x + cellSize, y + cellSize);
        }
        if(this.walls[2])
        {
            // draws a line at the bottom of the grid
            line(x + cellSize, y + cellSize, x, y + cellSize);
        }
        if(this.walls[3])
        {
            // draws a line to the left.
            line(x, y + cellSize, x, y);
        }
        // if the cell has been visited do this
        if(this.visited)
        {
            noStroke();
            fill(200, 0, 200, 100);
            rect(x, y, cellSize, cellSize);
        }
    }

    // this will check the neighbors
    checkNeighbors()
    {
        // check to see if the currents square's neighbors are visited
        let neighbors = [];
        let top = grid[index(this.i, this.j - 1)];
        let right = grid[index(this.i + 1, this.j)];
        let bottom = grid[index(this.i, this.j + 1)];
        let left = grid[index(this.i - 1, this.j)];

        // check if the sides are real and if they have NOT been visited
        if(top && !top.visited)
        {
            neighbors.push(top);
        }
        if(right && !right.visited)
        {
            neighbors.push(right);
        }
        if(bottom && !bottom.visited)
        {
            neighbors.push(bottom);
        }
        if(left && !left.visited)
        {
            neighbors.push(left);
        }
        // select a random neighbor to choose
        if(neighbors.length > 0)
        {
            let w = random(0, neighbors.length);
            let r = Math.floor(w);
            return neighbors[r];
        }
        else
        {
            // if the neighbor is invalid, return undefined
            return undefined;
        }
    }
}

function index(i, j)
{
    // invalid index detection
    if(i < 0 || j < 0 || i > cols - 1 || j > rows - 1)
    {
        return -1;
    }
    return i + j * cols;
}

// this function will remove the walls
function removeWalls(a, b)
{
    let x = a.i - b.i;
    // this means that the left wall be removed
    // and the right wall removed for b
    if(x === 1)
    {
        a.walls[3] = false;
        b.walls[1] = false;
    }
    // basically the inverse
    else if(x === -1)
    {
        a.walls[1] = false;
        b.walls[3] = false;
    }
    let y = a.j - b.j;
    // remove the top of a cell and remove the bottom of b cell
    if(y === 1)
    {
        a.walls[0] = false;
        b.walls[2] = false;
    }
    // basically the inverse
    else if(y === -1)
    {
        a.walls[2] = false;
        b.walls[0] = false
    }
}

// this function will generate a maze
function generateMaze(cols, rows)
{
    grid = new Array(cols * rows);
    for(let j = 0; j < rows; j++)
    {
        for(let i = 0; i < cols; i++)
        {
            grid[index(i, j)] = new Cell(i, j);
        }
    }
    // these variables will be used for the backtracking algorithm
    let stack = [];
    let current = grid[0];
    current.visited = true;
    // make an infinite loop that only breaks when it reaches a break
    while(true)
    {
        let next = current.checkNeighbors();
        if (next) {
            next.visited = true;
            // push the current cell onto the stack
            stack.push(current);
            // remove the wall of the next and current cell
            removeWalls(current, next);
            // set the current cell to the next cell
            current = next;
        } else if (stack.length > 0) {
            // if the stack is not empty
            // make the current cell the cell that gets popped off the stack
            current = stack.pop();
        } else {
            // if empty get out of the loop
            break;
        }
    }
    // return the full grid
    return grid;
}
