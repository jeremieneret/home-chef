import { useState } from "react";

function SearchInput({ setSearchTerm }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setSearchTerm(inputValue.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        placeholder="Search recipes by name, instructions or area..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="search-input"
      />
    </form>
  );
}

export default SearchInput;
