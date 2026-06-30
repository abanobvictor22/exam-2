import Nutrition from "./nutrition.js";
export default class Product {
  barcode;
  name;
  brand;
  image;
  nutritionGrade;
  nutrients;

  constructor(
    barcode,
    name,
    brand,
    image,
    nutritionGrade,
    novaGroup,
    nutrients,
  ) {
    this.barcode = barcode;
    this.name = name;
    this.brand = brand;
    this.image = image;
    this.nutritionGrade = nutritionGrade;
    this.novaGroup = novaGroup;
    this.nutrients = new Nutrition(
      nutrients.calories,
      nutrients.protein,
      nutrients.fat,
      nutrients.carbs,
      nutrients.fiber,
      nutrients.sugar,
    );
  }
}
