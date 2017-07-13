let score = document.getElementById('score')
let feedback = document.getElementById('feedback')
let lightsOffSwitch = document.getElementById('lightsToggle')
let blackKeysSwitch = document.getElementById('blackKeysToggle')
let secondCount = document.getElementById('timer')

let lightsOff = false
let blackKeysOn = false
let totalKeys = 8
let time = 800
let timeSubtracter = 20
let startKeyTimer = true
let keyTimer = 0
let keyTimerArr = []
let listen = true
let scoreCount = false
let countDownTimer

let userArray = []
let compArray = []

let timerReady = true
let timer = 10
let timerAdder = 0

// ---------------------------BUTTONS ---------------------------

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

var buttonNormal = document.getElementById('buttonNormal')
buttonNormal.addEventListener('click', function () {
  compArray = []
  userArray = []
  scoreCount = true
  timerAdder = 0
  score.innerHTML = '0'
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

lightsOffSwitch.addEventListener('click', function () {
  if (lightsOffSwitch.checked) {
    lightsOff = true
  } else if (!lightsOffSwitch.checked) {
    lightsOff = false
  }
})

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
  keys[0].playSound()
})

// --------------------------- KEY CLASS ---------------------------

class Key {
  constructor (el, sound, num) {
    this.el = document.getElementById(el)
    this.sound = document.getElementById(sound)
    this.num = num
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
      this.el.classList.add('keyPress')
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
      this.el.classList.remove('keyPress')
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

function gameOver () {
  score.innerHTML = compArray.length - 1
  feedback.innerHTML = 'Game over'
  stopTimer()
  listen = false
  time = 800
}

function correct () {
  score.innerHTML = (compArray.length)
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
  }
}

// --------------------------- KEYS ARRAY ---------------------------

let keys = [
  new Key('keyLowC', 'lowCNote', 0),
  new Key('keyD', 'dnote', 1),
  new Key('keyE', 'enote', 2),
  new Key('keyF', 'fnote', 3),
  new Key('keyG', 'gnote', 4),
  new Key('keyA', 'anote', 5),
  new Key('keyB', 'bnote', 6),
  new Key('keyHighC', 'highCNote', 7),
  new Key('keyCS', 'csnote', 8),
  new Key('keyDS', 'dsnote', 9),
  new Key('keyFS', 'fsnote', 10),
  new Key('keyGS', 'gsnote', 11),
  new Key('keyAS', 'asnote', 12)
]
