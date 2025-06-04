import React from "react";

function Categories({ categories, selectedCategory, setSelectedCategory, setSearchTerm }) {
  return (
    <div className="categories-container">
      <h1 className="categories-title">Categories</h1>
      <ul className="categories-list">
        {categories.slice(0, 6).map((category) => (
          <li
            key={category.idCategory}
            className={`category-item ${selectedCategory === category.strCategory ? "active" : ""}`}
            onClick={() => {
              // Si la catégorie cliquée est déjà active, on la désactive et on réinitialise le terme.
              if (selectedCategory === category.strCategory) {
                setSelectedCategory("");
                setSearchTerm(""); // Réinitialisation de l'input lors de l'annulation du filtre de catégorie
              } else {
                // Sinon, on change simplement la catégorie, en conservant le terme de recherche.
                setSelectedCategory(category.strCategory);
              }
            }}
          >
            <img
              src={category.strCategoryThumb}
              alt={category.strCategory}
              className="category-image"
            />
            <span className="category-name">{category.strCategory}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
