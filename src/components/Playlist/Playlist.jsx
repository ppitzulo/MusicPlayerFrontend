import React from "react";
import "./Playlist.css";
import Search from "../Search/Search";
import Upload from "../Upload/Upload";

function Playlist({
  playlistMetadata,
  handleSongSelect,
  handleSearchResults,
  fetchNextPage,
}) {

  const handleScroll = () => {
    const playlistDiv = document.querySelector(".playlist");

    let scrollDistance = Math.round(
      playlistDiv.scrollTop + playlistDiv.offsetHeight
    );
    
    if (scrollDistance === playlistDiv.scrollHeight) {
      fetchNextPage();
    }
  };

  return (
    <div className="playlist-container">
      <div className="header">
        <Search setSearchResults={handleSearchResults} />
        <Upload />
      </div>
      <div className="playlist flex" onScroll={handleScroll}>
        { playlistMetadata?.map((song) => (
          <div className="song" key={song.id}>
            <img
              className="album-art small-album-art"
              src={song.thumbnail}
              alt="thumbnail"
              onClick={() => handleSongSelect(song.id)}
            />
            <div className="titleContainer">
              <a
                className="medium-font"
                onClick={() => handleSongSelect(song.id)}
              >
                {song.title}
              </a>
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
