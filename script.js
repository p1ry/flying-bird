kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  clearColor: [0.8, 0.9, 1, 1],
})

// Debug inspector
debug.inspect = true

const JUMP_FORCE = 300
let PIPE_SPEED = 90
const DIST_BTWN_PIPES = height() / 4

// Load sprites with correct keys
// Set path relative to project root
loadSprite("bird", "sprites/bird.png")
loadSprite("pipe", "sprites/pipe.png")
loadSprite("background", "sprites/ocean.jpg")
loadSprite("gameover.bg", "sprites/gameover.bg.png")


// Sounds (if available)
// loadSound("jump", "jump.wav")
// loadSound("hit", "hit.wav")

scene("main", () => {
  layers(["game", "ui"], "game")

  const bg = add([
    sprite("background", { width: width(), height: height() }),
    pos(0, 0),
    layer("game"),
    {
      speed: 20,
    },
  ])

  action(() => {
    bg.pos.x -= bg.speed * dt()
    if (bg.pos.x <= -width()) {
      bg.pos.x = 0
    }
  })

  const bird = add([
    sprite("bird"),
    scale(0.08),
    pos(80, 80),
    body(),
  ])

  keyPress("space", () => {
    bird.jump(JUMP_FORCE)
    // play("jump")
  })

  mouseClick(() => {
    bird.jump(JUMP_FORCE)
    // play("jump")
  })

  function spawnPipes() {
    const pipeY = rand(50, height() - DIST_BTWN_PIPES - 50)

    add([
      sprite("pipe"),
      pos(width(), pipeY),
      scale(0.8),
      origin("botleft"),
      area(),
      "pipe",
      { passed: false }
    ])

    add([
      sprite("pipe"),
      pos(width(), pipeY + DIST_BTWN_PIPES),
      scale(0.8),
      origin("topleft"),
      area(),
      "pipe"
    ])
  }

  loop(2, spawnPipes)

  loop(5, () => {
    PIPE_SPEED += 5
  })

  const score = add([
    pos(12, 12),
    text("0", 24),
    layer("ui"),
    {
      value: 0,
    },
  ])

  action("pipe", (pipe) => {
    pipe.move(-PIPE_SPEED, 0)

    if (pipe.pos.x + pipe.width <= bird.pos.x && !pipe.passed) {
      score.value++
      score.text = score.value
      pipe.passed = true
    }

    if (pipe.pos.x + pipe.width < 0) {
      destroy(pipe)
    }
  })

  bird.action(() => {
    if (bird.pos.y >= height()) {
      // play("hit")
      go("gameover", score.value)
    }
  })

  bird.collides("pipe", () => {
    // play("hit")
    go("gameover", score.value)
  })
})

scene("gameover", (finalScore) => {
  const highScore = Math.max(parseInt(localStorage.getItem("highScore")) || 0, finalScore)
  localStorage.setItem("highScore", highScore)

  add([
    sprite("gameover.bg"),
    scale(width() / 640, height() / 360),
    pos(0, 0),
  ])

  add([
    text(`Score: ${finalScore}`, 30),
    pos(width() / 2, height() / 2 - 50),
    origin("center")
  ])

  add([
    text(`High Score: ${highScore}`, 20),
    pos(width() / 2, height() / 2 - 10),
    origin("center")
  ])

  add([
    text("Press space to play again.", 20),
    pos(width() / 2, height() / 2 + 30),
    origin("center")
  ])

  const restartBtn = add([
    text("Click to restart", 18),
    pos(width() / 2, height() / 2 + 60),
    origin("center"),
    area(),
    "restart",
  ])

  keyPress("space", () => {
    go("main")
  })

  restartBtn.onClick(() => {
    go("main")
  })
})

