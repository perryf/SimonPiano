let score = document.getElementById('score')
let feedback = document.getElementById('feedback')
let time = 800
let timeSubtracter = 20
let timerOn = false
let startInterval = true
let keyTimer = 0
let keyTimerArr = []
let listen = true
let scoreCount = false
let extreme = false

let userArray = []
let compArray = []

let timer = 0
let secondCount = document.getElementById('timer')

var buttonNormal = document.getElementById('buttonNormal')
buttonNormal.addEventListener('click', function () {
  compArray = []
  userArray = []
  scoreCount = true
  score.innerHTML = '0'
  timeSubtracter = 20
  extreme = false
  if (!timerOn) { // Timer!
    timerOn = true
    setInterval(() => {
      timer++
      secondCount.innerHTML = timer
    }, 1000)
  }
  compBox.randomize()
})

var buttonExtreme = document.getElementById('buttonExtreme')
buttonExtreme.addEventListener('click', function () {
  compArray = []
  userArray = []
  scoreCount = true
  score.innerHTML = '0'
  extreme = true
  timeSubtracter = 30
  compBox.randomize()
  if (!timerOn) { // Timer!
    timerOn = true
    setInterval(() => {
      timer++
      secondCount.innerHTML = timer
    }, 1000)
  }
})

var buttonFreePlay = document.getElementById('buttonFreePlay')
buttonFreePlay.addEventListener('click', function () {
  scoreCount = false
  listen = true
  userArray = []
})

let buttonReferenceC = document.getElementById('buttonReferenceC')
buttonReferenceC.addEventListener('click', function () {
  keys[0].playSound()
})

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
    // console.log(this.sound.duration) // Testing
    this.sound.volume = 1
    this.sound.play()
    if (!extreme) {
      this.el.classList.add('keyPress')
    }
    if (listen) {
      if (startInterval === true) {
        setInterval(() => {
          keyTimer++
          startInterval = false
        }, 100)
      }
      keyTimerArr.push(keyTimer)
      if (keyTimerArr.length >= 3) {
        keyTimerArr.shift()
      }
    }
    // Prevents User from Bashing Single Key
    if ((listen) && (userArray[userArray.length - 1] === this.num) && (userArray.length > 0) && (keyTimerArr[keyTimerArr.length - 1]) - keyTimerArr[keyTimerArr.length - 2] < 5) {
      // console.log(userArray)
      // console.log(this.num)
      listen = false
      setTimeout(() => {
        listen = true
      }, 500)
    }
    setTimeout(() => {
      this.stopSound()
    }, time)
  }
  stopSound () {
    // console.log(userArray)
    // $(this.sound).animate({volume: 0}, 10)
    // this.sound.pause()
    // this.sound.load()
    if (!extreme) {
      this.el.classList.remove('keyPress')
    }
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
          score.innerHTML = (compArray.length - 1)
          feedback.innerHTML = 'Game over'
          listen = false
          userArray = []
          compArray = []
          time = 800
        }
      }
      if (userArray.length === compArray.length) {
        if (userString === compString) {
          score.innerHTML = (compArray.length - 1)
          feedback.innerHTML = 'Correct'
          userArray = []
          listen = false
          if (time > 500) {
            time = time - timeSubtracter
          }
          setTimeout(() => {
            compBox.randomize()
          }, time * 1.5)
        }
      }
    }
  }
}

var compBox = {
  randomize: function () {
    listen = false
    compArray.push(Math.floor(Math.random() * 8))
    this.callNote(compArray)
  },
  callNote: function (notes) {
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playNote(notes[i])
      }, time * i)
      setTimeout(() => {
        listen = true
      }, (time * notes.length))
    }
  },
  playNote: function (la) {
    keys[la].playSound()
  }
}

let keys = [
  new Key('keyLowC', 'lowCNote', 0),
  new Key('keyD', 'dnote', 1),
  new Key('keyE', 'enote', 2),
  new Key('keyF', 'fnote', 3),
  new Key('keyG', 'gnote', 4),
  new Key('keyA', 'anote', 5),
  new Key('keyB', 'bnote', 6),
  new Key('keyHighC', 'highCNote', 7)
]
