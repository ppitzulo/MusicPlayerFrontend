import { React, useState } from 'react'
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

function Library({ playlistMetadata, handleSongSelect, fetchNextPage }) {
    const [openMenu, setOpenMenu] = useState("Now Playing");

    const renderMenu = () => {
        if (openMenu === "Now Playing") {
            return <Playlist playlistMetadata={playlistMetadata} handleSongSelect={handleSongSelect} fetchNextPage={fetchNextPage} />
        } else if (openMenu === "Playlists") {
            return <Playlists />
        }
    }

    return (
        <div className="library-container">
            <div className="navbar">
                <div className={`nav-item ${openMenu === "Now Playing" ? "active" : ""}`} onClick={() => setOpenMenu("Now Playing")}>Now Playing</div>
                <div className={`nav-item ${openMenu === "Playlists" ? "active" : ""}`} onClick={() => setOpenMenu("Playlists")}>Playlists</div>
                {/* <div className="nav-item">Artists</div> This might be a good idea for later*/}
            </div>
            {renderMenu()}
        </div>
    )
}

export default Library
