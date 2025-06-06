import { useState } from "react";

function SearchInput({ onSearchSubmit }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); 
    onSearchSubmit(inputValue.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        name="searchInput"
        placeholder="Search recipes by name, instructions or area..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="search-input"
      />
    </form>
  );
}

export default SearchInput;
