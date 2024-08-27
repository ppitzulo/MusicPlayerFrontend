import { React, useState, useEffect, useRef } from 'react'
import Playlist from '../Playlist/Playlist'
import "./Library.css"
import Upload from '../Upload/Upload'

function navbar(isLibraryOpen, openMenu, handleMenuClick) {
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
    const libraryRef = useRef(null);

    const handleMenuClick = (selectedMenu) => {
        setOpenMenu(selectedMenu)
        setIsLibraryOpen(true);
    }

    const handleClickOutside = (event) => {
        if (libraryRef.current && window.innerWidth < 992 && !libraryRef.current.contains(event.target)) {
            setIsLibraryOpen(false); // Close the library when clicking outside
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 992) {
                setIsLibraryOpen(true);
            } else {
                setIsLibraryOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial check

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [setIsLibraryOpen]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const renderMenu = () => {
        if (openMenu === "Now Playing") {
            return <Playlist playlistMetadata={playlistMetadata} handleSongSelect={handleSongSelect} fetchNextPage={fetchNextPage} />
        } else if (openMenu === "Upload") {
            return <Upload />
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
