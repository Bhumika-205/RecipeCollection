const recipes = [

{
    title:"Chocolate Cake", time:"45 Minutes", servings:"8 Servings",
    image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    ingredients:[ "2 cups Flour", "1 cup Sugar", "1/2 cup Cocoa Powder", "2 Eggs", "1 cup Milk" ],
    steps:[ "Preheat oven to 180°C", "Mix dry ingredients", "Add eggs and milk", "Pour into baking tray", "Bake for 30 minutes" ]
},

{
    title:"White Sauce Pasta", time:"25 Minutes", servings:"2 Servings",
    image:"https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb",
    ingredients:[ "Pasta", "Milk", "Butter", "Cheese", "Black Pepper" ],
    steps:[ "Boil pasta", "Prepare white sauce","Add cheese", "Mix pasta", "Serve hot" ]
},

{
    title:"Veg Biryani", time:"60 Minutes", servings:"4 Servings",
    image:"https://plus.unsplash.com/premium_photo-1694141251673-1758913ade48?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ingredients:[ "Rice", "Mixed Vegetables", "Spices", "Curd", "Mint Leaves"],
    steps:[ "Soak rice", "Cook vegetables", "Prepare masala", "Layer rice and vegetables", "Dum cook for 20 mins"]
},

{
    title:"Paneer Butter Masala", time:"40 Minutes", servings:"4 Servings",
    image:"https://images.unsplash.com/photo-1565557623262-b51c2513a641",
    ingredients:[ "Paneer", "Tomatoes", "Butter", "Cream", "Spices" ],
    steps:[ "Cook tomatoes", "Blend gravy", "Add spices", "Add paneer", "Cook for 10 minutes" ]
},

{
    title:"Margherita Pizza", time:"50 Minutes", servings:"2 Servings",
    image:"https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
    ingredients:[ "Pizza Base", "Cheese", "Tomato Sauce", "Basil Leaves" ],
    steps:[ "Prepare pizza base", "Spread sauce", "Add cheese", "Bake pizza", "Add basil leaves" ]
},

{
    title:"Chocolate Brownie", time:"35 Minutes", servings:"6 Servings",
    image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
    ingredients:[ "Chocolate", "Butter", "Flour", "Sugar", "Eggs" ],
    steps:[ "Melt chocolate", "Mix ingredients", "Pour into tray", "Bake brownie", "Cool and serve" ]
}
];

let currentRecipe = null;
let currentStep = 0;
let timerInterval;

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&q=80";

// ---------- Rendering the card grid ----------

function renderCards(){

    const container = document.getElementById("recipeContainer");

    container.innerHTML = recipes.map((recipe, index) => `
        <div class="card" onclick="openRecipe(${index})">
            <img src="${recipe.image || FALLBACK_IMAGE}" alt="${recipe.title}"
                    onerror="this.src='${FALLBACK_IMAGE}'">
            <div class="card-content">
                <h3>${recipe.title}</h3>
                <p>Prep Time: ${recipe.time}</p>
                <button>View Recipe</button>
            </div>
        </div>
    `).join("");
}

// ---------- View Recipe modal ----------

function openRecipe(index){

    currentRecipe = recipes[index];

    document.getElementById("recipeTitle").textContent =
    currentRecipe.title;

    document.getElementById("prepTime").textContent =
    "Preparation Time: " + currentRecipe.time;

    document.getElementById("servingSize").textContent =
    currentRecipe.servings ? "Servings: " + currentRecipe.servings : "";

    document.getElementById("recipeImage").src = currentRecipe.image || FALLBACK_IMAGE;

    document.getElementById("ingredientsList").innerHTML =
    currentRecipe.ingredients.map(item =>
    `<li>${item}</li>`).join("");

    document.getElementById("stepsList").innerHTML =
    currentRecipe.steps.map(step => `<li>${step}</li>`).join("");

    document.getElementById("recipeModal").style.display = "block";
    document.getElementById("progressBar").style.width = "0%";
    document.getElementById("timer").innerHTML = "00:00";
    document.getElementById("completionMessage").style.display = "none";

    clearInterval(timerInterval);
    currentStep = 0;
}

function closeModal(){
    document.getElementById("recipeModal").style.display = "none";
    clearInterval(timerInterval);
}

function toggleIngredients(){
    document.getElementById("ingredientsSection").classList.toggle("hidden");
}

function toggleSteps(){
    document.getElementById("stepsSection").classList.toggle("hidden");
}

function startCooking(){

    const steps = document.querySelectorAll("#stepsList li");
    if(steps.length === 0) return;

    steps.forEach(step => step.classList.remove("active-step"));
    currentStep = 0;
    steps[0].classList.add("active-step");
    document.getElementById("completionMessage").style.display = "none";
    updateProgress();
    startTimer(30);
}

function nextStep(){

    const steps = document.querySelectorAll("#stepsList li");
    if(steps.length === 0) return;

    if(currentStep < steps.length - 1){
        steps[currentStep].classList.remove("active-step");
        currentStep++;
        steps[currentStep].classList.add("active-step");
        updateProgress();
    }
    else{
        document.getElementById("progressBar").style.width = "100%";
        clearInterval(timerInterval);
        document.getElementById("timer").innerHTML = "Completed";
        document.getElementById("completionMessage").style.display = "block";
    }
}

function updateProgress(){
    const steps = document.querySelectorAll("#stepsList li");
    let progress = ((currentStep + 1) / steps.length) * 100;
    document.getElementById("progressBar").style.width = progress + "%";
}

function startTimer(minutes){

    clearInterval(timerInterval);
    let seconds = minutes * 60;
    timerInterval = setInterval(()=>{
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        document.getElementById("timer").innerHTML =
        `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

        if(seconds <= 0){
            clearInterval(timerInterval);
            document.getElementById("completionMessage").style.display = "block";
            document.getElementById("timer").innerHTML = "00:00";
        }
        seconds--;
    },1000);

}

function printRecipe(){
    window.print();
}

// ---------- Add Recipe modal ----------

function openAddRecipeModal(){
    document.getElementById("addRecipeModal").style.display = "block";
}

function closeAddRecipeModal(){
    document.getElementById("addRecipeModal").style.display = "none";
    document.getElementById("addRecipeForm").reset();
}

function submitRecipe(event){

    event.preventDefault();

    const title = document.getElementById("inputTitle").value.trim();
    const image = document.getElementById("inputImage").value.trim();
    const time = document.getElementById("inputTime").value.trim();
    const servings = document.getElementById("inputServings").value.trim();

    const ingredients = document.getElementById("inputIngredients").value
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const steps = document.getElementById("inputSteps").value
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

    if(!title || ingredients.length === 0 || steps.length === 0){
        alert("Please fill in the title, at least one ingredient, and at least one step.");
        return;
    }

    recipes.push({
        title,
        time: time || "N/A",
        servings: servings || "",
        image: image || FALLBACK_IMAGE,
        ingredients,
        steps
    });

    renderCards();
    closeAddRecipeModal();
}

renderCards();