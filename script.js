const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeContainer = document.querySelector(".recipe-container");

// Function to get recepies

const fetchRecipes = async (inputValue) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";

  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`
    );
    const response = await data.json();
    recipeContainer.innerHTML = "";
    response.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      recipeDiv.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
      <p><span>${meal.strArea}</span> Dish</p>
      <p>Belong to <span>${meal.strCategory}</span> Category</p>
    `;

      const recipeBtn = document.createElement("button");
      recipeBtn.classList.add("recipe-btn");
      recipeBtn.textContent = "Get Recipe";
      recipeDiv.appendChild(recipeBtn);

      recipeBtn.addEventListener("click", () => {
        openRecipePopup(meal);
      });
      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    recipeContainer.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
  }
};

const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} - ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
  <h2 class="recipeName">${meal.strMeal}</h2>
  <h3>Ingredients:</h3>
  <ul class="ingredientList">${fetchIngredients(meal)}</ul>
  <div>
  <h3>Instructions:</h3>
  <p class="recipeInstructions">${meal.strInstructions}</p>
  </div>
  `;
  recipeDetailsContent.parentElement.style.display = "block";
};

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const inputValue = searchBox.value.trim();
  if (!inputValue) {
    recipeContainer.innerHTML = "<h2>Please type the meal in search box.</h2>";
    return;
  }
  fetchRecipes(inputValue);
});

recipeCloseBtn.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = "none";
});
