/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */

import MealsPage from "./mealsPage.js";

const navButton = document.querySelectorAll("nav ul li");
const header = [
  `<h1 class="text-2xl font-bold text-gray-900">
                  Meals & Recipes
                </h1>
                <p class="text-sm text-gray-500 mt-1">
                  Discover delicious and nutritious recipes tailored for you
                </p>`,
  `<h1 class="text-2xl font-bold text-gray-900">
                  Product Scanner
                </h1>
                <p class="text-sm text-gray-500 mt-1">
                  Search packaged foods by name or barcode
                </p>`,
  `<h1 class="text-2xl font-bold text-gray-900">
                  Food Log
                </h1>
                <p class="text-sm text-gray-500 mt-1">
                  Track your daily nutrition and food intake
                </p>`,
  `<h1 class="text-2xl font-bold text-gray-900">
                  Recipe Details
                </h1>
                <p class="text-sm text-gray-500 mt-1">
                  View full recipe information and nutrition facts
                </p>`,
];
const headerDetail = document.querySelector(".headerDetail");

function unDisplayAll() {
  const sections = document.querySelectorAll("section");
  for (let i = 0; i < sections.length; i++) {
    sections[i].classList.add("hidden");
  }
}

navButton[0].addEventListener("click", function (e) {
  unDisplayAll();
  headerDetail.innerHTML = header[0];
  const search = document.querySelector("#search-filters-section");
  const mealCategory = document.querySelector("#meal-categories-section");
  const allRecipes = document.querySelector("#all-recipes-section");
  search.classList.remove("hidden");
  mealCategory.classList.remove("hidden");
  allRecipes.classList.remove("hidden");
});

navButton[1].addEventListener("click", function (e) {
  unDisplayAll();
  headerDetail.innerHTML = header[1];
  const productSection = document.querySelector("#products-section");
  productSection.classList.remove("hidden");
  mealsPage.getProductsBySearch();
});
navButton[2].addEventListener("click", function (e) {
  unDisplayAll();
  headerDetail.innerHTML = header[2];
  const foodLog = document.querySelector("#foodlog-section");
  foodLog.classList.remove("hidden");
  mealsPage.displayFoodLog();
  mealsPage.setDateDetails();
});

let searchInput = document.querySelector("#search-input");
searchInput.addEventListener("input", (e) => {
  let value = searchInput.value;
  mealsPage.getMealsBySearch(value);
});

let mealsPage = new MealsPage();
mealsPage.displayAll();

// const randomMeals =
//   "https://nutriplan-api.vercel.app/api/meals/random?count=25";

// async function getApi(api, callback) {
//   try {
//     const loading = document.querySelector("#app-loading-overlay");
//     loading.classList.remove("loading");
//     let response = await fetch(api);
//     let data = await response.json();
//     loading.classList.add("loading");
//     // console.log(data.results);
//     callback(data.results);
//   } catch (err) {
//     console.log(err);
//   }
// }

// function display(arr) {
//   const mealsGrid = document.querySelector("#recipes-grid");

//   let htmlValue = ``;
//   for (let i = 0; i < arr.length; i++) {
//     htmlValue += `<div
//     class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
//     data-meal-id="${arr[i].id}">
//     <div class="relative h-48 overflow-hidden">
//     <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//     src="${arr[i].thumbnail}" alt="Teriyaki Chicken Casserole"
//     loading="lazy" />
//     <div class="absolute bottom-3 left-3 flex gap-2">
//     <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
//     ${arr[i].category}
//     </span>
//     <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">
//     ${arr[i].area}
//     </span>
//     </div>
//     </div>
//     <div class="p-4">
//     <h3
//     class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
//     ${arr[i].name}
//     </h3>
//     <p class="text-xs text-gray-600 mb-3 line-clamp-2">
//     ${arr[i].instructions}
//     </p>
//     <div class="flex items-center justify-between text-xs">
//     <span class="font-semibold text-gray-900">
//     <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
//     ${arr[i].category}
//     </span>
//     <span class="font-semibold text-gray-500">
//     <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
//     ${arr[i].area}
//     </span>
//     </div>
//               </div>
//               </div>`;
//   }
//   mealsGrid.innerHTML = htmlValue;

//   const cards = document.querySelectorAll("#recipes-grid .recipe-card");
//   const mealDetails = document.querySelector("#meal-details");
//   const gridIngredients = document.querySelector("#gridIngredients");
//   for (let i = 0; i < cards.length; i++) {
//     cards[i].addEventListener("click", function (e) {
//       try {
//         unDisplayAll();
//         headerDetail.innerHTML = header[3];
//         mealDetails.classList.remove("hidden");
//         let idMeal = this.getAttribute("data-meal-id");
//         const foundUser = arr.find((user) => user.id === idMeal);
//         let ingredients = foundUser.ingredients;
//         let instructions = foundUser.instructions;
//         let ingredientsConcatenated = ingredients.map(
//           (e) => `${e.measure} ${e.ingredient}`,
//         );
//         console.log(ingredientsConcatenated);

//         let htmlValueDetailsMeal = "";
//         for (let i = 0; i < ingredients.length; i++) {
//           htmlValueDetailsMeal += `<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
//                   <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
//                   <span class="text-gray-700">
//                     <span class="font-medium text-gray-900">${ingredients[i].measure}</span>
//                     ${ingredients[i].ingredient}
//                   </span>
//                 </div>`;
//         }
//         gridIngredients.innerHTML = htmlValueDetailsMeal;

//         const instructionsElement = document.querySelector("#instructions");
//         let htmlValueInstructions = "";
//         for (let i = 0; i < instructions.length; i++) {
//           htmlValueInstructions += `<div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
//                   <div
//                     class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
//                     ${i + 1}
//                   </div>
//                   <p class="text-gray-700 leading-relaxed pt-2">
//                     ${instructions[i]}
//                   </p>
//                 </div>`;
//         }
//         instructionsElement.innerHTML = htmlValueInstructions;
//         async function wait() {
//           let buttonLog = document.querySelector("#log-meal-btn");
//           let spanLoading = document.querySelector("#log-meal-btn span");
//           let iconLoading = document.querySelector("#loading");
//           let iconDone = document.querySelector("#done");
//           buttonLog.classList.remove("hover:bg-blue-700", "g-blue-600");
//           buttonLog.classList.add("bg-gray-300");
//           iconDone.classList.add("hidden");
//           iconLoading.classList.remove("hidden");
//           spanLoading.innerHTML = "Calculating...";
//           const callApiAnalyses = await getApiAnalyses(idMeal, ingredients);
//           buttonLog.classList.add("hover:bg-blue-700", "bg-blue-600");
//           buttonLog.classList.remove("bg-gray-300");
//           iconDone.classList.remove("hidden");
//           iconLoading.classList.add("hidden");
//           spanLoading.innerHTML = "Log This Meal";
//         }
//         wait();
//         let htmlValueDetails = "";

//         console.log(ingredients);

//         console.log("hello");
//       } catch {}
//     });
//   }
// }

// getApi(randomMeals, display);
