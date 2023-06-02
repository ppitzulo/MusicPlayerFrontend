import React, { useEffect, useState } from "react";
import "./Playlist.css";

function Playlist({ handleSongSelect }) {
  const [playlistMetadata, setPlaylistMetadata] = useState([]);
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const fetchPlaylist = () => {
    console.log("Test");
    fetch("http://192.168.0.125:8000/api/list-songs")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setPlaylistMetadata(data);
      });
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  return (
    <div className="playlist-container">
      <div className="header">Header</div>
      <div className="playlist">
        {playlistMetadata.map((song) => (
          <div className="song">
            <img className="thumbnail2" src={song.thumbnail} alt="thumbnail" />
            <div className="titleContainer">
              <a onClick={() => handleSongSelect(song)}>{song.title}</a>
              <p className="artist">{song.artist}</p>
            </div>
            <p className="runtime">{song.runtime}</p>
            {/* <span className="duration">{formatTime(currentTime)} / {formatTime(duration)}</span> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlist;
