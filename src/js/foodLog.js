export default class FoodLog {
  meals;
  totalCalories;
  totalCarbs;
  totalFat;
  totalProtein;
  constructor(meals, totalCalories, totalCarbs, totalFat, totalProtein) {
    this.meals = meals;
    this.totalCalories = totalCalories;
    this.totalCarbs = totalCarbs;
    this.totalFat = totalFat;
    this.totalProtein = totalProtein;
  }
}
