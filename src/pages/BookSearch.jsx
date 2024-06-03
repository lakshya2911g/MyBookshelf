import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function BookSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);

  const handleSearch = async (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.length !==  0) {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${newQuery}&limit=10&page=1`
      );
      const data = await response.json();
      const filteredBooks = data.docs.filter(book => book.title.toLowerCase().includes(newQuery.toLowerCase()));
      setBooks(filteredBooks);
    } else {
      setBooks([]);
    }
  };

  const addToBookShelf = (book) => {
    const bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];
    const isBookAlreadyAdded = bookshelf.some((savedBook) => savedBook.key === book.key);

    if (!isBookAlreadyAdded) {
      bookshelf.push(book);
      localStorage.setItem("bookshelf", JSON.stringify(bookshelf));
    } else {
      alert("This book is already in your bookshelf!");
    }
  };

  const goToBookShelf = () => {
    navigate("/bookshelf");
  };

  return (
    <div className="booksearch">
      <div className="search">
        <span>Search by book name:</span>
        <input
          type="search"
          className="b-search"
          value={query}
          onChange={handleSearch}
        />
      </div>
      <div className="results">
        {books.map((book) => (
          <div key={book.key} className="book-card">
            <h3>{book.title}</h3>
            <button onClick={() => addToBookShelf(book)} className="b-card">
              Add to Bookshelf
            </button>
          </div>
        ))}
      </div>
      <div className="shelf">
        <input
          type="button"
          value="My Bookshelf"
          className="b-shelf"
          onClick={goToBookShelf}
        />
      </div>
    </div>
  );
}

export default BookSearch;
