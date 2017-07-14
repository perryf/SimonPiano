// --------------------------- VARIABLES ---------------------------
let scorePointer = document.getElementById('score') // DOCUMENT IDENTIFIERS
let feedback = document.getElementById('feedback')
let secondCount = document.getElementById('timer')

let userArray = [] // MISC VARIABLES
let compArray = []
let lightsOff = false
let blackKeysOn = false
let totalKeys = 8
let listen = true
let score = 0
let scoreCount = false

let time = 800 // TIME BETWEEN NOTES
let timeSubtracter = 30

let countDownTimer // COUNT DOWN UNTIL GAME OVER
let timerReady = true
let timer = 10
let timerAdder = 0

let startKeyTimer = true // WORKAROUND TO AVOID BUTTON SMASHES
let keyTimer = 0
let keyTimerArr = []

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
  playSound () {
    this.sound.play()
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
    if (listen) { // Prevents User from Bashing Single Key
      if (startKeyTimer === true) {
        setInterval(() => {
          keyTimer++
          startKeyTimer = false
        }, 100)
      }
      keyTimerArr.push(keyTimer)
      if (keyTimerArr.length >= 3) {
        keyTimerArr.shift()
      }
    }
    if ((listen) && (userArray[userArray.length - 1] === this.num) && (userArray.length > 0) && (keyTimerArr[keyTimerArr.length - 1]) - keyTimerArr[keyTimerArr.length - 2] < 5) {
      listen = false
      setTimeout(() => {
        listen = true
      }, 500)
    }
    setTimeout(() => {
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
  arrayPush () {
    userArray.push(this.num)
    this.compare()
  }
  compare () {
    if (scoreCount) {
      let userString = userArray.join('')
      let compString = compArray.join('')
      for (let i = 0; i < userArray.length; i++) {
        if (userArray[i] !== compArray[i]) {
          gameOver()
        }
      }
      if (userArray.length === compArray.length) {
        if (userString === compString) {
          correct()
        }
      }
    }
  }
}

// --------------------------- GAME OVER / CORRECT ---------------------------

function correct () {
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

function gameOver () {
  scorePointer.innerHTML = score
  feedback.innerHTML = 'Game over'
  stopTimer()
  listen = false
  time = 800
  keys[1].sound.play()
  keys[3].sound.play()
  keys[6].sound.play()
  keys[11].sound.play()
  setTimeout(() => {
    listen = true
    scoreCount = false
  }, 1500)
  for (let i = 0; i < 8; i++) {
    keys[i].el.classList.add('keyPressR')
    setTimeout(() => {
      keys[i].el.classList.remove('keyPressR')
      if (score >= 10) {
        keys[2].sound.play()
        keys[4].sound.play()
        keys[7].sound.play()
        feedback.innerHTML = 'Great Score!'
      }
    }, 1500)
  }
}

// --------------------------- COMPUTER DATA ---------------------------

var compBox = {
  randomize: function () {
    listen = false
    stopTimer()
    compArray.push(Math.floor(Math.random() * totalKeys))
    this.callNote(compArray)
  },
  callNote: function (notes) {
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playNote(notes[i])
      }, time * i)
    } setTimeout(() => {
      listen = true
      startTimer()
    }, (time * (notes.length - 0.7)))
  },
  playNote: function (la) {
    keys[la].playSound()
  },
  playSong: function (notes) {
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playNote(notes[i])
      }, time * i)
    }
  }
}

// --------------------------- KEYS ARRAY ---------------------------

let keys = [
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

var buttonStart = document.getElementById('buttonStart')
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

var buttonFreePlay = document.getElementById('buttonFreePlay')
buttonFreePlay.addEventListener('click', function () {
  feedback.innerHTML = 'Free Play'
  scoreCount = false
  listen = true
  userArray = []
})

let lightsOffSwitch = document.getElementById('lightsToggle')
lightsOffSwitch.addEventListener('click', function () {
  if (lightsOffSwitch.checked) {
    lightsOff = true
  } else if (!lightsOffSwitch.checked) {
    lightsOff = false
  }
})

let blackKeysSwitch = document.getElementById('blackKeysToggle')
blackKeysSwitch.addEventListener('click', function () {
  if (blackKeysSwitch.checked) {
    blackKeysOn = true
    totalKeys = 13
  } else if (!blackKeysSwitch.checked) {
    blackKeysOn = false
    totalKeys = 8
  }
})

let buttonReferenceC = document.getElementById('buttonReferenceC')
buttonReferenceC.addEventListener('click', function () {
  if (listen) {
    keys[0].playSound()
  }
})

let buttonBeethoven = document.getElementById('beethoven')
buttonBeethoven.addEventListener('click', function () {
  if (listen) {
    stopTimer()
    odeToJoy()
  }
})

let buttonRagTime = document.getElementById('ragTime')
buttonRagTime.addEventListener('click', function () {
  if (listen) {
    stopTimer()
    ragTime()
  }
})

// ---------------------------COUNTDOWN TIMER---------------------------

function startTimer () {
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

// --------------------------- SONGS ---------------------------

function odeToJoy () {
  time = 550
  compArray = [2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 2, 1, 0, 0]
  compBox.playSong(compArray)
}

function ragTime () {
  time = 180
  compArray = [7, 9, 2, 4, 9, 2, 4, 12, 5, 0, 3, 5, 7, 0, 3, 5, 7, 9, 2, 4, 9, 2, 4, 12, 5, 0, 3, 5, 7, 0, 3, 5, 7, 4, 0, 7, 4, 0, 7, 4, 0]
  compBox.playSong(compArray)
}
