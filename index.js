const searchBtn = document.querySelector(".inputButton");
const input = document.querySelector(".inputBox");
const mealDetailsContent = document.querySelector(".detailRecipe");
const mealList = document.querySelector(".recipes");
const searchResultHeading = document.querySelector(".searchResultHeading");

// Click & Enter trigger search
searchBtn.addEventListener("click", getMealList);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getMealList();
  }
});

// Use event delegation
mealList.addEventListener("click", getMealRecipe);

// Close modal
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("CloseBtn")) {
    mealDetailsContent.classList.remove("show-item");
  }
});

// Async Meal Fetch
async function getMealList() {
  const searchInputTxt = input.value.trim();
  if (!searchInputTxt) return;

  // UI feedback
  searchBtn.disabled = true;
  searchBtn.textContent = "Searching…";

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
    );
    const data = await response.json();

    let html = "";
    if (data.meals) {
      data.meals.forEach((meal) => {
        html += `
          <div class="recipeContainer" id="${meal.idMeal}">
            <div class="imgHover">
              <img class="mealImage" src="${meal.strMealThumb}" alt="meal photo">
            </div>
            <h4 class="mealName">${meal.strMeal}</h4>
            <button class="getRecipeBtn">Recipe</button>
          </div>
        `;
      });
      mealList.classList.remove("notFound");
    } else {
      html = "Sorry we did not find any meal.";
      mealList.classList.add("notFound");
    }
    mealList.innerHTML = html;

    // Show "Your search result"
    searchResultHeading.style.display = "block";
  } catch (error) {
    console.error("Error fetching meals:", error);
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
  }
}

// Get recipe details
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("getRecipeBtn")) {
    const mealItem = e.target.closest(".recipeContainer");
    const mealId = mealItem.id;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then((response) => response.json())
      .then((data) => {
        mealRecipeModel(data.meals);
      });
  }
}

// Display modal
function mealRecipeModel(meal) {
  meal = meal[0];
  const html = `
    <div class="detailRecipeContainer" id=${meal.idMeal}>
      <button class="CloseBtn">X</button>
      <div class="instruction">
        <h2 class="MealName">${meal.strMeal}</h2>
        <h4>${meal.strArea}</h4>
        <div class="photoInstruction">
          <img class="ImageInstruction" src="${meal.strMealThumb}" alt="Meal photo">
          <p class="recipeInstruction">${meal.strInstructions}</p>
        </div>
        <a class="watchVideo" href="${meal.strYoutube}" target="_blank">Watch Video</a>
      </div>
    </div>
  `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.classList.add("show-item");
}