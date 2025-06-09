import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import HomeChefLogo from '/assets/logo-light.svg';
import ExpandLeft from '/assets/Expand_left.svg';

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
      <header>
        <img src={HomeChefLogo} alt="Home Chef Logo" />
        <div className="back-btn">
          <img src={ExpandLeft} alt="Expand Left" />
          <button onClick={() => navigate(-1)}>Back to categories</button>
        </div>
      </header>
      <main>
        <img src={recipe.strMealThumb} alt={recipe.strMeal} />
        <h2>{recipe.strMeal}</h2>
        <div className="tags">
          <p className='tag'>Category: <span>{recipe.strCategory}</span></p>
          <p className='tag'>Area: <span>{recipe.strArea}</span></p>
        </div>
        <div className="ingredients">
          <div className="title">
            <div></div>
            <h3>Ingredients</h3>
          </div>
          <ul>{ingredients.map((item, index) => <li key={index}>{item}</li>)}</ul>
        </div>
        <div className="instructions">
          <div className="title">
            <div></div>
            <h3>Instructions</h3>
          </div>
          <p dangerouslySetInnerHTML={{ __html: recipe.strInstructions.replace(/\n/g, "<br />") }} />
        </div>
      </main>
    </div>
  );
}

export default RecipeDetails;
