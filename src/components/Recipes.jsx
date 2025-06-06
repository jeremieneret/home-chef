import { Link } from "react-router-dom";

function Recipes({ recipes }) {
  if (!recipes?.length) {
    return <p className="error-message">No recipes found for these criteria. Try another search.</p>;
  }

  return (
    <ul className="recipes-list">
      {recipes.map(({ idMeal, strMeal, strMealThumb }) => (
        <li key={idMeal} className="recipe-item">
          <Link to={`/meal/${idMeal}`}>
            <img src={strMealThumb} alt={strMeal} className="recipe-image" />
            <span className="recipe-name">{strMeal}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Recipes;
