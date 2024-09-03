import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react'
import Playlist from '../Playlist/Playlist'
import "./Library.css"
import Upload from '../Upload/Upload'
import Search from '../Search/Search'

Library.propTypes = {
    playlistMetadata: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            url: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            runtime: PropTypes.string.isRequired,
            thumbnail: PropTypes.string.isRequired,
            artist: PropTypes.string.isRequired,
        })
    ).isRequired, handleSongSelect: PropTypes.func.isRequired,
    fetchNextPage: PropTypes.func.isRequired,
    isLibraryOpen: PropTypes.bool.isRequired,
    setIsLibraryOpen: PropTypes.func.isRequired,

};

function navbar(isLibraryOpen, openMenu, handleMenuClick, setSearchResults) {
    if (isLibraryOpen) {
        return (
            <div className="navbar open">
                <div className={`nav-item ${openMenu === "Now Playing" ? "active" : ""}`} onClick={() => handleMenuClick("Now Playing")}>Now Playing</div>
                <div className={`nav-item ${openMenu === "Upload" ? "active" : ""}`} onClick={() => handleMenuClick("Upload")}>Upload</div>
                {/* <div className="nav-item">Artists</div> This might be a good idea for later*/}
            </div>
        )
    }
    else {
        return (
            <div className="navbar closed">
                <div className={`nav-item ${openMenu === "Now Playing" ? "active" : ""}`} onClick={() => handleMenuClick("Now Playing")}>Now Playing</div>
                <div className={`nav-item ${openMenu === "Upload" ? "active" : ""}`} onClick={() => handleMenuClick("Upload")}>Upload</div>
                {/* <div className="nav-item">Artists</div> This might be a good idea for later*/}
            </div>
        )
    }
}

function Library({ playlistMetadata, handleSongSelect, fetchNextPage, isLibraryOpen, setIsLibraryOpen }) {
    const [openMenu, setOpenMenu] = useState("Now Playing");
    const [searchResults, setSearchResults] = useState([]);
    const libraryRef = useRef(null);

    const handleMenuClick = (selectedMenu) => {
        setOpenMenu(selectedMenu)
        setIsLibraryOpen(true);
    }

    useEffect(() => {
        const initialHeight = window.innerHeight;

        const handleResize = () => {
            const keyboardOpen =  window.innerHeight - initialHeight > 40;

            if (window.innerWidth >= 992) {
                setIsLibraryOpen(true);
            }
            else {
                if (!keyboardOpen) {
                    setIsLibraryOpen(false);
                }
            }
        };
    
        window.addEventListener("resize", handleResize);
        handleResize(); // Initial check
    
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [setIsLibraryOpen]);
    

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (libraryRef.current && window.innerWidth < 992 && !libraryRef.current.contains(event.target)) {
                setIsLibraryOpen(false); // Close the library when clicking outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsLibraryOpen]);

    const renderMenu = () => {
        const playlistData = searchResults.length > 0 ? searchResults : playlistMetadata;

        if (openMenu === "Now Playing") {
            return <Playlist playlistMetadata={playlistData} handleSongSelect={handleSongSelect} fetchNextPage={fetchNextPage} />
        } else if (openMenu === "Upload") {
            return <Upload />
        }
    }

    return (
        <div className={`library-container ${isLibraryOpen ? "open" : ""}`} ref={libraryRef}>
            {navbar(isLibraryOpen, openMenu, handleMenuClick)}
            <div className={`menu-content ${isLibraryOpen ? "open" : ""}`}>
                <Search setSearchResults={setSearchResults} />
                {renderMenu()}
            </div>
        </div>
    );
}

export default Library
