// --------------------------- VARIABLES ---------------------------
let scorePointer = document.getElementById('score') // DOCUMENT IDENTIFIERS
let feedback = document.getElementById('feedback')
let secondCount = document.getElementById('timer')

let userArray = [] // KEEP TRACK OF SIMON PATTERNS
let compArray = []

let lightsOff = false
let blackKeysOn = false
let totalKeys = 8 // 8 OR 13 DEPENDING ON BLACK KEYS TOGGLE

let listen = true // WHETHER OR NOT PIANO ACCEPTS INPUT FROM USER
let score = 0
let scoreCount = false

let time = 800 // TIME BETWEEN NOTES
let timeSubtracter = 30

let countDownTimer // COUNT DOWN UNTIL GAME OVER
let timerReady = true
let timer = 10
let timerAdder = 0

// --------------------------- KEY CLASS ---------------------------

class Key {
  constructor (el, sound, num, color) {
    this.el = document.getElementById(el)
    this.sound = document.getElementById(sound)
    this.num = num
    this.color = color
    this.el.addEventListener('click', () => {
      if (listen) {
        this.playSound()
        this.arrayPush()
      }
    })
  }
  playSound () { // CREATES A NEW AUDIO ELEMENT, PLAYS, THEN DELETES ITSELF
    this.toggleLights()
    let soundEl = document.createElement('audio')
    document.getElementById('soundBank').appendChild(soundEl)
    let source = this.sound.src // GET THE SOURCE FILE OF THIS KEY'S AUDIO
    soundEl.src = source // ASSIGN THAT SOURCE TO NEW SOUND ELEMENT
    soundEl.play()
    setTimeout(() => { // KILLS OFF THE NEW SOUND AFTER 1/2 SECOND
      document.getElementById('soundBank').removeChild(soundEl)
    }, 500)
  }
  toggleLights () { // LIGHT UP THE KEYS
    if (!lightsOff) {
      switch (this.color) {
        case 'blue':
          this.el.classList.add('keyPressB')
          break
        case 'yellow':
          this.el.classList.add('keyPressY')
          break
        case 'green':
          this.el.classList.add('keyPressG')
          break
        case 'red':
          this.el.classList.add('keyPressR')
      }
    }
    setTimeout(() => { // TURN LIGHTS OFF
      switch (this.color) {
        case 'blue':
          this.el.classList.remove('keyPressB')
          break
        case 'yellow':
          this.el.classList.remove('keyPressY')
          break
        case 'green':
          this.el.classList.remove('keyPressG')
          break
        case 'red':
          this.el.classList.remove('keyPressR')
      }
    }, 500)
  }
  arrayPush () { // PUSH NEW USER CLICK INTO SIMON PATTERN
    userArray.push(this.num)
    this.compare()
  }
  compare () { // COMPARE USER PATTERN TO COMPUTER PATTERN
    if (scoreCount) {
      let userString = userArray.join('')
      let compString = compArray.join('')
      for (let i = 0; i < userArray.length; i++) {
        if (userArray[i] !== compArray[i]) { // HANDLES WRONG CLICK
          gameOver()
        }
      }
      if (userArray.length === compArray.length) {
        if (userString === compString) { // HANDLES CORRECT PATTERN
          correct()
        }
      }
    }
  }
}

// --------------------------- COMPUTER DATA ---------------------------

var compBox = {
  randomize: function () { // ADD RANDOM DIGIT TO COMPUTER SIMON PATTERN
    listen = false
    stopTimer()
    compArray.push(Math.floor(Math.random() * totalKeys))
    this.callNote(compArray)
  },
  callNote: function (notes) { // SPREADS OUT SEQUENCE OF NOTES OVER TIME
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playNote(notes[i])
      }, time * i)
    } setTimeout(() => {
      listen = true
      startTimer()
    }, (time * (notes.length - 0.7)))
  },
  playNote: function (la) { // CALLS ON A KEY TO PLAY A NOTES
    keys[la].playSound()
  },
  playSong: function (notes) { // LIKE CALLNOTE BUT FOR SONGS
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playNote(notes[i])
      }, time * i)
    }
  }
}

// ---------------------------COUNTDOWN TIMER---------------------------

function startTimer () { // START COUNTDOWN TIMER
  timer = 10
  timerAdder++
  timer += timerAdder
  if (timerReady && timer) {
    timerReady = false
    countDownTimer = setInterval(() => {
      timer--
      if (timer > 0) {
        secondCount.innerHTML = timer
      } else if (timer <= 0) {
        timer = 0
        secondCount.innerHTML = timer
        gameOver()
      }
    }, 1000)
  }
}

function stopTimer () {
  clearInterval(countDownTimer)
  timerReady = true
}

// --------------------------- GAME OVER / CORRECT ---------------------------

function correct () { // RUNS IF USER PATTERN MATCHES COMPUTER PATTERN
  score++
  scorePointer.innerHTML = (score)
  feedback.innerHTML = 'Correct'
  setTimeout(() => {
    feedback.innerHTML = ''
  }, 1500)
  userArray = []
  listen = false
  if (time > 500) {
    time = time - timeSubtracter
  }
  setTimeout(() => {
    compBox.randomize()
  }, time * 1.5)
}

function gameOver () { // RUNS IF USER PATTERN DOES NOT MATCH COMPUTER PATTERN
  scorePointer.innerHTML = score
  feedback.innerHTML = 'Game over'
  stopTimer()
  listen = false
  time = 800
  gameOverSong()
  setTimeout(() => {
    listen = true
    scoreCount = false
  }, 1500)
  for (let i = 0; i < 8; i++) {
    keys[i].el.classList.add('keyPressR')
    setTimeout(() => {
      keys[i].el.classList.remove('keyPressR')
      if (score >= 10) {
        victorySong()
        feedback.innerHTML = 'Great Score!'
      }
    }, 1500)
  }
}

// --------------------------- KEYS ARRAY ---------------------------

let keys = [ // KEYS OF THE PIANO
  new Key('keyLowC', 'lowCNote', 0, 'blue'),
  new Key('keyD', 'dnote', 1, 'green'),
  new Key('keyE', 'enote', 2, 'blue'),
  new Key('keyF', 'fnote', 3, 'yellow'),
  new Key('keyG', 'gnote', 4, 'red'),
  new Key('keyA', 'anote', 5, 'yellow'),
  new Key('keyB', 'bnote', 6, 'red'),
  new Key('keyHighC', 'highCNote', 7, 'blue'),
  new Key('keyCS', 'csnote', 8, 'yellow'),
  new Key('keyDS', 'dsnote', 9, 'red'),
  new Key('keyFS', 'fsnote', 10, 'green'),
  new Key('keyGS', 'gsnote', 11, 'blue'),
  new Key('keyAS', 'asnote', 12, 'green')
]

// ---------------------------BUTTONS ---------------------------

var buttonStart = document.getElementById('buttonStart') // START THE GAME
buttonStart.addEventListener('click', function () {
  compArray = []
  userArray = []
  time = 800
  scoreCount = true
  score = 0
  timerAdder = 0
  scorePointer.innerHTML = '0'
  feedback.innerHTML = ''
  compBox.randomize()
})

var buttonFreePlay = document.getElementById('buttonFreePlay') // FREE PLAY
buttonFreePlay.addEventListener('click', function () {
  feedback.innerHTML = 'Free Play'
  scoreCount = false
  listen = true
  userArray = []
})

let lightsOffSwitch = document.getElementById('lightsToggle') // LIGHTS TOGGLE
lightsOffSwitch.addEventListener('click', function () {
  if (lightsOffSwitch.checked) {
    lightsOff = true
  } else if (!lightsOffSwitch.checked) {
    lightsOff = false
  }
})

let blackKeysSwitch = document.getElementById('blackKeysToggle') // BLACK KEYS TOGGLE
blackKeysSwitch.addEventListener('click', function () {
  if (blackKeysSwitch.checked) {
    blackKeysOn = true
    totalKeys = 13
  } else if (!blackKeysSwitch.checked) {
    blackKeysOn = false
    totalKeys = 8
  }
})

let buttonReferenceC = document.getElementById('buttonReferenceC') // REFERENCE C
buttonReferenceC.addEventListener('click', function () {
  if (listen) {
    keys[0].playSound()
  }
})

let buttonBeethoven = document.getElementById('beethoven') // BEETHOVEN SONG
buttonBeethoven.addEventListener('click', function () {
  if (listen) {
    stopTimer()
    odeToJoy()
  }
})

let buttonRagTime = document.getElementById('ragTime') // RAGTIME SONG
buttonRagTime.addEventListener('click', function () {
  if (listen) {
    stopTimer()
    ragTime()
  }
})

let buttonRandomSong = document.getElementById('random') // RAGTIME SONG
buttonRandomSong.addEventListener('click', function () {
  if (listen) {
    stopTimer()
    randomizeSong()
  }
})

// --------------------------- SONGS ---------------------------

function gameOverSong () {
  keys[1].sound.play()
  keys[3].sound.play()
  keys[6].sound.play()
  keys[11].sound.play()
}

function victorySong () { // USER SCORES 10 OR MORE POINTS
  keys[1].sound.play()
  keys[3].sound.play()
  keys[4].sound.play()
  keys[6].sound.play()
  setTimeout(() => {
    keys[0].sound.play()
    keys[2].sound.play()
    keys[4].sound.play()
    keys[7].sound.play()
  }, 300)
}

function odeToJoy () {
  time = 550
  compArray = [2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 2, 1, 0, 0]
  compBox.playSong(compArray)
}

function ragTime () {
  time = 150
  compArray = [7, 9, 2, 4, 9, 2, 4, 12, 5, 0, 3, 5, 7, 0, 3, 5, 7, 9, 2, 4, 9, 2, 4, 12, 5, 0, 3, 5, 7, 0, 3, 5, 7, 4, 0, 7, 4, 0, 7, 4, 0]
  compBox.playSong(compArray)
}

function randomizeSong () {
  for (let i = 0; i < 40; i++) {
    computerRandom()
  }
  function computerRandom () {
    compArray = []
    time = Math.floor(Math.random() * 8000 + 50)
    setTimeout(() => {
      compArray.push(Math.floor(Math.random() * 13))
      compBox.playSong(compArray)
      compArray = []
    }, time)
  }
}
