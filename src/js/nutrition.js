export default class Nutrition {
  calories;
  protein;
  fat;
  carbs;
  fiber;
  sugar;
  saturatedFat;
  cholesterol;
  sodium;

  constructor(
    calories,
    protein,
    fat,
    carbs,
    fiber,
    sugar,
    saturatedFat,
    cholesterol,
    sodium,
  ) {
    this.calories = calories;
    this.protein = protein;
    this.fat = fat;
    this.carbs = carbs;
    this.fiber = fiber;
    this.sugar = sugar;
    this.saturatedFat = saturatedFat;
    this.cholesterol = cholesterol;
    this.sodium = sodium;
  }
}
