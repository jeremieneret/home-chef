import { useState } from "react";
import Search from '/assets/Search.svg';

function SearchInput({ onSearchSubmit }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); 
    onSearchSubmit(inputValue.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <img src={Search} alt="search" />
      <input
        type="text"
        name="searchInput"
        placeholder="Search recipes and more..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="search-input"
      />
    </form>
  );
}

export default SearchInput;
