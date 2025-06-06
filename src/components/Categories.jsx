import React from "react";

function Categories({ categories, selectedCategory, onCategorySelect }) {
  return (
    <div className="categories-container">
      <h1 className="categories-title">Categories</h1>
      <ul className="categories-list">
        {categories.slice(0, 6).map((category) => (
          <li
            key={category.idCategory}
            className={`category-item ${selectedCategory === category.strCategory ? "active" : ""}`}
            onClick={() => onCategorySelect(category.strCategory)} // Always select the clicked category
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
