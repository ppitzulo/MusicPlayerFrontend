import React, { useEffect, useState } from "react";
import "./Playlist.css";
import Search from "../Search/Search";
import Upload from "../Upload/Upload";

function Playlist({ playlistMetadata, handleSongSelect, handleSearchResults }) {

    return (
    <div className="playlist-container">
      <div className="header">
        <h1 className="header-text"
            onClick={() => handleIsNowPlayingClicked('nowPlaying')}>Queue</h1>
        <Search setSearchResults={handleSearchResults}/>
        <Upload />
      </div>
      <div className="playlist">
        {playlistMetadata?.map((song, index) => (
          <div className="song" key={song.id}>
            <img className="thumbnail" src={song.thumbnail} alt="thumbnail" onClick={() => handleSongSelect(song.id)}/>
            <div className="titleContainer">
              <a className="medium-font" onClick={() => handleSongSelect(song.id)}>{song.title}</a>
              <p className="artist medium-font opaque">{song.artist}</p>
            </div>
            <p className="runtime">{song.runtime}</p>
            {/* <span className="duration">{formatTime(currentTime)} / {formatTime(duration)}</span> implement this later for desktop*/}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlist;
