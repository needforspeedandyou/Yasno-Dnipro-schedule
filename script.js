let activeTab = 'today'

async function run() {
    const res = await fetch("https://corsproxy.io/?https://app.yasno.ua/api/blackout-service/public/shutdowns/regions/3/dsos/301/planned-outages")
    const data = await res.json()
    console.log(data)

    const createQueue = (data) => {
        const noticeBlock = document.querySelector(".notice-block")
        const queueCardsDiv = document.querySelector(".queue-cards")
        queueCardsDiv.textContent = ""
        noticeBlock.textContent = ""
        for (let key in data) {
            const queueCard = document.createElement("div")

            if (data[key][activeTab].status === "WaitingForSchedule") {
                const notice = document.createElement("h2")

                notice.textContent = 'No shedule for tommorow!'
                notice.style.textAlign = 'center'

                noticeBlock.appendChild(notice)

                break
            } else {
                let filteredData = data[key][activeTab].slots.filter(slot => slot.type !== "NotPlanned")
                console.log(filteredData)

                queueCard.classList.add("queue-card")
                queueCard.innerHTML =
                    `
                        <div class="card-title"><h3>${key}:</h3></div>
                        <div class="card-shutdowns"></div>
                    `
                queueCardsDiv.appendChild(queueCard)

                for (let shutdown of filteredData) {
                    const cardShutdowns = queueCard.querySelector(".card-shutdowns")

                    const shutdownTime = document.createElement("p")
                    let shutdownStart = (shutdown.start / 60).toString().replace(".5", ":30")
                    if (!shutdownStart.includes(":30")) {
                        shutdownStart = shutdownStart + ":00"
                    }
                    let shutdownEnd = (shutdown.end / 60).toString().replace(".5", ":30")
                    if (!shutdownEnd.includes(":30")) {
                        shutdownEnd = shutdownEnd + ":00"
                    }
                    shutdownTime.textContent = `${shutdownStart} - ${shutdownEnd}`

                    cardShutdowns.appendChild(shutdownTime)
                }
            }
        }
    }

    createQueue(data)
}

const switchButton = document.querySelector("#switchButton")
switchButton.addEventListener("click", () => {
    if (activeTab === 'today') {
        activeTab = 'tomorrow'
        switchButton.textContent = 'Tomorrow'
    } else {
        activeTab = 'today'
        switchButton.textContent = 'Today'
    }
    run()
})

run()
setInterval(() => {
    console.log("started")
    run()
}, 60000)

