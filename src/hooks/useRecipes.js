import { useState, useEffect } from "react";
import axios from "axios";

const useRecipes = (selectedCategory, searchTerm) => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError("");
      try {
        let candidateRecipes = [];
        const trimmedSearch = searchTerm.trim();

        if (trimmedSearch !== "") {
          const lowerTerm = trimmedSearch.toLowerCase();
          let results = [];
          try {
            // 1. Essayer l'endpoint de recherche standard
            const resByName = await axios.get(
              `https://www.themealdb.com/api/json/v1/1/search.php?s=${trimmedSearch}`
            );
            results = resByName.data.meals || [];
          // eslint-disable-next-line no-unused-vars
          } catch (e) {
            results = [];
          }

          // Filtrer les résultats en combinant nom, instructions, area
          results = results.filter((meal) => {
            const combined = (
              (meal.strMeal || "") +
              " " +
              (meal.strInstructions || "") +
              " " +
              (meal.strArea || "")
            )
              .toLowerCase()
              .trim();
            return combined.includes(lowerTerm);
          });

          // Si aucun résultat trouvé via l'endpoint standard, on lance un fallback :
          if (results.length === 0) {
            const letters = "abcdefghijklmnopqrstuvwxyz".split("");
            const responses = await Promise.allSettled(
              letters.map((letter) =>
                axios.get(
                  `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
                )
              )
            );
            const allMeals = responses.flatMap((res) => {
              if (res.status === "fulfilled") {
                return res.value.data.meals || [];
              } else {
                return [];
              }
            });
            // Filtrage sur l'ensemble récupéré
            results = allMeals.filter((meal) => {
              const combined = (
                (meal.strMeal || "") +
                " " +
                (meal.strInstructions || "") +
                " " +
                (meal.strArea || "")
              )
                .toLowerCase()
                .trim();
              return combined.includes(lowerTerm);
            });
          }

          candidateRecipes = results;
        } else {
          // Sans terme de recherche, on utilise l'endpoint par catégorie
          if (selectedCategory) {
            const res = await axios.get(
              `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
            );
            candidateRecipes = res.data.meals || [];
          } else {
            const res = await axios.get(
              `https://www.themealdb.com/api/json/v1/1/search.php?s=`
            );
            candidateRecipes = res.data.meals || [];
          }
        }

        // Dans le cas d'une recherche textuelle combinée et d'une catégorie active, 
        // on peut optionnellement filtrer par strCategory (si vous souhaitez conserver ce comportement)
        if (trimmedSearch !== "" && selectedCategory) {
          candidateRecipes = candidateRecipes.filter((meal) =>
            meal.strCategory &&
            meal.strCategory.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
          );
        }

        setRecipes(candidateRecipes);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des recettes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedCategory, searchTerm]);

  return { recipes, isLoading, error };
};

export default useRecipes;
