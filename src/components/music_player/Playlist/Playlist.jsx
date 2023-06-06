import React, { useEffect, useState } from "react";
import "./Playlist.css";

function Playlist({ handleSongSelect }) {
  const [playlistMetadata, setPlaylistMetadata] = useState([]);
  const [buttonStates, setButtonStates] = useState({
    nowPlaying: true,
    upload: false,
});

  const fetchPlaylist = () => {
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

  const handleIsNowPlayingClicked = (buttonName) => {
    setButtonStates(() => ({
      nowPlaying: buttonName === 'nowPlaying',
      upload: buttonName === 'upload',
    }));
  };
  

  const highlightMenu = (buttonName) => {
    return buttonStates[buttonName] ? 'white' : 'grey';
  };
    return (
    <div className="playlist-container">
      <div className="header">
        <h1 className="header-text"
            style={{color: highlightMenu('nowPlaying')}}
            onClick={() => handleIsNowPlayingClicked('nowPlaying')}>Now Playing</h1>
        <h1 className="header-text upload"
            style={{ color: highlightMenu('upload')}}
            onClick={() => handleIsNowPlayingClicked('upload')}> Upload</h1>
      </div>
      <div className="playlist">
        {playlistMetadata.map((song) => (
          <div className="song">
            <img className="thumbnail2" src={song.thumbnail} alt="thumbnail" />
            <div className="titleContainer">
              <a onClick={() => handleSongSelect(song)}>{song.title}</a>
              <p className="artist">{song.artist}</p>
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
