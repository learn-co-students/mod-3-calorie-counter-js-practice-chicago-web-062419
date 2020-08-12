// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
const addCalButton = document.getElementsByClassName("uk-button uk-button-default")[1]
const ul = document.getElementById("calories-list")
const food_items = document.getElementsByClassName("calories-list-item")

//edit calorie form
let editCalorieForm = document.getElementById("edit-calorie-form")
let editCalorieInput = editCalorieForm.querySelector("input")
let editNote = editCalorieForm.querySelector("textarea")
let progressBar = document.querySelector("progress")
let updateEntryButton = document.getElementsByClassName("uk-button uk-button-default")[2]

//add new food form
const newFoodForm = document.getElementById("new-calorie-form")
const newFoodCalories = newFoodForm.querySelector("input")
const newFoodNote = newFoodForm.querySelector("textarea")

const createCaloriesListItem = (item) => {
    let li = document.createElement("li")
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
    return li
}

fetch("http://localhost:3000/api/v1/calorie_entries")
    .then(res => res.json())
    .then(items => {
        items.forEach(item =>{
            let listItem = createCaloriesListItem(item)
            ul.appendChild(listItem)
            //to add event listener and make the edit form work
            listItem.querySelectorAll("a")[0].addEventListener("click", ()=>{
                event.preventDefault()
                
                let calorieNumber = event.target.parentNode.parentNode.parentNode.querySelector("strong")
                let calorieNote = event.target.parentNode.parentNode.parentNode.querySelector("em")
                const editCalorie = () => {
                    editCalorieForm.querySelector("button")
                    updateEntryButton.addEventListener("click", ()=>{
                        event.preventDefault()
                        
                        calorieNumber.innerHTML = editCalorieInput.value 
                        calorieNote.innerHTML = editNote.value
                        fetch(`http://localhost:3000/api/v1/calorie_entries/${item.id}`,{
                            method: "PATCH",
                            headers: {
                                "content-type": "application/json",
                                "accept": "application/json"
                            },
                            body:JSON.stringify({
                                api_v1_calorie_entry: {
                                    calorie: Number(editCalorieInput.value),
                                    note: editNote.value
                                }
                            })
                        })
                        .then(res => res.json())
                    })
                }
                editCalorie()
            })

            listItem.querySelectorAll("a")[1].addEventListener("click",()=> {
                fetch(`http://localhost:3000/api/v1/calorie_entries/${item.id}`,{
                    method: "DELETE"
                })
                .then(res => res.json())
                .then(listItem.remove())
            })
        })

    })



//BMR
const bmrButton = document.querySelector("button.uk-button")
let inputs = document.querySelectorAll("input.uk-input")
let weight = document.querySelectorAll("input.uk-input")[0]
let height = inputs[1]
let age = inputs[2]

let lower_bmr = document.getElementById("lower-bmr-range")
let higher_bmr = document.getElementById("higher-bmr-range")
bmrButton.addEventListener("click", ()=>{
    event.preventDefault()
    let lowerRange = Math.floor(655 + (4.35 * Number(weight.value)) + (4.7 * Number(height.value)) - (4.7 * Number(age.value)))
    let higherRange = Math.floor(66 + (6.23 * Number(weight.value)) + (12.7 * Number(height.value)) - (6.8 * Number(age.value)))
    lower_bmr.innerHTML = lowerRange
    higher_bmr.innerHTML = higherRange
    progressBar.setAttribute("max",higherRange)
})

// Add New Food

addCalButton.addEventListener("click", ()=>{
    event.preventDefault()
    //Actually add the new food to the list now
    fetch(`http://localhost:3000/api/v1/calorie_entries`,{
        method: "POST",
        headers:{
            "content-type":"application/json",
            "accept":"application/json"
        },
        body:JSON.stringify({
            api_v1_calorie_entry: {
                calorie: Number(newFoodCalories.value),
                note: newFoodNote.value
            }
        })  
    })
    .then(res => res.json())
    .then(food => {
            let listItem = createCaloriesListItem(food)
            ul.append(listItem)
            listItem.querySelectorAll("a")[0].addEventListener("click", ()=>{
                event.preventDefault()
                
                let calorieNumber = event.target.parentNode.parentNode.parentNode.querySelector("strong")
                let calorieNote = event.target.parentNode.parentNode.parentNode.querySelector("em")
                const editCalorie = () => {
                    editCalorieForm.querySelector("button")
                    updateEntryButton.addEventListener("click", ()=>{
                        event.preventDefault()
                        
                        calorieNumber.innerHTML = editCalorieInput.value 
                        calorieNote.innerHTML = editNote.value
                        fetch(`http://localhost:3000/api/v1/calorie_entries/${food.id}`,{
                            method: "PATCH",
                            headers: {
                                "content-type": "application/json",
                                "accept": "application/json"
                            },
                            body:JSON.stringify({
                                api_v1_calorie_entry: {
                                    calorie: Number(editCalorieInput.value),
                                    note: editNote.value
                                }
                            })
                        })
                        .then(res => res.json())
                    })
                }
                editCalorie()
            })

            listItem.querySelectorAll("a")[1].addEventListener("click",()=> {
                fetch(`http://localhost:3000/api/v1/calorie_entries/${food.id}`,{
                    method: "DELETE"
                })
                .then(res => res.json())
                .then(listItem.remove())
            })
    })

    all_calories = []
    
    for(const food of food_items){
        let calholder = food.querySelector("strong")
        all_calories.push(calholder.innerHTML)
    }
    
    integers = all_calories.map(calorie => Number(calorie))
    let totalcals = integers.reduce((total, calorie) =>{return total + calorie })
    progressBar.value = totalcals
    
})