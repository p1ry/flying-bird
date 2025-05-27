// initialize Kaboom
kaboom({
  global: true, // import all functions into global namespace
  fullscreen: true, // render across entire browser window
})

const JUMP_FORCE = 300
const PIPE_SPEED = 90

loadRoot("/sprites/")
loadSprite("bird", "bird.png")
loadSprite("background", "ocean.jpg")
loadSprite("gameover_bg", "bird_bg.jpg")
loadSprite("pipe", "pipe.png")

scene("main", () => {

  layers([
    "game",
    "ui",
  ], "game")

  add([
    sprite("background"),
    scale(width() / 4000, height() / 2500),
    origin("topleft")
  ])

  const bird = add([
    sprite("bird"),
    scale(0.08),
    pos(80, 80),
    body(), // implements gravity on the object
  ])

  keyPress("space", () => {
    bird.jump(JUMP_FORCE)
  })

  const DIST_BTWN_PIPES = height() / 4

  // add new pipes to the scene every 3 seconds
  loop(3, () => {

    const pipe_position = rand(0, height() - DIST_BTWN_PIPES)

    add([
      sprite("pipe"),
      origin("bot"),
      pos(width() - 10, pipe_position),
      scale(height() / 400, 2.5),
      "pipe" // "pipe" tag
    ])

    add([
      sprite("pipe"),
      pos(width() - 10, pipe_position + DIST_BTWN_PIPES),
      scale(height() / 400, -2.5),
      origin("bot"),
      "pipe",
      {
        passed: false, 
      },
    ])

  })

  // move the pipes towards the left side of the screen
  action("pipe", (pipe) => { // gives all objects with tag "pipe" something to run every frame
    pipe.move(-PIPE_SPEED, 0)

    // check if bird passes a pipe
    if (pipe.pos.x + pipe.width <= bird.pos.x && !pipe.passed) {
      score.value++
      score.text = score.value
      pipe.passed = true
    }

    // remove pipe from game when it's outside of the screen
    if (pipe.pos.x + pipe.width < 0) {
      destroy(pipe)
    }

  })

  // player's score
  const score = add([
    pos(12, 12),
    text("0", 24),
    layer("ui"),
    {
      value: 0,
    },
  ])

  // bird falls off the screen
  bird.action(() => {
    if (bird.pos.y >= height()) {
      go("gameover", score.value)
    }
  })

  // bird collides with a pipe
  bird.collides("pipe", () => {
    go("gameover", score.value)
  })

})

scene("gameover", (score) => {

  add([
    sprite("gameover_bg"),
    scale(width() / 3000, height() / 3000),
    origin("topleft")
  ])

  add([
    text(`Score: ${score}`, 30),
    pos(width() / 2, height() / 2 - 50),
    origin("center")
  ])

  add([
    text("Press space to play again.", 20),
    pos(width() / 2, height() / 2),
    origin("center")
  ])

  keyPress("space", () => {
    go("main")
  })

})

// initiate game to the scene named "main"
start("main")