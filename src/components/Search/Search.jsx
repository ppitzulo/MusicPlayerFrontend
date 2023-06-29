import { React, useState, useEffect } from 'react'
import "./Search.css";

const Search = ({ setSearchResults }) => {
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (query == '') {
            setSearchResults([]);            
        }
        else {
            fetch("http://192.168.0.125:8000/api/search/?search=" + query)
            .then((response) => {
              if (response == '') {
                  return [];
              }
              else {
                  return response.json();
              }
            })
            .then((data) => {
              setSearchResults(data);
            });
        }
    }, [query]);

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    }



    return (
        <input type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search"/>
    )
}

export default Search