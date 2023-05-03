// create an alarm to notify user when time is up
chrome.alarms.create("pomodoroTimer", {
    periodInMinutes: 1 / 60
})

// alarm listener
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "pomodoroTimer") {
        chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
            if (res.isRunning) {
                let timer = res.timer + 1
                let isRunning = true
               // console.log(timer)
              if(timer === 60 * res.timeOption) {
                this.registration.showNotification('Pomodoro Timer', {
                    body: "25 minutes has passed",
                    body: `${res.timeOption} minutes has passed!`,
                    icon: "icon.png"
                })
                timer = 0
                isRunning = false

               }
                chrome.storage.local.set({
                    timer,
                    isRunning,
                })
            }
        })
    }
})

// storage to set and track timer variables
 chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
    chrome.storage.local.set({
        timer: "timer" in res ? res.timer : 0,
        timeOption: "timeOption" in res ? res.timeOption : 25,
        isRunning: "isRunning" in res ? res.isRunning : false,
    })
})