import { useState, useEffect } from "react";
import axios from "axios";
import Categories from "./components/Categories";
import Recipes from "./components/Recipes";
import SearchInput from "./components/SearchInput";
import CustomSelect from "./components/CustomSelect"; // Composant custom pour le tri
import "./style/CSS/style.css"; // Import du style global

function App() {
  const [categories, setCategories] = useState([]);
  // À l'ouverture, la catégorie active est "Dessert"
  const [selectedCategory, setSelectedCategory] = useState("Dessert");
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  // Ce state est mis à jour uniquement sur validation (touche Enter)
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

  // Récupération et filtrage des recettes selon le terme de recherche et la catégorie
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoadingRecipes(true);
      setError("");
      try {
        let candidateRecipes = [];
        const trimmedSearch = searchTerm.trim();

        if (trimmedSearch !== "") {
          const lowerTerm = trimmedSearch.toLowerCase();

          // 1. Recherche par nom avec détails
          const byNameRes = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${trimmedSearch}`
          );
          const byNameMeals = byNameRes.data.meals || [];
          const filteredByName = byNameMeals.filter((meal) =>
            (meal.strMeal &&
              meal.strMeal.toLowerCase().includes(lowerTerm)) ||
            (meal.strInstructions &&
              meal.strInstructions.toLowerCase().includes(lowerTerm)) ||
            (meal.strArea &&
              meal.strArea.toLowerCase().includes(lowerTerm))
          );

          // 2. Recherche par zone (area) via l'endpoint filter
          const byAreaRes = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/filter.php?a=${trimmedSearch}`
          );
          let byAreaMeals = byAreaRes.data.meals || [];
          // Enrichir chaque repas issu de filter.php?a pour obtenir des détails complets
          const detailedByAreaMeals = await Promise.all(
            byAreaMeals.map((meal) =>
              axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
            )
          ).then((results) => results.map((res) => res.data.meals[0]));

          // 3. Recherche par instructions via chaque lettre de A à Z
          const letters = "abcdefghijklmnopqrstuvwxyz".split("");
          const instructionPromises = letters.map((letter) =>
            axios.get(
              `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
            )
          );
          const instructionResults = await Promise.all(instructionPromises);
          const allMeals = instructionResults.flatMap(
            (res) => res.data.meals || []
          );
          const filteredByInstructions = allMeals.filter((meal) =>
            meal.strInstructions &&
            meal.strInstructions.toLowerCase().includes(lowerTerm)
          );

          // Combinaison des trois ensembles sans doublons (basé sur idMeal)
          const combined = [];
          const addIfNotExists = (meal) => {
            if (!combined.some((m) => m.idMeal === meal.idMeal)) {
              combined.push(meal);
            }
          };
          filteredByName.forEach(addIfNotExists);
          detailedByAreaMeals.forEach(addIfNotExists);
          filteredByInstructions.forEach(addIfNotExists);

          candidateRecipes = combined;
        } else {
          // Sans terme validé, on utilise l'endpoint pour récupérer les recettes par catégorie
          if (selectedCategory) {
            const response = await axios.get(
              `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
            );
            candidateRecipes = response.data.meals || [];
          } else {
            // Cas alternatif si aucune catégorie n'est sélectionnée
            const response = await axios.get(
              `https://www.themealdb.com/api/json/v1/1/search.php?s=`
            );
            candidateRecipes = response.data.meals || [];
          }
        }

        // Appliquer le filtre par catégorie seulement dans le cas de recherche textuelle,
        // car les objets renvoyés par filter.php?c= ne contiennent pas strCategory.
        if (trimmedSearch !== "" && selectedCategory) {
          candidateRecipes = candidateRecipes.filter((meal) =>
            meal.strCategory &&
            meal.strCategory.toLowerCase() === selectedCategory.toLowerCase()
          );
        }

        setRecipes(candidateRecipes);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des recettes.");
      } finally {
        setIsLoadingRecipes(false);
      }
    };

    fetchRecipes();
  }, [selectedCategory, searchTerm]);

  // Tri des recettes selon le critère choisi (par nom ou par id)
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
      
      {/* SearchInput validé sur Enter */}
      <SearchInput setSearchTerm={setSearchTerm} />

      {/* CustomSelect pour choisir l'ordre de tri, placé juste après l'input */}
      <div className="sort-custom-select-container">
        <label htmlFor="sortSelect">Sort by:</label>
        <CustomSelect
          options={[
            { value: "name", label: "Name" },
            { value: "id", label: "ID" }
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
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSearchTerm={setSearchTerm} // Pour réinitialiser l'input lorsque l'on clique sur une catégorie
        />
      )}

      {isLoadingRecipes ? (
        <p>Chargement des recettes...</p>
      ) : (
        <Recipes recipes={sortedRecipes} />
      )}
    </div>
  );
}

export default App;
