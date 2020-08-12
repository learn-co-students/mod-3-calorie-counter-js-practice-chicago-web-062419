//Global HTML Variables
const inputList = document.getElementById("calories-list")
const url = "http://localhost:3000/api/v1/calorie_entries"
const progressBar = document.getElementById("bmr-calculation-result").querySelector("progress")
const yourBmr = document.getElementById("your-bmr-range")
const calorieForm = document.getElementById("new-calorie-form")
const editForm = document.getElementById("edit-form-container")
const highBmrRange = document.getElementById("higher-bmr-range")
const lowBmrRange = document.getElementById("lower-bmr-range")
const bmrForm = document.getElementById("bmr-calculator")
const bmrSubmit = bmrForm.querySelector("button")
const inputs = bmrForm.querySelectorAll("input")

//HTML Event Listeners
calorieForm.addEventListener("submit", () => addNewCalorieItem(event))
bmrSubmit.addEventListener("click", () => {
    event.preventDefault()
    let weight = inputs[0].value
    let height = inputs[1].value
    let age = inputs[2].value
    setBmrRange(weight, height, age)
})


//Functions
const getCaloriesEntries = () => {
    fetch(url)
    .then(res => res.json())
    .then(items => {
        let calorieArray = []
        items.forEach(item => {
            createCaloriesListItem(item)
            calorieArray.push(item.calorie)
        })
        progressBarValue(calorieArray)
    })
}

const deleteCalorieItem = (event, li) => {
    let id = li.id.split(" ")[1]
    fetch(url + '/' + id, {
        method: "DELETE"
    }) 
    .then(li.remove())
    calorieArray = []
    let calorieLine = inputList.querySelectorAll("li")
    calorieLine.forEach(line => {
    let str = line.querySelector("strong")
    let calorie = str.innerText.split(" ")[0]
    calorieArray.push(parseInt(calorie))
    })
    progressBarValue(calorieArray)
}

const editCalorieItem = (event, li) => {
    lineCalories = li.querySelector("strong").innerText
    lineNote = li.querySelector("em").innerText
    formButton = editForm.getElementsByClassName("uk-button")[0]
    let editCalorieInput = editForm.getElementsByClassName("uk-input")[0]
    let editNoteInput = editForm.getElementsByClassName("uk-textarea")[0]
    editCalorieInput.value = Number(lineCalories)
    editNoteInput.innerText = lineNote
    formButton.addEventListener("click", () => {
        event.preventDefault()
        let id = li.id.split(" ")[1]
        fetch(url + '/' + id, {
            method: "PATCH",
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify({
                api_v1_calorie_entry: {
                    calorie: editCalorieInput.value,
                    note: editNoteInput.value
                }
            })
        })
    })
}

const addNewCalorieItem = (event) => {
    event.preventDefault()
    form = event.target
    let calorieInput = form.getElementsByClassName("uk-input")[0]
    let noteInput = form.getElementsByClassName("uk-textarea")[0]
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
        },
        body: JSON.stringify({
            api_v1_calorie_entry: {
                calorie: calorieInput.value,
                note: noteInput.value
            }
        })
    })
    .then(res => res.json())
    .then(item => {
        createCaloriesListItem(item)
        calorieInput.value = ""
        noteInput.value = ""
        calorieArray = []
        let calorieLine = inputList.querySelectorAll("li")
        calorieLine.forEach(line => {
            let str = line.querySelector("strong")
            let calorie = str.innerText.split(" ")[0]
            calorieArray.push(parseInt(calorie))
        })
        progressBarValue(calorieArray)
    })
}


const progressBarValue = (array) => {
    sum = array.reduce((p, c) => c += p)
    avg = sum/array.length
    progressBar.value = avg
    yourBmr.innerText = parseInt(avg) + " kcal"
}

const createCaloriesListItem = (item) => {
    let li = document.createElement("li")
    li.id = `item ${item.id}`
    li.className = "calories-list-item"
    li.innerHTML = 
        `<div class="uk-grid">
            <div class="uk-width-1-6">
              <strong>${item.calorie}</strong>
              <span>kcal</span>
            </div>
            <div class="uk-width-4-5">
              <em class="uk-text-meta">${item.note}</em>
            </div>
        </div>
        <div class="list-item-menu">
            <a class="edit-button" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"></a>
            <a class="delete-button" uk-icon="icon: trash"></a>
        </div>`
    let deleteButton = li.getElementsByClassName("delete-button")[0]
    let editButton = li.getElementsByClassName("edit-button")[0]
    editButton.addEventListener("click", () => {
        event.preventDefault()
        editCalorieItem(event, li)
    })
    deleteButton.addEventListener("click", () => deleteCalorieItem(event, li))
    inputList.prepend(li)
}

const setBmrRange = (weight, height, age) => {
    low = 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age)
    high = 66 + (6.23 * weight) + (12.7 * height) - (6.8 * age)
    progressBar.max = parseInt(high/3)
    highBmrRange.innerText = parseInt(high/3)
    lowBmrRange.innerText = parseInt(low/3)
    inputs.forEach(input => input.value = "")
}

getCaloriesEntries()