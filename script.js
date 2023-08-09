const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const searchInput = document.getElementById('search-input');
let resultCount = 0; // Variable to count the number of searches

// event listeners
searchBtn.addEventListener('click', getMealList);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.shiftKey) {
    getMealList();
  }
});
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

function getMealList() {
    let ingredients = $("#selected-ingredients").children().map(function() { return $(this).data('ingredient'); }).get();
  
    // Create an object to store meal data and ingredient counts
    let mealData = {};
  
    // Function to fetch meals for an ingredient
    async function fetchMealsForIngredient(ingredient) {
      let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
      let data = await response.json();
      return data.meals;
    }
  
    // Function to update the meal data with ingredient counts
    async function updateMealDataForIngredient(ingredient) {
      let meals = await fetchMealsForIngredient(ingredient);
      // console.log(meals); // Check the value of 'meals'
      meals.forEach((meal) => {
        if (!mealData[meal.idMeal]) {
          mealData[meal.idMeal] = {
            meal: meal,
            count: 1,
          };
        } else {
          mealData[meal.idMeal].count++;
        }
      });
    }
  
    // Function to update the result count and display the meals
    function updateResultCount() {
      let html = "";
      let resultCount = 0;
      for (const mealId in mealData) {
        if (mealData[mealId].count === ingredients.length) {
          let meal = mealData[mealId].meal;
          html += `
            <div class="meal-item" data-id="${meal.idMeal}">
              <div class="meal-img">
                <img src="${meal.strMealThumb}" alt="food">
              </div>
              <div class="meal-name">
                <h3>${meal.strMeal}</h3>
                <a href="#" class="recipe-btn">Get Recipe</a>
              </div>
            </div>
          `;
          resultCount++;
        }
    }
      // console.log(resultCount);
      
      document.getElementById('result-count').textContent = resultCount;
      if (resultCount > 0) {
        mealList.classList.remove('notFound');
      } else {
        html = "Sorry, we didn't find any meal!";
        mealList.classList.add('notFound');
      }
  
      mealList.innerHTML = html;
    }
  
    // Fetch and update meal data for each ingredient
    async function fetchAndUpdateMeals() {
      let fetchPromises = ingredients.map(updateMealDataForIngredient);
      await Promise.all(fetchPromises);
      updateResultCount();
    //   console.log(mealData);
    }
    
    // Call the function to start the process
    fetchAndUpdateMeals();
}

// get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

function mealRecipeModal(meal) {
    // console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
        <div class="recipe-link">
            <a href="meal-details.html?id=${meal.idMeal}" target="_blank">Open Recipe in New Page</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

$(document).ready(function() {
  const defaultIngredients = [
    "Chicken",
    "Salmon",
    "Beef",
    "Pork",
    "Avocado",
    "Asparagus",
    "Broccoli",
    "Brown Lentils",
    "Carrots",
    "Cinnamon",
    "Garlic",
    "Ginger",
    "Lemon",
    "Onion",
    "Olive oil",
    "Tomatoes",
    "Rice",
    "Pasta",
    "Butter",
    "Eggs",
    "Milk",
    "Flour",
    "Potatoes",
    "Bell peppers",
    "Spinach",
  ];

    // Fetch the list of ingredients from the API
    $.get("https://www.themealdb.com/api/json/v1/1/list.php?i=list", function(data) {
      let ingredients = data.meals;
      if (ingredients) {
        // Get the search input element
        const searchInput = $("#search-input");
  
        // Event listener for input changes in the search bar
        searchInput.on("input", function() {
          const userInput = searchInput.val().toLowerCase().trim();
          updateIngredientSuggestions(userInput);
          // console.log(userInput);
        });

        const ingredientChoices = $("#ingredient-choices");
        // Display default ingredients when the search bar is empty
        const defaultIngredientsHTML = defaultIngredients.map((ingredient) => {
          return `<button class="ingredient-choice-btn">${ingredient}</button>`;
        });
        ingredientChoices.html(defaultIngredientsHTML.join(""));
  
        // Function to filter ingredients and display suggestions
        function updateIngredientSuggestions(inputValue) {
          if (inputValue === '') {
            // If the input is empty, display the default ingredients as suggestions
            const defaultIngredientsHTML = defaultIngredients.map((ingredient) => {
              return `<button class="ingredient-choice-btn">${ingredient}</button>`;
            });
            $("#ingredient-choices").html(defaultIngredientsHTML.join(""));
          } else {
            // Filter the list of ingredients based on the user's input
            const filteredIngredients = ingredients.filter((ingredient) =>
              ingredient.strIngredient.toLowerCase().includes(inputValue.toLowerCase())
            );

            // Filter ingredients that start with the search string and sort them alphabetically
            const matchingIngredients = filteredIngredients
            .filter(filteredIngredients => filteredIngredients.strIngredient.toLowerCase().startsWith(inputValue))
            .sort((a, b) => a.strIngredient.localeCompare(b.strIngredient));

            // console.log(matchingIngredients);

            // Filter ingredients that don't start with the search string and sort them alphabetically
            const remainingIngredients = filteredIngredients
              .filter(filteredIngredients => !filteredIngredients.strIngredient.toLowerCase().startsWith(inputValue))
              .sort((a, b) => a.strIngredient.localeCompare(b.strIngredient));

            // Combine the two sorted arrays
            const finalIngredientsList = matchingIngredients.concat(remainingIngredients);
        
            // Limit the number of suggestions to 25
            const limitedIngredients = finalIngredientsList.slice(0, 25);
        
            // Generate HTML buttons for each suggestion ingredient
            const suggestionButtonsHTML = limitedIngredients.map((ingredient) => {
              return `<button class="ingredient-choice-btn">${ingredient.strIngredient}</button>`;
            });
        
            // Update the HTML of the suggestion container
            $("#ingredient-choices").html(suggestionButtonsHTML.join(""));
          }
        }
  
        // Function to update the selected ingredients in the "selected-ingredients" container
        function updateSelectedIngredients() {
          const selectedIngredientsContainer = $("#selected-ingredients");
          const selectedIngredients = $(".selected-ingredient-btn").map(function() {
            return $(this).data('ingredient');
          }).get();
          selectedIngredientsContainer.empty(); // Clear the existing buttons

          selectedIngredients.forEach((ingredient) => {
            const selectedIngredientHTML = `<button class="selected-ingredient-btn" data-ingredient="${ingredient}">${ingredient}</button>`;
            selectedIngredientsContainer.append(selectedIngredientHTML);
          });

          // Check if the selected ingredients container is empty, and add/remove the "empty" class
          if (selectedIngredients.length === 0) {
            selectedIngredientsContainer.addClass('empty');
          } else {
            selectedIngredientsContainer.removeClass('empty');
          }
        }

        // Function to scroll to the rightmost position of the selected ingredients container
        function scrollToRightmost() {
          const selectedIngredientsContainer = $("#selected-ingredients");
          selectedIngredientsContainer.scrollLeft(selectedIngredientsContainer[0].scrollWidth);
        }

        // Event listener for clicking on an ingredient button
        $(document).on("click", ".ingredient-choice-btn", function() {
          const selectedIngredient = $(this).text();
          const selectedIngredientsContainer = $("#selected-ingredients");
          const selectedIngredients = $(".selected-ingredient-btn").map(function() {
            return $(this).data('ingredient');
          }).get();
          if (!selectedIngredients.includes(selectedIngredient)) {
            const selectedIngredientHTML = `<button class="selected-ingredient-btn" data-ingredient="${selectedIngredient}">${selectedIngredient}</button>`;
            selectedIngredientsContainer.append(selectedIngredientHTML);
            $(this).hide(); // Hide the selected ingredient from the suggestion list
          }
          updateSelectedIngredients();
          scrollToRightmost(); // Scroll to the rightmost position after adding a new ingredient
        });

        // Event listener for clicking on a selected ingredient button (to remove it)
        $(document).on("click", ".selected-ingredient-btn", function() {
          const ingredientToRemove = $(this).data('ingredient');
          // const selectedIngredientsContainer = $("#selected-ingredients");
          const selectedIngredients = $(".selected-ingredient-btn").map(function() {
            return $(this).data('ingredient');
          }).get();
          if (selectedIngredients.includes(ingredientToRemove)) {
            $(this).remove(); // Remove the selected ingredient button

            // Show the removed ingredient back in the suggestion list
            const suggestionButtonHTML = `<button class="ingredient-choice-btn" data-ingredient="${ingredientToRemove}">${ingredientToRemove}</button>`;
            $("#ingredient-choices").append(suggestionButtonHTML);
          }
          updateSelectedIngredients();
          scrollToRightmost(); // Scroll to the rightmost position after adding/removing an ingredient
        });
        
      }
      
    });
});
