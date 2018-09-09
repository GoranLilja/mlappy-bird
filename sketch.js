// Variables for machine learning algorithm
// - Gravity
// - Difficulty
// - Distance to closest wall
// - Velocity
// - Distance to bottom
// - Distance to top

// Settings:
// - Supervised learning
// - Back propagation ON / OFF
// - Confidence level 50%
// - Gap

// TODO:
// Save best neural network to local storage

// State definitions
const STATE_PAUSED = 0
const STATE_GAME_ON = 1
const STATE_GAME_OVER = 2

// Constants
let gravity = 0.1
const UP_FORCE = -2.5
const NUM_BIRDS = 300

// Game state
let state = STATE_PAUSED
let difficulty = 4
let ticker = 0
let highscore = 0
let birds = []
let walls = []

let speed = 1

function reset() {
    state = STATE_GAME_ON
    let bestBird = null
    if (birds && birds.length > 0) {
        bestBird = birds.sort((a, b) => {return a.score < b.score})[0]
        console.log(`Best score: ${bestBird.score}.`)
    }
    birds = []
    for (let i = 0; i < NUM_BIRDS; i++) {
        const bird = new Bird(30, height / 2)
        if (bestBird) {
            bird.setNetwork(bestBird.nn)
        }
        birds.push(bird)
    }
    ticker = 0
    walls = []
}

function setup() {
  createCanvas(800, 400)
  reset()
  textAlign(CENTER, CENTER)
}

function draw() {
  background(220)

  fill(0)
  text(`Birds alive: ${birds.filter(b => b.dead === false).length}`, width/2, 20)

  for (let i = 0; i < speed; i++) {
  walls = walls.filter(w => w.x + w.w > 0)
  if (birds.filter(b => b.dead === false).length === 0) {
    reset()
  }
  const bestBird = birds.sort((a, b) => {return a.score < b.score})[0]
  text(`Best score: ${bestBird.score}`, width/2, 40)
  text(`FPS: ${floor(frameRate())}`, width/2, 60)
  walls.map(w => { w.draw() })
  birds.filter(b => b.dead === false).map(b => { b.draw() })
  if (state === STATE_PAUSED) {
    fill(0)
    text(`Press SPACE to begin.`, width / 2, height / 2)
  } else if (state === STATE_GAME_OVER) {
    fill(0)
    text(`GAME OVER!\nPress SPACE to restart.`, width / 2, height / 2)
  } else if (state === STATE_GAME_ON) {
    if (ticker % (60 * 2) === 0) {
      walls.push(new Wall())
    }
    for (let bird of birds.filter(b => b.dead === false)) {
        bird.checkCollision(walls)
        bird.decide(walls)
        bird.applyForce(gravity)
        bird.update()
    }
    walls.map(w => { w.update() })
    ticker++
  }
}
  
  fill(0)
}

function keyPressed() {
  if (key !== ' ') return

  if (state === STATE_PAUSED) {
    state = STATE_GAME_ON
  } else if (state === STATE_GAME_OVER) {
    reset()
  }
}