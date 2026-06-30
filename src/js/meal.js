import Nutrition from "./nutrition.js";

export default class Meal {
  id;
  name;
  category;
  area;
  instructions;
  thumbnail;
  tags;
  youtube;
  ingredients;
  nutrition;
  servings;

  constructor(
    id,
    name,
    category,
    area,
    instructions,
    thumbnail,
    tags,
    youtube,
    ingredients,
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.area = area;
    this.instructions = instructions;
    this.thumbnail = thumbnail;
    this.tags = tags;
    this.youtube = youtube;
    this.ingredients = ingredients;
  }

  async getAnalysis() {
    try {
      const url = "https://nutriplan-api.vercel.app/api/nutrition/analyze";
      const apiKey = "pK2gWNNNGGjv6dTYgikddMKkzftvj6CsuYLgeUZ5";
      let ingredientsConcatenated = this.ingredients.map(
        (e) => `${e.measure} ${e.ingredient}`,
      );
      const recipeData = {
        recipeName: this.id,
        ingredients: ingredientsConcatenated,
      };
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(recipeData),
      });
      let data = await response.json();

      let perServing = data.data.perServing;
      this.nutrition = new Nutrition(
        perServing.calories,
        perServing.protein,
        perServing.fat,
        perServing.carbs,
        perServing.fiber,
        perServing.sugar,
        perServing.saturatedFat,
        perServing.cholesterol,
        perServing.sodium,
      );
      this.servings = data.servings;
      return this.nutrition;
    } catch (err) {
      console.log(err);
    }
  }
}
