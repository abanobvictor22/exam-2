import Meal from "./meal.js";
import Category from "./category.js";
import FoodLog from "./foodLog.js";
import Product from "./product.js";
export default class MealsPage {
  allAreas = [];
  allCategories = [];
  allMeals = [];

  constructor() {}
  async displayAll() {
    this.allCategories = await this.getCategories();
    this.allAreas = await this.getAreas();
    this.allMeals = await this.getRandomMeals(25);

    this.displayCategories(this.allCategories);
    this.displayMeals(this.allMeals);
    this.displayAreas(this.allAreas);
  }
  unDisplayAll() {
    const sections = document.querySelectorAll("section");
    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.add("hidden");
    }
  }
  async getRandomMeals(count) {
    try {
      const loading = document.querySelector("#app-loading-overlay");
      loading.classList.remove("loading");
      let response = await fetch(
        this.getBaseURL() + `meals/random?count=${count}`,
      );
      let data = await response.json();
      let meals = await data.results;
      loading.classList.add("loading");

      return meals.map(
        (meal) =>
          new Meal(
            meal.id,
            meal.name,
            meal.category,
            meal.area,
            meal.instructions,
            meal.thumbnail,
            meal.tags,
            meal.youtube,
            meal.ingredients,
          ),
      );
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async getMealsByFilter(param) {
    try {
      const loading = document.querySelector("#app-loading-overlay");
      loading.classList.remove("loading");
      let response = await fetch(this.getBaseURL() + param);
      let data = await response.json();
      let meals = data.results;
      loading.classList.add("loading");
      console.log(response);

      this.allMeals = meals.map(
        (meal) =>
          new Meal(
            meal.id,
            meal.name,
            meal.category,
            meal.area,
            meal.instructions,
            meal.thumbnail,
            meal.tags,
            meal.youtube,
            meal.ingredients,
          ),
      );
      console.log(this.allMeals);

      this.displayMeals(this.allMeals);
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  getBaseURL() {
    return `https://nutriplan-api.vercel.app/api/`;
  }

  async getCategories() {
    try {
      let response = await fetch(this.getBaseURL() + "meals/categories");
      let data = await response.json();
      return data.results.map(
        (category) =>
          new Category(category.id, category.name, category.thumbnail),
      );
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  displayAreas(arr) {
    const allAreas = document.querySelector("#allAreas");
    let htmlValue = `<button
            class="px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all">
            All Recipes
          </button>`;
    for (let i = 0; i < arr.length; i++) {
      htmlValue += `<button
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all">
            ${arr[i]}
          </button>`;
    }
    allAreas.innerHTML = htmlValue;
    let buttonsAreas = document.querySelectorAll("#allAreas button");
    for (let i = 1; i < buttonsAreas.length; i++) {
      buttonsAreas[i].addEventListener("click", (e) => {
        let area = e.target.textContent.trim();
        let apiLink = `meals/filter?area=${area}&page=1&limit=25`;
        this.getMealsByFilter(apiLink);
        console.log(apiLink);
      });
    }
    buttonsAreas[0].addEventListener("click", (e) => {
      let apiLink = `meals/random?count=25`;
      this.getMealsByFilter(apiLink);
    });
  }

  async getMealsBySearch(value) {
    const apiSearch = `https://nutriplan-api.vercel.app/api/meals/search?q=${value}&page=1&limit=25`;
    let response = await fetch(apiSearch);
    let data = await response.json();
    let meals = data.results;
    this.allMeals = meals.map(
      (meal) =>
        new Meal(
          meal.id,
          meal.name,
          meal.category,
          meal.area,
          meal.instructions,
          meal.thumbnail,
          meal.tags,
          meal.youtube,
          meal.ingredients,
        ),
    );
    console.log(this.allMeals);
    this.displayMeals(this.allMeals);
  }

  displayCategories(arr) {
    const allAreas = document.querySelector("#categories-grid");
    let htmlValue = ``;
    for (let i = 0; i < arr.length; i++) {
      htmlValue += `<div id="card"
            class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
            data-category="Beef">
            <div class="flex items-center gap-2.5">
              <div
                class="text-white w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <img src='${arr[i].thumbnail}'/>
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-900">${arr[i].name}</h3>
              </div>
            </div>
          </div>`;
    }
    allAreas.innerHTML = htmlValue;
    let cardCategory = document.querySelectorAll("#card");
    for (let i = 0; i < cardCategory.length; i++) {
      cardCategory[i].addEventListener("click", (e) => {
        let category = e.target.textContent.trim();
        let apiLink = `meals/filter?category=${category}&page=1&limit=25`;
        this.getMealsByFilter(apiLink);
      });
    }
  }

  displayMeals(arr) {
    let countHtml = document.querySelector("#recipes-count");
    let countValue = `Showing ${arr.length} recipes`;
    countHtml.innerHTML = countValue;
    const mealsGrid = document.querySelector("#recipes-grid");
    let htmlValue = ``;
    for (let i = 0; i < arr.length; i++) {
      htmlValue += `<div
    class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
    data-meal-id="${arr[i].id}">
    <div class="relative h-48 overflow-hidden">
    <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    src="${arr[i].thumbnail}" alt="Teriyaki Chicken Casserole"
    loading="lazy" />
    <div class="absolute bottom-3 left-3 flex gap-2">
    <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
    ${arr[i].category}
    </span>
    <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">
    ${arr[i].area}
    </span>
    </div>
    </div>
    <div class="p-4">
    <h3
    class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
    ${arr[i].name}
    </h3>
    <p class="text-xs text-gray-600 mb-3 line-clamp-2">
    ${arr[i].instructions}
    </p>
    <div class="flex items-center justify-between text-xs">
    <span class="font-semibold text-gray-900">
    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
    ${arr[i].category}
    </span>
    <span class="font-semibold text-gray-500">
    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
    ${arr[i].area}
    </span>
    </div>
              </div>
              </div>`;
    }
    mealsGrid.innerHTML = htmlValue;
    this.displayDetailsMeal();
  }

  async getAreas() {
    try {
      let response = await fetch(this.getBaseURL() + "meals/areas");
      let data = await response.json();
      return data.results.map((area) => area.name);
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  displayDetailsMeal() {
    const headerDetail = document.querySelector(".headerDetail");
    const headerData = `<h1 class="text-2xl font-bold text-gray-900">
                  Recipe Details
                </h1>
                <p class="text-sm text-gray-500 mt-1">
                  View full recipe information and nutrition facts
                </p>`;
    const cards = document.querySelectorAll("#recipes-grid .recipe-card");
    const mealDetails = document.querySelector("#meal-details");
    const gridIngredients = document.querySelector("#gridIngredients");
    for (let i = 0; i < cards.length; i++) {
      cards[i].addEventListener("click", (e) => {
        try {
          this.unDisplayAll();
          headerDetail.innerHTML = headerData;
          mealDetails.classList.remove("hidden");
          let idMeal = e.currentTarget.getAttribute("data-meal-id");
          const meal = this.allMeals.find((meal) => meal.id === idMeal);
          let ingredients = meal.ingredients;
          let instructions = meal.instructions;
          let img = document.querySelector("#img img");
          let youtube = document.querySelector("iframe");
          let changeUrl = meal.youtube;
          let newUrl = changeUrl.replace("watch?v=", "embed/");
          console.log(newUrl);

          img.setAttribute("src", meal.thumbnail);
          youtube.setAttribute("src", newUrl);
          let mealSummary = document.querySelector("#mealSummary");
          let mealSummaryHtml = `<div class="flex items-center gap-3 mb-3">
                <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.category}</span>
                <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.area}</span>
            
              </div>
              <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                ${meal.name}
              </h1>
              <div class="flex items-center gap-6 text-white/90">
                <span class="flex items-center gap-2">
                  <i class="fa-solid fa-clock"></i>
                  <span>30 min</span>
                </span>
                <span class="flex items-center gap-2">
                  <i class="fa-solid fa-utensils"></i>
                  <span id="hero-servings">4 servings</span>
                </span>
                <span  class="flex items-center gap-2">
                  <i class="fa-solid fa-fire"></i>
                  <span id="hero-calories">loading.....</span>
                </span>
              </div>`;
          mealSummary.innerHTML = mealSummaryHtml;
          let htmlValueDetailsMeal = "";
          for (let i = 0; i < ingredients.length; i++) {
            htmlValueDetailsMeal += `<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                  <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
                  <span class="text-gray-700">
                    <span class="font-medium text-gray-900">${ingredients[i].measure}</span>
                    ${ingredients[i].ingredient}
                  </span>
                </div>`;
          }
          gridIngredients.innerHTML = htmlValueDetailsMeal;

          const instructionsElement = document.querySelector("#instructions");
          let htmlValueInstructions = "";
          for (let i = 0; i < instructions.length; i++) {
            htmlValueInstructions += `<div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                    ${i + 1}
                  </div>
                  <p class="text-gray-700 leading-relaxed pt-2">
                    ${instructions[i]}
                  </p>
                </div>`;
          }
          console.log("nutritionFacts.calories");
          instructionsElement.innerHTML = htmlValueInstructions;
          let checkBtn = document.getElementById("log-meal-btn")?.remove();
          async function wait() {
            const createBtnLog = document.createElement("button");
            createBtnLog.id = "log-meal-btn";
            createBtnLog.classList =
              "flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all";
            createBtnLog.innerHTML = `<i class="fa-solid fa-spinner fa-spin" id="loading"></i>
            <i class="fa-solid fa-clipboard-list" id="done"></i>
            <span>Log This Meal</span>`;
            const divBtn = document.getElementById("log");
            divBtn.appendChild(createBtnLog);
            let buttonLog = document.querySelector("#log-meal-btn");
            let spanLoading = document.querySelector("#log-meal-btn span");
            let iconLoading = document.querySelector("#loading");
            let iconDone = document.querySelector("#done");
            buttonLog.classList.remove("hover:bg-blue-700", "g-blue-600");
            buttonLog.classList.add("bg-gray-300");
            iconDone.classList.add("hidden");
            iconLoading.classList.remove("hidden");
            spanLoading.innerHTML = "Calculating...";
            let nutritionContainer = document.querySelector(
              "#nutrition-facts-container",
            );
            let loadingNutritionHtml = `<div class="text-center py-8">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
                    <i class="animate-pulse text-emerald-600 text-xl" data-fa-i2svg=""><svg class="svg-inline--fa fa-calculator" data-prefix="fas" data-icon="calculator" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM96 64l192 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32zm16 168a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zm80 24a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm128-24a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zM88 352a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm128-24a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zm80 24a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM64 424c0-13.3 10.7-24 24-24l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L88 448c-13.3 0-24-10.7-24-24zm232-24c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24z"></path></svg></i>
                </div>
                <p class="text-gray-700 font-medium mb-1">Calculating Nutrition</p>
                <p class="text-sm text-gray-500">Analyzing ingredients...</p>
                <div class="mt-4 flex justify-center">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                    </div>
                </div>
            </div>`;
            nutritionContainer.innerHTML = loadingNutritionHtml;
            console.log("-----------1");

            const nutritionFacts = await meal.getAnalysis();
            console.log("-----------2");

            buttonLog.classList.add("hover:bg-blue-700", "bg-blue-600");
            buttonLog.classList.remove("bg-gray-300");
            iconDone.classList.remove("hidden");
            iconLoading.classList.add("hidden");
            spanLoading.innerHTML = "Log This Meal";
            buttonLog.addEventListener("click", (e) => {
              const mealName = meal.name;
              const mealImg = meal.thumbnail;
              const caloriesPerServing = Number(nutritionFacts.calories) || 0;
              const proteinPerServing = Number(nutritionFacts.protein) || 0;
              const carbsPerServing = Number(nutritionFacts.carbs) || 0;
              const fatPerServing = Number(nutritionFacts.fat) || 0;

              Swal.fire({
                html: `
    <div class="flex items-center gap-4 mb-6 text-left">
        <img src="${mealImg}" alt="${mealName}" class="w-16 h-16 rounded-xl object-cover">
        <div>
            <h3 class="text-xl font-bold text-gray-900">Log This Meal</h3>
            <p class="text-gray-500 text-sm">${mealName}</p>
        </div>
    </div>
    
    <div class="mb-6 text-left">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Number of Servings</label>
        <div class="flex items-center gap-3">
            <button id="decrease-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <i class="fa-solid fa-minus text-gray-600"></i>
            </button>
            <input type="number" id="meal-servings" value="1" min="0.5" max="10" step="0.5" readonly class="w-20 text-center text-xl font-bold border-2 border-gray-200 rounded-lg py-2">
            <button id="increase-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <i class="fa-solid fa-plus text-gray-600"></i>
            </button>
        </div>
    </div>
    
    <div class="bg-emerald-50 rounded-xl p-4 text-left mb-6">
        <p class="text-sm text-gray-600 mb-2">Estimated nutrition for selected servings:</p>
        <div class="grid grid-cols-4 gap-2 text-center">
            <div>
                <p class="text-lg font-bold text-emerald-600" id="modal-calories">${caloriesPerServing}</p>
                <p class="text-xs text-gray-500">Calories</p>
            </div>
            <div>
                <p class="text-lg font-bold text-blue-600" id="modal-protein">${proteinPerServing}g</p>
                <p class="text-xs text-gray-500">Protein</p>
            </div>
            <div>
                <p class="text-lg font-bold text-amber-600" id="modal-carbs">${carbsPerServing}g</p>
                <p class="text-xs text-gray-500">Carbs</p>
            </div>
            <div>
                <p class="text-lg font-bold text-purple-600" id="modal-fat">${fatPerServing}g</p>
                <p class="text-xs text-gray-500">Fat</p>
            </div>
        </div>
    </div>

    <div class="flex gap-3 w-full">
        <button id="my-custom-cancel-btn" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-center">
            Cancel
        </button>
        <button id="my-custom-log-btn" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all text-center">
            <i class="fa-solid fa-clipboard-list mr-2"></i> Log Meal
        </button>
    </div>
  `,

                showConfirmButton: false,
                showCancelButton: false,

                customClass: {
                  popup:
                    "rounded-2xl p-6 max-w-md w-full mx-4 bg-white shadow-xl",
                },

                didOpen: () => {
                  const btnLogMeal =
                    document.getElementById("my-custom-log-btn");

                  btnLogMeal.addEventListener("click", () => {
                    const inputServings =
                      document.getElementById("meal-servings");
                    const currentServings = inputServings
                      ? parseFloat(inputServings.value)
                      : 1;
                  });

                  const btnCancel = document.getElementById(
                    "my-custom-cancel-btn",
                  );
                  btnCancel.addEventListener("click", () => {
                    Swal.close();
                  });

                  const btnDecrease =
                    document.getElementById("decrease-servings");
                  const btnIncrease =
                    document.getElementById("increase-servings");
                  const inputServings =
                    document.getElementById("meal-servings");

                  const txtCalories = document.getElementById("modal-calories");
                  const txtProtein = document.getElementById("modal-protein");
                  const txtCarbs = document.getElementById("modal-carbs");
                  const txtFat = document.getElementById("modal-fat");

                  const updateNutrition = (servings) => {
                    txtCalories.textContent = Math.round(
                      caloriesPerServing * servings,
                    );
                    txtProtein.textContent = `${Math.round(proteinPerServing * servings)}g`;
                    txtCarbs.textContent = `${Math.round(carbsPerServing * servings)}g`;
                    txtFat.textContent = `${Math.round(fatPerServing * servings)}g`;
                  };
                  btnLogMeal.addEventListener("click", (e) => {
                    const time = new Date().toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    });
                    const servings = inputServings.value;
                    const date = new Date().toLocaleDateString("en-CA");
                    meal.time = time;
                    meal.servings = servings;
                    let meals = [];
                    meals.push(meal);
                    const totalCalories = Math.round(
                      caloriesPerServing * inputServings.value,
                    );
                    const totalCarbs = Math.round(
                      carbsPerServing * inputServings.value,
                    );
                    const totalFat = Math.round(
                      fatPerServing * inputServings.value,
                    );
                    const totalProtein = Math.round(
                      proteinPerServing * inputServings.value,
                    );

                    let newLog = new FoodLog(
                      meals,
                      totalCalories,
                      totalCarbs,
                      totalFat,
                      totalProtein,
                    );
                    let saveLog = JSON.parse(localStorage.getItem(date));
                    if (!saveLog) {
                      saveLog = {
                        meals: [...newLog.meals],
                        totalCalories: newLog.totalCalories,
                        totalCarbs: newLog.totalCarbs,
                        totalFat: newLog.totalFat,
                        totalProtein: newLog.totalProtein,
                      };
                    } else {
                      saveLog.meals.push(...newLog.meals);
                      saveLog = {
                        meals: saveLog.meals,
                        totalCalories:
                          saveLog.totalCalories + newLog.totalCalories,
                        totalCarbs: saveLog.totalCarbs + newLog.totalCarbs,
                        totalFat: saveLog.totalFat + newLog.totalFat,
                        totalProtein:
                          saveLog.totalProtein + newLog.totalProtein,
                      };
                    }
                    localStorage.setItem(date, JSON.stringify(saveLog));
                    Swal.close();
                    let timerInterval;
                    Swal.fire({
                      title: "Meal Logged!",
                      icon: "success",
                      html: `<p>${newLog.meals[0].name}(${inputServings.value}) has been to your daily log</p>
                      <span>+${totalCalories}</span>`,
                      timer: 2000,
                      timerProgressBar: true,
                      didOpen: () => {
                        const timer = Swal.getPopup().querySelector("b");
                        timerInterval = setInterval(() => {
                          if (timer) {
                            timer.textContent = `${Swal.getTimerLeft()}`;
                          }
                        }, 100);
                      },
                      willClose: () => {
                        clearInterval(timerInterval);
                      },
                    }).then((result) => {
                      /* Read more about handling dismissals below */
                      if (result.dismiss === Swal.DismissReason.timer)
                        console.log("I was closed by the timer");
                    });
                  });
                  btnDecrease.addEventListener("click", () => {
                    let val = parseFloat(inputServings.value);
                    if (val > 0.5) {
                      val -= 0.5;
                      inputServings.value = val;
                      updateNutrition(val);
                    }
                  });

                  btnIncrease.addEventListener("click", () => {
                    let val = parseFloat(inputServings.value);
                    if (val < 10) {
                      val += 0.5;
                      inputServings.value = val;
                      updateNutrition(val);
                    }
                  });
                },
              });
            });
            console.log(meal.servings);
            let heroCalories = document.querySelector("#hero-calories");
            heroCalories.innerHTML = `${nutritionFacts.calories} cal`;
            let htmlValueNutrition = `<p class="text-sm text-gray-500 mb-4">Per serving</p>
                <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
                  <p class="text-sm text-gray-600">Calories per serving</p>
                  <p class="text-4xl font-bold text-emerald-600">${nutritionFacts.calories}</p>
                  <p class="text-xs text-gray-500 mt-1">Total: ${Number(nutritionFacts.calories) * 4} cal</p>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span class="text-gray-700">Protein</span>
                    </div>
                    <span class="font-bold text-gray-900">${nutritionFacts.protein} g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-emerald-500 h-2 rounded-full" style="width: ${(nutritionFacts.protein / 50) * 100 > 100 ? 100 : (nutritionFacts.protein / 50) * 100}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span class="text-gray-700">Carbs</span>
                    </div>
                    <span class="font-bold text-gray-900">${nutritionFacts.carbs}g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: ${(nutritionFacts.carbs / 250) * 100 > 100 ? 100 : (nutritionFacts.carbs / 250) * 100}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span class="text-gray-700">Fat</span>
                    </div>
                    <span class="font-bold text-gray-900">${nutritionFacts.fat}g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-purple-500 h-2 rounded-full" style="width: ${(nutritionFacts.fat / 65) * 100 > 100 ? 100 : (nutritionFacts.fat / 65) * 100}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span class="text-gray-700">Fiber</span>
                    </div>
                    <span class="font-bold text-gray-900">${nutritionFacts.fiber}g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-orange-500 h-2 rounded-full" style="width: ${(nutritionFacts.fiber / 25) * 100 > 100 ? 100 : (nutritionFacts.fiber / 25) * 100}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span class="text-gray-700">Sugar</span>
                    </div>
                    <span class="font-bold text-gray-900">${nutritionFacts.sugar}g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-pink-500 h-2 rounded-full" style="width: ${(nutritionFacts.sugar / 50) * 100 > 100 ? 100 : (nutritionFacts.sugar / 50) * 100}%"></div>
                  </div>
                </div>

                <div class="mt-6 pt-6 border-t border-gray-100">
                  <h3 class="text-sm font-semibold text-gray-900 mb-3">
                    Vitamins & Minerals (% Daily Value)
                  </h3>
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Vitamin A</span>
                      <span class="font-medium">15%</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Vitamin C</span>
                      <span class="font-medium">25%</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Calcium</span>
                      <span class="font-medium">4%</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Iron</span>
                      <span class="font-medium">12%</span>
                    </div>
                  </div>
                </div>`;
            nutritionContainer.innerHTML = htmlValueNutrition;
          }

          wait();
          console.log("-------------------");

          console.log("hello");
        } catch {}
      });
    }
  }

  displayFoodLog() {
    let foodLogDate = document.querySelector("#foodlog-date");
    foodLogDate.innerHTML = `${new Date().toDateString().replace(" ", ", ").split(" ").slice(0, 3).join(" ")}`;
    const date = new Date().toLocaleDateString("en-CA");
    const getData = JSON.parse(localStorage.getItem(date)) || {
      meals: [],
      totalCalories: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalProtein: 0,
    };
    function getProgress() {
      let htmlValue = "";
      let ProgressBars = document.querySelector("#ProgressBars");
      htmlValue = ` <!-- Calories Progress -->
            <div class="bg-emerald-50 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-gray-700">Calories</span>
                <span class="text-sm text-gray-500">${getData.totalCalories || 0} / 2000 kcal</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-${((getData.totalCalories || 0) / 2000) * 100 >= 100 ? "red" : "emerald"}-500 h-2.5 rounded-full" style="width: ${((getData.totalCalories || 0) / 2000) * 100 > 100 ? 100 : ((getData.totalCalories || 0) / 2000) * 100}%"></div>

              </div>
            </div>
            <!-- Protein Progress -->
            <div class="bg-blue-50 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-gray-700">Protein</span>
                <span class="text-sm text-gray-500">${getData.totalProtein || 0} / 50 g</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-${((getData.totalProtein || 0) / 50) * 100 >= 100 ? "red" : "blue"}-500 h-2.5 rounded-full" style="width: ${((getData.totalProtein || 0) / 50) * 100 > 100 ? 100 : ((getData.totalProtein || 0) / 50) * 100}%"></div>
              </div>
            </div>
            <!-- Carbs Progress -->
            <div class="bg-amber-50 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-gray-700">Carbs</span>
                <span class="text-sm text-gray-500">${getData.totalCarbs || 0} / 250 g</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-${((getData.totalCarbs || 0) / 250) * 100 >= 100 ? "red" : "amber"}-500 h-2.5 rounded-full" style="width: ${((getData.totalCarbs || 0) / 250) * 100 > 100 ? 100 : ((getData.totalCarbs || 0) / 250) * 100}%"></div>
              </div>
            </div>
            <!-- Fat Progress -->
            <div class="bg-purple-50 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-gray-700">Fat</span>
                <span class="text-sm text-gray-500">${getData.totalFat || 0} / 65 g</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-${((getData.totalFat || 0) / 65) * 100 >= 100 ? "red" : "purple"}-500 h-2.5 rounded-full" style="width: ${((getData.totalFat || 0) / 65) * 100 > 100 ? 100 : ((getData.totalFat || 0) / 65) * 100}%"></div>
              </div>
            </div>`;
      ProgressBars.innerHTML = htmlValue;
    }
    getProgress();
    const foodLogSection = document.querySelector("#foodlog-today-section");
    const mealsSaved = getData.meals || [];
    const oldItems = foodLogSection.querySelectorAll(".foodlog-item");
    oldItems.forEach((item) => item.remove());
    if (
      getData.meals.length > 0 &&
      document.querySelector("#logged-items-list")
    ) {
      document.querySelector("#logged-items-list")?.remove();
    }
    for (let i = 0; i < mealsSaved.length; i++) {
      const mealDiv = document.createElement("div");
      mealDiv.className =
        "foodlog-item flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all";
      mealDiv.innerHTML = `
      <div class="flex items-center gap-4">
      <img src="${mealsSaved[i]?.thumbnail || mealsSaved[i]?.image}" alt="Chicken Mandi" class="w-14 h-14 rounded-xl object-cover">
      <div>
      <p class="font-semibold text-gray-900">${mealsSaved[i].name}</p>
      <p class="text-sm text-gray-500">
      1 serving
      <span class="mx-1">•</span>
      <span class="text-emerald-600">Recipe</span>
      </p>
                                <p class="text-xs text-gray-400 mt-1">5:22 PM</p>
                                </div>
                                </div>
                                <div class="flex items-center gap-4">
                                <div class="text-right">
                                <p class="text-lg font-bold text-emerald-600">${mealsSaved[i].nutrition?.calories || mealsSaved[i].nutrients?.calories || 0}</p>
                                <p class="text-xs text-gray-500">kcal</p>
                                </div>
                                <div class="hidden md:flex gap-2 text-xs text-gray-500">
                                <span class="px-2 py-1 bg-blue-50 rounded">${mealsSaved[i].nutrition?.protein || mealsSaved[i].nutrients?.protein || 0}g P</span>
                                <span class="px-2 py-1 bg-amber-50 rounded">${mealsSaved[i].nutrition?.carbs || mealsSaved[i].nutrients?.carbs || 0}g C</span>
                                <span class="px-2 py-1 bg-purple-50 rounded">${mealsSaved[i].nutrition?.fat || mealsSaved[i].nutrients?.fat || 0}g F</span>
                            </div>
                            <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${i}">
                                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash-can" data-prefix="fas" data-icon="trash-can" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"></path></svg></i>
                            </button>
                            </div>
                    `;
      foodLogSection.appendChild(mealDiv);
    }
    if (
      getData.meals.length == 0 &&
      !document.querySelector("#logged-items-list")
    ) {
      let emptyMeals = document.createElement("div");
      emptyMeals.classList = "space-y-2";
      emptyMeals.id = "logged-items-list";
      emptyMeals.innerHTML = `
              <div class="text-center py-8 text-gray-500">
                <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
                <p class="font-medium">No meals logged today</p>
                <p class="text-sm">
                  Add meals from the Meals page or scan products
                </p>
              </div>
            `;
      foodLogSection.appendChild(emptyMeals);
    }
    const deleteItem = document.querySelectorAll(".remove-foodlog-item");
    for (let i = 0; i < deleteItem.length; i++) {
      deleteItem[i].addEventListener("click", (e) => {
        const indexMealView = e.currentTarget.getAttribute("data-index");
        const currentMeal = getData.meals[indexMealView];
        const servings = currentMeal?.servings || 1;
        const caloriesToSubtract =
          (currentMeal.nutrition?.calories ||
            currentMeal.nutrients?.calories ||
            0) * servings || 1;
        const carbsToSubtract =
          (currentMeal.nutrition?.carbs || currentMeal.nutrients?.carbs || 0) *
            servings || 1;
        const fatToSubtract =
          (currentMeal.nutrition?.fat || currentMeal.nutrients?.fat || 0) *
            servings || 1;
        const proteinToSubtract =
          (currentMeal.nutrition?.protein ||
            currentMeal.nutrients?.protein ||
            0) * servings || 1; // تم تعديل الغلطة هنا

        // 3. اعمل الطرح، وقفل بـ toFixed(1) عشان الكسـور، ومعاها Math.max عشان مفيش رقم ينزل تحت الصفر
        getData.totalCalories = Math.max(
          0,
          parseFloat((getData.totalCalories - caloriesToSubtract).toFixed(1)),
        );
        getData.totalCarbs = Math.max(
          0,
          parseFloat((getData.totalCarbs - carbsToSubtract).toFixed(1)),
        );
        getData.totalFat = Math.max(
          0,
          parseFloat((getData.totalFat - fatToSubtract).toFixed(1)),
        );
        getData.totalProtein = Math.max(
          0,
          parseFloat((getData.totalProtein - proteinToSubtract).toFixed(1)),
        );
        getData.meals.splice(indexMealView, 1);
        localStorage.setItem(date, JSON.stringify(getData));
        this.displayFoodLog();
        this.setDateDetails();
      });
    }
  }

  setDateDetails() {
    const containerDates = document.querySelector("#dateDetail");
    let htmlValue = "";
    let date = new Date();
    for (let i = 0; i < 7; i++) {
      let dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      let dayNum = date.getDate();
      const saveMeals = JSON.parse(
        localStorage.getItem(date.toLocaleDateString("en-CA")),
      );
      htmlValue =
        `<div date="${date.toLocaleDateString("en-CA")}" class="${saveMeals ? "details" : "err"} text-center ">
              <p class="text-xs text-gray-500 mb-1">${dayName}</p>
              <p class="text-sm font-medium text-gray-900">${dayNum}</p>
              <div class=' mt-2 ${saveMeals?.totalCalories ? "text-emerald-600" : "text-gray-300"}'>
                <p class="text-lg font-bold">${!saveMeals?.totalCalories ? 0 : saveMeals?.totalCalories}</p>
                <p class="text-xs">kcal</p>
              </div>
            </div>` + htmlValue;
      date = new Date(date.setDate(date.getDate() - 1));
    }
    containerDates.innerHTML = htmlValue;
    if (document.querySelector(".details")) {
      const items = document.querySelectorAll(".details");
      for (let i = 0; i < items.length; i++) {
        const dateValue = items[i].getAttribute("date");
        let savedData = JSON.parse(localStorage.getItem(dateValue));
        let htmlValue = `<p class="text-xs text-gray-400 mt-1">${savedData?.meals?.length} items</p>`;
        items[i].innerHTML += htmlValue;
      }
    }
  }

  getProductsBySearch() {
    const searchProduct = document.querySelector("#product-search-input");
    const searchButton = document.querySelector("#search-product-btn");
    const lookupBtn = document.querySelector("#lookup-barcode-btn");
    const barcodeInput = document.querySelector("#barcode-input");
    searchButton.addEventListener("click", async (e) => {
      let data = await this.apiSearchProducts(
        `https://nutriplan-api.vercel.app/api/products/search?q=${searchProduct.value}&page=1&limit=24`,
      );
      let products = data.results.map((e) => {
        return new Product(
          e.barcode,
          e.name,
          e.brand,
          e.image,
          e.nutritionGrade,
          e.novaGroup,
          e.nutrients,
        );
      });
      console.log(products);
      this.displayProductsBySearch(products);
    });
    lookupBtn.addEventListener("click", async (e) => {
      let data = await this.apiSearchProducts(
        `https://nutriplan-api.vercel.app/api/products/barcode/${barcodeInput.value}`,
      );
      let o = data.result;
      let product = new Product(
        o.barcode,
        o.name,
        o.brand,
        o.image,
        o.nutritionGrade,
        o.novaGroup,
        o.nutrients,
      );
      let products = [];
      products.push(product);
      console.log(products);
      this.displayProductsBySearch(products);
    });
  }

  async apiSearchProducts(param) {
    const response = await fetch(param);
    const data = await response.json();

    return data;
  }

  displayProductsBySearch(products) {
    const productsGrid = document.querySelector("#products-grid");
    let htmlValue = "";
    for (let i = 0; i < products.length; i++) {
      htmlValue += `<div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="7613034626844">
              <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" src="${!products[i].image ? "./src/images/no image.gif" : products[i]?.image}" alt="Product Name" loading="lazy">

                <!-- Nutri-Score Badge -->
                <div class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                  ${products[i]?.nutritionGrade}
                </div>

                <!-- NOVA Badge -->
                <div class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" title="NOVA 2">
                  ${!products[i]?.novaGroup ? 0 : products[i]?.novaGroup}
                </div>
              </div>

              <div class="p-4">
                <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
                  ${products[i]?.brand}
                </p>
                <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  ${products[i]?.name}
                </h3>

                <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span><i class="mr-1" data-fa-i2svg=""><svg class="svg-inline--fa fa-weight-scale" data-prefix="fas" data-icon="weight-scale" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M116.6 192c-3-10.1-4.6-20.9-4.6-32 0-61.9 50.1-112 112-112S336 98.1 336 160c0 11.1-1.6 21.9-4.6 32l-71 0 24.6-44.3c6.4-11.6 2.3-26.2-9.3-32.6s-26.2-2.3-32.6 9.3l-37.6 67.7-88.8 0zM128 32L64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-64 0C293.3 11.9 260 0 224 0s-69.3 11.9-96 32z"></path></svg></i>250g</span>
                  <span><i class="mr-1" data-fa-i2svg=""><svg class="svg-inline--fa fa-fire" data-prefix="fas" data-icon="fire" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M160.5-26.4c9.3-7.8 23-7.5 31.9 .9 12.3 11.6 23.3 24.4 33.9 37.4 13.5 16.5 29.7 38.3 45.3 64.2 5.2-6.8 10-12.8 14.2-17.9 1.1-1.3 2.2-2.7 3.3-4.1 7.9-9.8 17.7-22.1 30.8-22.1 13.4 0 22.8 11.9 30.8 22.1 1.3 1.7 2.6 3.3 3.9 4.8 10.3 12.4 24 30.3 37.7 52.4 27.2 43.9 55.6 106.4 55.6 176.6 0 123.7-100.3 224-224 224S0 411.7 0 288c0-91.1 41.1-170 80.5-225 19.9-27.7 39.7-49.9 54.6-65.1 8.2-8.4 16.5-16.7 25.5-24.2zM225.7 416c25.3 0 47.7-7 68.8-21 42.1-29.4 53.4-88.2 28.1-134.4-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5-17.3-22.1-49.1-62.4-65.3-83-5.4-6.9-15.2-8-21.5-1.9-18.3 17.8-51.5 56.8-51.5 104.3 0 68.6 50.6 109.2 113.7 109.2z"></path></svg></i>${products[i]?.nutrients?.calories} kcal/100g</span>
                </div>

                <!-- Mini Nutrition -->
                <div class="grid grid-cols-4 gap-1 text-center">
                  <div class="bg-emerald-50 rounded p-1.5">
                    <p class="text-xs font-bold text-emerald-700">${products[i]?.nutrients?.protein}g</p>
                    <p class="text-[10px] text-gray-500">Protein</p>
                  </div>
                  <div class="bg-blue-50 rounded p-1.5">
                    <p class="text-xs font-bold text-blue-700">${products[i]?.nutrients?.carbs}g</p>
                    <p class="text-[10px] text-gray-500">Carbs</p>
                  </div>
                  <div class="bg-purple-50 rounded p-1.5">
                    <p class="text-xs font-bold text-purple-700">${products[i]?.nutrients?.fat}g</p>
                    <p class="text-[10px] text-gray-500">Fat</p>
                  </div>
                  <div class="bg-orange-50 rounded p-1.5">
                    <p class="text-xs font-bold text-orange-700">${products[i]?.nutrients?.sugar}g</p>
                    <p class="text-[10px] text-gray-500">Sugar</p>
                  </div>
                </div>
              </div>
            </div>`;
    }
    if (products.length == 0) {
      let noProduct = `<div class="flex flex-col items-center justify-center text-center py-12 px-6 max-w-md mx-auto">
    <div class="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
        </svg>
    </div>

    <h3 class="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
    <p class="text-sm text-gray-500 mb-6 leading-relaxed">
        We couldn't find any food items matching your search. <br>
        Please check the barcode or try searching for something else!
    </p>

    
</div>`;
      productsGrid.innerHTML = noProduct;
    } else {
      productsGrid.innerHTML = htmlValue;
    }
    const productCard = document.querySelectorAll(".product-card");
    for (let i = 0; i < productCard.length; i++) {
      productCard[i].addEventListener("click", (e) => {
        Swal.fire({
          html: `
    <div class="p-6 text-left dir-ltr">
        <div class="flex items-start gap-6 mb-6">
            <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="${!products[i].image ? "./src/images/no image.gif" : products[i]?.image}" alt="Gaseosa Cocacola X" class="w-full h-full object-contain">
            </div>
            <div class="flex-1">
                <p class="text-sm text-emerald-600 font-semibold mb-1">Coca-Cola</p>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">${products[i]?.name}</h2>
                <p class="text-sm text-gray-500 mb-3"></p>
                
                
            </div>
            <button class="close-product-modal text-gray-400 hover:text-gray-600">
                <i class="text-2xl" data-fa-i2svg=""><svg class="svg-inline--fa fa-xmark" data-prefix="fas" data-icon="xmark" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"></path></svg></i>
            </button>
        </div>
        
        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="text-emerald-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-chart-pie" data-prefix="fas" data-icon="chart-pie" role="img" viewBox="0 0 576 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M512.4 240l-176 0c-17.7 0-32-14.3-32-32l0-176c0-17.7 14.4-32.2 31.9-29.9 107 14.2 191.8 99 206 206 2.3 17.5-12.2 31.9-29.9 31.9zM222.6 37.2c18.1-3.8 33.8 11 33.8 29.5l0 197.3c0 5.6 2 11 5.5 15.3L394 438.7c11.7 14.1 9.2 35.4-6.9 44.1-34.1 18.6-73.2 29.2-114.7 29.2-132.5 0-240-107.5-240-240 0-115.5 81.5-211.9 190.2-234.8zM477.8 288l64 0c18.5 0 33.3 15.7 29.5 33.8-10.2 48.4-35 91.4-69.6 124.2-12.3 11.7-31.6 9.2-42.4-3.9L374.9 340.4c-17.3-20.9-2.4-52.4 24.6-52.4l78.2 0z"></path></svg></i>
                Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
            </h3>
            
            <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                <p class="text-4xl font-bold text-gray-900">${products[i]?.nutrients?.calories}</p>
                <p class="text-sm text-gray-500">Calories</p>
            </div>
            
            <div class="grid grid-cols-4 gap-4">
                <div class="text-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div class="bg-emerald-500 h-2 rounded-full" style="width: ${(products[i]?.nutrients?.protein / 50) * 100 > 100 ? 100 : (products[i]?.nutrients?.protein / 50) * 100}%"></div>
                    </div>
                    <p class="text-lg font-bold text-emerald-600">${products[i]?.nutrients?.protein}g</p>
                    <p class="text-xs text-gray-500">Protein</p>
                </div>
                <div class="text-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: ${(products[i]?.nutrients?.carbs / 250) * 100 > 100 ? 100 : (products[i]?.nutrients?.carbs / 250) * 100}%"></div>
                    </div>
                    <p class="text-lg font-bold text-blue-600">${products[i]?.nutrients?.carbs}g</p>
                    <p class="text-xs text-gray-500">Carbs</p>
                </div>
                <div class="text-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div class="bg-purple-500 h-2 rounded-full" style="width: ${(products[i]?.nutrients?.fat / 65) * 100 > 100 ? 100 : (products[i]?.nutrients?.fat / 65) * 100}%"></div>
                    </div>
                    <p class="text-lg font-bold text-purple-600">${products[i]?.nutrients?.fat}g</p>
                    <p class="text-xs text-gray-500">Fat</p>
                </div>
                <div class="text-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div class="bg-orange-500 h-2 rounded-full" style="width: ${(products[i]?.nutrients?.protein / 36) * 100 > 100 ? 100 : (products[i]?.nutrients?.protein / 36) * 100}%"></div>
                    </div>
                    <p class="text-lg font-bold text-orange-600">${products[i]?.nutrients?.sugar}g</p>
                    <p class="text-xs text-gray-500">Sugar</p>
                </div>
            </div>
            
            
        </div>
        
        <div class="swalButtons flex gap-3">
           
        </div>
    </div>
  `,
          showConfirmButton: false,
          width: "600px",
          customClass: {
            popup: "rounded-2xl p-0 overflow-hidden",
          },
          didOpen: () => {
            const swalButtons = document.querySelector(".swalButtons");
            let htmlValue = ` <button class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all" data-barcode="77035684">
                <i class="mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-plus" data-prefix="fas" data-icon="plus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"></path></svg></i>Log This Food
            </button>
            <button class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                Close
            </button>`;

            swalButtons.innerHTML = htmlValue;
            const addProduct = document.querySelector(".add-product-to-log");
            addProduct.addEventListener("click", (e) => {
              const keyDate = new Date().toISOString().split("T")[0];
              let getSaveMeals = JSON.parse(localStorage.getItem(keyDate)) || {
                meals: [],
                totalCalories: 0,
                totalCarbs: 0,
                totalFat: 0,
                totalProtein: 0,
              };
              getSaveMeals.meals.push(products[i]);
              getSaveMeals.totalCalories = Number(
                (
                  getSaveMeals.totalCalories +
                  (products[i].nutrients?.calories || 0)
                ).toFixed(1),
              );
              getSaveMeals.totalCarbs = Number(
                (
                  getSaveMeals.totalCarbs + (products[i].nutrients?.carbs || 0)
                ).toFixed(1),
              );
              getSaveMeals.totalFat = Number(
                (
                  getSaveMeals.totalFat + (products[i].nutrients?.fat || 0)
                ).toFixed(1),
              );
              getSaveMeals.totalProtein = Number(
                (
                  getSaveMeals.totalProtein +
                  (products[i].nutrients?.protein || 0)
                ).toFixed(1),
              );
              localStorage.setItem(keyDate, JSON.stringify(getSaveMeals));
            });
            const closeButtons = document.querySelectorAll(
              ".close-product-modal",
            );
            closeButtons.forEach((btn) => {
              btn.addEventListener("click", () => Swal.close());
            });
          },
        });
      });
    }
  }
}
