import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import "./Search.css";

const Search = ({ setSearchResults }) => {
    const [query, setQuery] = useState("");
    const backendURL = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        if (query == '') {
            setSearchResults([]);
        }
        else {
            fetch(backendURL + "/api/search/?search=" + query)
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
    }, [query, backendURL, setSearchResults]);

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    }

    return (
        <input type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search" />
    )
}

Search.propTypes = {
    setSearchResults: PropTypes.func.isRequired,
}

export default Search