// hooks/useRecipes.js
import { useState, useEffect } from "react";
import axios from "axios";

const useRecipes = (selectedCategory, searchTerm) => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError("");
      try {
        let candidateRecipes = [];
        const normalizedSearch = searchTerm.trim().toLowerCase();

        if (normalizedSearch !== "") {
          // Primary search using "search.php?s="
          const res = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${normalizedSearch}`
          );
          let results = res.data.meals || [];

          // If no results, fallback: search by first letter for all letters (a to z)
          if (results.length === 0) {
            const letters = "abcdefghijklmnopqrstuvwxyz".split("");
            const responses = await Promise.all(
              letters.map((letter) =>
                axios.get(
                  `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
                )
              )
            );
            results = responses.flatMap((r) => r.data.meals || []);
          }

          // Filter the results by checking recipe's name, instructions, area, and ingredients
          results = results.filter((meal) => {
            // Extract all non-empty ingredients dynamically
            const ingredients = Object.keys(meal)
              .filter(
                (key) =>
                  key.startsWith("strIngredient") &&
                  meal[key] &&
                  meal[key].trim() !== ""
              )
              .map((key) => meal[key]);
            const combinedText = (
              (meal.strMeal || "") +
              " " +
              (meal.strInstructions || "") +
              " " +
              (meal.strArea || "") +
              " " +
              ingredients.join(" ")
            )
              .toLowerCase()
              .trim();
            return combinedText.includes(normalizedSearch);
          });

          candidateRecipes = results;
        } else if (selectedCategory) {
          // If no search term but a category is selected, use the category endpoint.
          const res = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
          );
          candidateRecipes = res.data.meals || [];
        } else {
          // Default fallback: no search term and no category = fetch default recipes.
          const res = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=`
          );
          candidateRecipes = res.data.meals || [];
        }

        // Limit the results to 6 recipes
        candidateRecipes = candidateRecipes.slice(0, 6);

        setRecipes(candidateRecipes);
      } catch (err) {
        console.error(err);
        setError("Error retrieving recipes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedCategory, searchTerm]);

  return { recipes, isLoading, error };
};

export default useRecipes;
