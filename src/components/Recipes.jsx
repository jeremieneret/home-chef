function Recipes({ recipes }) {
  if (!recipes || recipes.length === 0) {
    return (
      <p className="error-message">
        Aucune recette trouvée pour ces critères. Veuillez essayer un autre terme.
      </p>
    );
  }

  return (
    <>
      <ul className="recipes-list">
        {recipes.slice(0, 6).map((recipe) => (
          <li key={recipe.idMeal} className="recipe-item">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="recipe-image"
            />
            <span className="recipe-name">{recipe.strMeal}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Recipes;
