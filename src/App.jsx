import { useState, useEffect } from "react";
import axios from "axios";
import Categories from "./components/Categories";
import Recipes from "./components/Recipes";
import SearchInput from "./components/SearchInput";
import CustomSelect from "./components/CustomSelect"; // Import du custom select
import "./style/CSS/style.css"; // Import du style global

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Dessert"); // Affichage par défaut "Dessert"
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [sortBy, setSortBy] = useState("name"); // "name" ou "id"

  // Récupération des catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/categories.php"
        );
        setCategories(response.data.categories);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des catégories.");
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Récupération et filtrage des recettes en fonction du terme de recherche ou de la catégorie sélectionnée
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoadingRecipes(true);
      setError("");
      try {
        if (searchTerm && searchTerm.trim() !== "") {
          const lowerTerm = searchTerm.toLowerCase();
          // 1. Recherche par nom avec détails
          const byNameRes = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
          );
          const byNameMeals = byNameRes.data.meals || [];
          const filteredByName = byNameMeals.filter((meal) =>
            (meal.strMeal && meal.strMeal.toLowerCase().includes(lowerTerm)) ||
            (meal.strInstructions && meal.strInstructions.toLowerCase().includes(lowerTerm)) ||
            (meal.strArea && meal.strArea.toLowerCase().includes(lowerTerm))
          );

          // 2. Recherche par zone (area)
          const byAreaRes = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchTerm}`
          );
          const byAreaMeals = byAreaRes.data.meals || [];

          // 3. Recherche par instructions via chaque lettre de A à Z
          const letters = "abcdefghijklmnopqrstuvwxyz".split("");
          const instructionPromises = letters.map((letter) =>
            axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
          );
          const instructionResults = await Promise.all(instructionPromises);
          const allMeals = instructionResults.flatMap((res) => res.data.meals || []);
          const filteredByInstructions = allMeals.filter((meal) =>
            meal.strInstructions && meal.strInstructions.toLowerCase().includes(lowerTerm)
          );

          // Combinaison des trois ensembles sans doublons (basé sur idMeal)
          const combined = [];
          const addIfNotExists = (meal) => {
            if (!combined.some((m) => m.idMeal === meal.idMeal)) {
              combined.push(meal);
            }
          };
          filteredByName.forEach(addIfNotExists);
          byAreaMeals.forEach(addIfNotExists);
          filteredByInstructions.forEach(addIfNotExists);

          console.log("[API byName]", byNameMeals);
          console.log("[API byArea]", byAreaMeals);
          console.log("[Filtered by Instructions]", filteredByInstructions);
          console.log("[Combined Recipes]", combined);

          setRecipes(combined);
        } else {
          // Sans terme de recherche, récupération par catégorie
          const response = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
          );
          setRecipes(response.data.meals);
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des recettes.");
      } finally {
        setIsLoadingRecipes(false);
      }
    };
    fetchRecipes();
  }, [selectedCategory, searchTerm]);

  // Tri
  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortBy === "name") {
      return a.strMeal.localeCompare(b.strMeal);
    } else {
      return parseInt(a.idMeal, 10) - parseInt(b.idMeal, 10);
    }
  });

  return (
    <div className="app-container">
      {error && <p className="error-message">{error}</p>}
      <SearchInput setSearchTerm={setSearchTerm} />

      {/* Custom select placé juste après l'input */}
      <div className="sort-custom-select-container">
        <label htmlFor="sortSelect">Sort by:</label>
        <CustomSelect
          options={[
            { value: "name", label: "Name" },
            { value: "id", label: "ID" },
          ]}
          value={sortBy}
          onChange={setSortBy}
          placeholder="Select sort order"
        />
      </div>

      {isLoadingCategories ? (
        <p>Chargement des catégories...</p>
      ) : (
        <Categories
          categories={categories}
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
      {isLoadingRecipes ? (
        <p>Chargement des recettes...</p>
      ) : (
        selectedCategory && <Recipes recipes={sortedRecipes} />
      )}
    </div>
  );
}

export default App;
