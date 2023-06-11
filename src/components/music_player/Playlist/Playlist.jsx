import React, { useEffect, useState } from "react";
import "./Playlist.css";

function Playlist({ playlistMetadata, handleSongSelect }) {
  const [buttonStates, setButtonStates] = useState({
    nowPlaying: true,
    upload: false,
  });
  const [CSRFToken, setCSRFToken] = useState('')


  useEffect(() => {
    fetch('https://192.168.0.125:8000/api/csrf-token')
        .then(response => response.json())
        .then(data => {
          setCSRFToken(data);
        })
  }, []);

  const handleIsNowPlayingClicked = (buttonName) => {
    setButtonStates(() => ({
      nowPlaying: buttonName === 'nowPlaying',
      upload: buttonName === 'upload',
    }));
  };


  const handleFileUpload = (event) => {
    const files = event.target.files; // Get the selected files
    const formData = new FormData();
  
    // Append each file to the FormData object
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
      console.log(files[i])
    }
    console.log(formData)
  
    fetch("http://192.168.0.125:8000/api/upload/", {
      method: "POST",
      headers: {
        "X-CSRFToken": CSRFToken,
      },
      body: formData,
    })
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
        <h1 className="header-text"
            style={{ color: highlightMenu('upload')}}
            onClick={() => handleIsNowPlayingClicked('upload')}> Upload</h1>
      </div>
      <div className="playlist">
        {buttonStates['nowPlaying'] && playlistMetadata?.map((song, index) => (
          <div className="song">
            <img className="thumbnail2" src={song.thumbnail} alt="thumbnail" />
            <div className="titleContainer">
              <a onClick={() => handleSongSelect(index)}>{song.title}</a>
              <p className="artist">{song.artist}</p>
            </div>
            <p className="runtime">{song.runtime}</p>
            {/* <span className="duration">{formatTime(currentTime)} / {formatTime(duration)}</span> implement this later for desktop*/}
          </div>
        ))}
        {buttonStates['upload'] && 
        <form action="/api/audio-upload" method="post" enctype="multipart/form-data">
          <input type="file" multiple onChange={handleFileUpload} />
          <button type="submit">Submit</button>
        </form>
        }
      </div>
    </div>
  );
}

export default Playlist;
