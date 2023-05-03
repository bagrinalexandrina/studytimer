let tasks = []

const time = document.getElementById("time");

// Update time every 1sec
function updateTime() {
    chrome.storage.local.get(["timer", "timeOption"], (res) => {
      const time = document.getElementById("time")
      
      // get no. of minutes & secs
      const minutes = `${ res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0");
      let seconds = "00";
      if (res.timer % 60 != 0) {
        seconds = `${60 -res.timer % 60}`.padStart(2, "0");
      }
  
      // show minutes & secs on UI
    time.textContent = `${minutes}:${seconds}`
    })
  }

updateTime()
setInterval(updateTime, 1000)



const startTimerBtn = document.getElementById("start-timer-btn");
startTimerBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    chrome.storage.local.set({
      isRunning: !res.isRunning,
    }, () => {
      startTimerBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer"
    })
  })
})

const resetTimerBtn = document.getElementById("reset-timer-btn")
resetTimerBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    // reset variables
    timer: 0,
    isRunning: false
  }, () => {
    // reset start button text-content
    startTimerBtn.textContent = "Start Timer"
  })
})

const addTaskBtn = document.getElementById('add-task-btn')
addTaskBtn.addEventListener('click', () => addTask())

// set default storage value for the tasks
chrome.storage.sync.get(['tasks'], (res) => {
    tasks = res.tasks ? res.tasks : []
    renderTasks()
  })
  
  // save tasks
  function saveTasks() {
    chrome.storage.sync.set({
      tasks: tasks,
    })
  }

function renderTask(taskNum) {
  const taskRow = document.createElement('div')

  // Create text input
  const text = document.createElement('input')
  text.type = 'text'
  text.placeholder = 'Enter a task..'

  //Set and track input values of tasks in the array
  text.value = tasks[taskNum]
  text.addEventListener('change', () => {
    tasks[taskNum] = text.value

    // call saveTask whenever a value changes
   saveTasks()
  })
        
    // Create delete button
    const deleteBtn = document.createElement('input')
    deleteBtn.type = 'button'
    deleteBtn.value = 'X'

    // delete task
    deleteBtn.addEventListener('click', () => {
    deleteTask(taskNum)
    })

    // append input elements to taskRow
    taskRow.appendChild(text)
    taskRow.appendChild(deleteBtn)

    // append taskRow to taskContainer
    const taskContainer = document.getElementById('task-container')
    taskContainer.appendChild(taskRow)
    }


function addTask() {
  const tasksNum = tasks.length
  // add tasks to array
  tasks.push('')
  renderTask(tasksNum)
  saveTasks()
}

// delete and re-render tasks after mutation
function deleteTask(tasksNum) {
  tasks.splice(tasksNum, 1)
  renderTasks()
  saveTasks()
}

function renderTasks() {
    const taskContainer = document.getElementById('task-container')
    taskContainer.textContent = ''
    tasks.forEach((taskText, tasksNum) => {
      renderTask(tasksNum)
    })
  }
  