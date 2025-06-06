import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        setRecipe(res.data.meals?.[0] || null);
      } catch {
        setError("Error retrieving recipe details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (isLoading) return <p>Loading recipe details...</p>;
  if (!recipe) return <p className="error-message">{error || "Recipe not found."}</p>;

  // Extract ingredients efficiently
  const ingredients = Object.keys(recipe)
    .filter((key) => key.startsWith("strIngredient") && recipe[key]?.trim())
    .map((key, i) => `${recipe[key]} - ${recipe[`strMeasure${i + 1}`]}`);

  return (
    <div className="recipe-details">
      <button onClick={() => navigate(-1)}>Back</button>
      <h2>{recipe.strMeal}</h2>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      <p><strong>Category:</strong> {recipe.strCategory}</p>
      <p><strong>Area:</strong> {recipe.strArea}</p>
      <h3>Ingredients</h3>
      <ul>{ingredients.map((item, index) => <li key={index}>{item}</li>)}</ul>
      <h3>Instructions</h3>
      <p>{recipe.strInstructions}</p>
    </div>
  );
}

export default RecipeDetails;
