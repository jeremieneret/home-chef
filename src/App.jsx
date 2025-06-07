import { useState } from "react";
import Categories from "./components/Categories";
import Recipes from "./components/Recipes";
import SearchInput from "./components/SearchInput";
import CustomSelect from "./components/CustomSelect";
import useCategories from "./hooks/useCategories";
import useRecipes from "./hooks/useRecipes";
import HeroText from "/assets/hero-text.png?url"
import ExpandDown from "/assets/Expand_down.svg?url"
import "./style/CSS/style.css";

function App() {
  // State management for category selection, search input, and sorting order
  const [selectedCategory, setSelectedCategory] = useState("Dessert");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Fetch categories using a custom hook
  const { categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories();

  // Fetch recipes using a custom hook
  const { recipes, isLoading: isLoadingRecipes, error: recipesError } = useRecipes(selectedCategory, searchTerm);

  // Consolidate errors from both category and recipe fetching
  const error = categoriesError || recipesError;

  // Sorting recipes based on user selection
  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortBy === "name") {
      return a.strMeal.localeCompare(b.strMeal);
    } else {
      return parseInt(a.idMeal, 10) - parseInt(b.idMeal, 10);
    }
  });

  // Handle category selection and reset search input
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchTerm("");
  };

  // Handle search input submission and reset category selection
  const handleSearchSubmit = (term) => {
    setSearchTerm(term);
    setSelectedCategory("");
  };

  return (
    <div className="app-container">
      {/* Display errors if any */}
      {error && <p className="error-message">{error}</p>}

      <div className="hero-container">
        <div className="hero">
          <img src={HeroText} alt="Chefs Academy Secrets" />
        </div>
      </div>

      <div className="main-container">
        {/* Category selection */}
        {isLoadingCategories ? (
          <p>Loading categories...</p>
        ) : (
          <Categories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        )}

        <div className="right-container">
          <div className="search-and-sorting">
            {/* Search input for filtering recipes */}
            <SearchInput onSearchSubmit={handleSearchSubmit} />

            {/* Sorting dropdown to sort recipes */}
            <div className="sort-custom-select-container">
              <label htmlFor="sortSelect">Sort by:</label>
              <CustomSelect
                options={[
                  { value: "name", label: "Name" },
                  { value: "id", label: "ID" },
                ]}
                value={sortBy}
                onChange={setSortBy}
                placeholder="Select sort order"
              />
              <img src={ExpandDown} alt="expand down" />
            </div>
          </div>


          {/* Recipe list */}
          {isLoadingRecipes ? (
            <p>Loading recipes...</p>
          ) : (
            <Recipes recipes={sortedRecipes} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
