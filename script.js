console.log(`
////////////////////////////////////////////////////////////
//////////I HAVE CREATE IT FOR FUN, SO IT MAY HAVE//////////
///////////////////////SOME PROBLEMS!///////////////////////
//////////////// >https://github.com/Xanoor ////////////////
////////////////////////////////////////////////////////////
`)


const container = document.getElementsByClassName('elements')[0]
const size = document.getElementById("size")
const grid_el = document.getElementsByClassName("elements")[0]
const snake_el = document.getElementById('snake')
var collision_btn = document.getElementById('collision_btn')
const play_again = document.getElementById('playAgain')
const result = document.getElementById('number_of_apple')
const screen = document.getElementById('result')
const apple = document.getElementById('apple')

var apple_pos = []

var snake = {
    z_index:0,
    x_index:0,
    direction: "x",
    last_x_pos:0,
    last_z_pos:0,
    childs: [],
    cells: [],
    length: 1
}

var collision = true
var isDead = false


// Get random number (between min and max)
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
  
//WHEN PLAYER CHANGE THE SIZE OF THE GAME WINDOW
size.onchange = function() {
    size.value < 3 ? size.value = 3 : console.log('Resizing window.')
    grid_el.style.width = size.value * 15 + "px"
    grid_el.style.height = size.value * 15 + "px"
    reset()
}

play_again.onclick = function() {reset()}
size.onload = size.onchange() 

//WHEN THE COLLISION BUTTON IS PRESSED
collision_btn.onclick = function() {
    collision_btn = document.getElementById('collision_btn')
    if (collision_btn.value == "Collisions ❎") {
        collision_btn.value = "Collisions ✅"
        collision = true
    } else {
        collision_btn.value = "Collisions ❎"
        collision = false
    } 
}


//KEYPRESS EVENTS
addEventListener("keypress", (keyPressed) => {
    if (keyPressed.key == "z") {
        snake.direction = "-z"
    } else if (keyPressed.key == "q") {
        snake.direction = "-x"
    } else if (keyPressed.key == "s") {
        snake.direction = "z"
    } else if (keyPressed.key == "d") {
        snake.direction = "x"
    }
})

//CHANGE APPLE POSITION
function randomApplePos() {
    apple_pos = []

    apple_top = getRandomInt(0, size.value)
    apple_left = getRandomInt(0, size.value)
    var counter = 0

    while (hasCollide(apple_left, apple_top)) {
        apple_top = getRandomInt(0, size.value)
        apple_left = getRandomInt(0, size.value)
        counter ++;
        //ANTI CRASH
        if (counter > size.value*size.value) {
            break
        }
    }
    
    apple_pos.push(apple_top, apple_left)
    apple.style.top = apple_top*15 + "px"
    apple.style.left = apple_left*15 + "px"
}

//CREATE ANOTHER CHILD
function createSnakeChild() {
    var child = document.createElement('div')
    child.className = "child"
    container.appendChild(child)
    child.style.left = -15+"px"
    child.style.top = -15+"px"
    snake.childs.push(child)
    snake.cells.push([-15, -15])
}


//VERIFY IF THERE IS A COLLISION 
function hasCollide(x, z) {
    for (i=0; i<snake.cells.length; i++) {
        if (snake.cells[i][0] == x && snake.cells[i][1] == z) {
            return true
        }
    }
    return false
}



setInterval(() => {
    if (!isDead) {
        snake.cells.shift()
        
        snake.last_x_pos = snake.x_index
        snake.last_z_pos = snake.z_index
        if (snake.direction == "x") {
            if (snake.x_index == size.value-1) {
                snake.x_index = 0
            } else snake.x_index += 1
        } else if (snake.direction == "-x") {
            if (snake.x_index == 0) {
                snake.x_index = size.value-1
            } else snake.x_index -= 1
        } else if (snake.direction == "z") {
            if (snake.z_index == size.value-1) {
                snake.z_index = 0
            } else snake.z_index += 1
        } else if (snake.direction == "-z") {
            if (snake.z_index == 0) {
                snake.z_index = size.value-1
            } else snake.z_index -= 1
        }
        if (collision) isDead = hasCollide(snake.x_index, snake.z_index)

            
        if (snake.childs.length >= 1) {
            var last_child = snake.childs[snake.childs.length-1]
            last_child.style.top = snake.last_z_pos*15 + "px"
            last_child.style.left = snake.last_x_pos*15 + "px"
            snake.cells.push([snake.last_x_pos, snake.last_z_pos])
            snake.childs.unshift(snake.childs.pop());
        }

        snake_el.style.top = (snake.z_index * 15)+"px"
        snake_el.style.left = (snake.x_index * 15)+"px"
    
        if (snake.z_index == apple_pos[0] && snake.x_index == apple_pos[1]) {
            randomApplePos()
            createSnakeChild()
            snake.length++;
            result.innerText = snake.length
        }
    } else {
        screen.style.background = "#5050506c"
    }
    
}, 100);

//RESTARTING GAME
function reset() {
    snake_el.style.left = 0+"px"
    snake_el.style.right = 0+"px"
    snake = {
        z_index:0,
        x_index:0,
        direction: "x",
        last_x_pos:0,
        last_z_pos:0,
        childs: [],
        cells: [],
        length: 1
    }
    result.innerText = "1"
    isDead = false
    randomApplePos()
    var snake_childs = document.getElementsByClassName('child')
    while(snake_childs.length > 0){
        snake_childs[0].parentNode.removeChild(snake_childs[0]);
    }
    screen.style.background = "none"
}