import { useState, useEffect } from 'react';
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
        if (res.data.meals && res.data.meals.length > 0) {
          setRecipe(res.data.meals[0]);
        } else {
          setError("Recipe not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Error retrieving recipe details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (isLoading) {
    return <p>Loading recipe details...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${ingredient} - ${measure}`);
    }
  }

  return (
    <div className="recipe-details">
      <button onClick={handleBack}>Back</button>
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
