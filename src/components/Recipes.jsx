import { Link } from "react-router-dom";

function Recipes({ recipes }) {
  if (!recipes || recipes.length === 0) {
    return <p className="error-message">No recipes found for these criteria. Try another search.</p>;
  }

  return (
    <ul className="recipes-list">
      {recipes.slice(0, 6).map((recipe) => (
        <li key={recipe.idMeal} className="recipe-item">
          <Link to={`/meal/${recipe.idMeal}`}>
            <img src={recipe.strMealThumb} alt={recipe.strMeal} className="recipe-image" />
            <span className="recipe-name">{recipe.strMeal}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Recipes;
