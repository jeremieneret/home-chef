function Categories({ categories, setSelectedCategory, selectedCategory, setSearchTerm }) {
  return (
    <div className="categories-container">
      <h1 className="categories-title">Categories</h1>
      <ul className="categories-list">
        {categories.slice(0, 6).map((category) => (
          <li
            key={category.idCategory}
            className={`category-item ${selectedCategory === category.strCategory ? "active" : ""}`}
            onClick={() => {
              // Mise à jour de la catégorie sélectionnée
              setSelectedCategory(category.strCategory);
              // Réinitialisation de l'input de recherche
              setSearchTerm("");
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
