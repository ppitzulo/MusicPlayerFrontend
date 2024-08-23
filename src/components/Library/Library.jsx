import { React, useState, useEffect, useRef } from 'react'
import Playlist from '../Playlist/Playlist'
import "./Library.css"

function Playlists() {
    return (
        <div className="playlists-container">
            <div className="playlists">
                <div className="playlists-title">Playlists</div>
                <div className="playlist">Playlist 1</div>
                <div className="playlist">Playlist 2</div>
                <div className="playlist">Playlist 3</div>
            </div>
        </div>
    )
}

function navbar(isLibraryOpen, openMenu, handleMenuClick) {
    if (isLibraryOpen) {
        return (
            <div className="navbar open">
                <div className={`nav-item ${openMenu === "Now Playing" ? "active" : ""}`} onClick={() => handleMenuClick("Now Playing")}>Now Playing</div>
                <div className={`nav-item ${openMenu === "Playlists" ? "active" : ""}`} onClick={() => handleMenuClick("Playlists")}>Playlists</div>
                {/* <div className="nav-item">Artists</div> This might be a good idea for later*/}
            </div>
        )
    }
    else {
        return (
            <div className="navbar closed">
                <div className={`nav-item ${openMenu === "Now Playing" ? "active" : ""}`} onClick={() => handleMenuClick("Now Playing")}>Now Playing</div>
                <div className={`nav-item ${openMenu === "Playlists" ? "active" : ""}`} onClick={() => handleMenuClick("Playlists")}>Playlists</div>
                {/* <div className="nav-item">Artists</div> This might be a good idea for later*/}
            </div>
        )
    }
}

function Library({ playlistMetadata, handleSongSelect, fetchNextPage, isLibraryOpen, setIsLibraryOpen }) {
    const [openMenu, setOpenMenu] = useState("Now Playing");
    const libraryRef = useRef(null);

    const handleMenuClick = (selectedMenu) => {
        setOpenMenu(selectedMenu)
        setIsLibraryOpen(true);
    }

    const handleClickOutside = (event) => {
        if (libraryRef.current && !libraryRef.current.contains(event.target)) {
            setIsLibraryOpen(false); // Close the library when clicking outside
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const renderMenu = () => {
        if (openMenu === "Now Playing") {
            return <Playlist playlistMetadata={playlistMetadata} handleSongSelect={handleSongSelect} fetchNextPage={fetchNextPage} />
        } else if (openMenu === "Playlists") {
            return <Playlists />
        }
    }

    return (
        <div className={`library-container ${isLibraryOpen ? "open" : ""}`} ref={libraryRef}>
            {navbar(isLibraryOpen, openMenu, handleMenuClick)}
            <div className={`menu-content ${isLibraryOpen ? "open" : ""}`}>
                {renderMenu()}
            </div>
        </div>
    )
}

export default Library
