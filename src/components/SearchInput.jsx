import { useState, useEffect, useRef } from "react";
import Search from "/assets/Search.svg";

function SearchInput({ onSearchSubmit }) {
  const [inputValue, setInputValue] = useState("");
  const [placeholderText, setPlaceholderText] = useState("Search recipes and more...");
  const inputRef = useRef(null); // Reference to the input field

  useEffect(() => {
    const updatePlaceholder = () => {
      if (inputRef.current) {
        const inputWidth = inputRef.current.clientWidth;
        setPlaceholderText(inputWidth < 150 ? "Search..." : "Search recipes and more...");
      }
    };

    // Update when the window is resized
    window.addEventListener("resize", updatePlaceholder);
    updatePlaceholder(); // Call initially

    return () => {
      window.removeEventListener("resize", updatePlaceholder);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit(inputValue.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <img src={Search} alt="search" />
      <input
        ref={inputRef}
        type="text"
        name="searchInput"
        placeholder={placeholderText}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="search-input"
      />
    </form>
  );
}

export default SearchInput;
