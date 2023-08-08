// Get the meal ID from the URL parameter
const urlParams = new URLSearchParams(window.location.search);
const mealId = urlParams.get('id');

// Fetch meal details using the meal ID
fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data => {
        const meal = data.meals[0];
        displayMealDetails(meal);
    });

// Function to display meal details (including ingredients)
function displayMealDetails(meal) {
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;

    // Get the list of ingredients and their measurements
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    // Display the list of ingredients
    html += '<div class="recipe-ingredients">';
    html += '<h3>Ingredients:</h3>';
    html += '<ul class="meal-ingredients-list">';
    ingredients.forEach(ingredient => {
        html += `<li>${ingredient}</li>`;
    });
    html += '</ul>';
    html += '</div>';
    
    html += `
        <div class="recipe-instruct">
        <h3>Instructions:</h3>
        ${formatInstructionsAsList(meal.strInstructions)}
        </div>`;

    document.querySelector('.meal-details-content').innerHTML = html;
}

// Helper function to format the instructions as a list
function formatInstructionsAsList(instructions) {
    // Split the instructions by periods (.)
    const sentences = instructions.split('.');

    // Remove empty sentences
    const filteredSentences = sentences.filter(sentence => sentence.trim() !== '');

    // Create an ordered list (you can use unordered list by changing 'ol' to 'ul' if needed)
    let formattedInstructions = '<ol class="instructions-list">';

    filteredSentences.forEach(sentence => {
        formattedInstructions += `<li>${sentence.trim()}.</li>`;
    });

    formattedInstructions += '</ol>';

    return formattedInstructions;
}