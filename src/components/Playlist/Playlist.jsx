import React, { useEffect, useState } from "react";
import "./Playlist.css";
import Search from "../Search/Search";

function Playlist({ playlistMetadata, handleSongSelect, handleSearchResults }) {
  const [buttonStates, setButtonStates] = useState({
    nowPlaying: true,
    upload: false,
  });
  const [CSRFToken, setCSRFToken] = useState('')
  // const [formData, setFormData] = useState(new FormData());
  const [numOfSelectedFiles, setNumOfSelectedFiles] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('http://192.168.0.125:8000/api/csrf-token')
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


  const handleFileChange = (event) => {
    // Assign files to be uploaded
    const tempFormData = new FormData();
    // setNumOfSelectedFiles(files.length);

    

    // setFormData(tempFormData);
  };

  const handleFileUpload = (event) => {
    setUploading(true);
    const files = event.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
      // tempFormData.append("files", files[i]);
    }

    // handleFileChange(event)
    console.log(formData)
    fetch("http://192.168.0.125:8000/api/upload/", {
      method: "POST",
      headers: {
        "X-CSRFToken": CSRFToken,
      },
      body: formData,
    })
      .then(response => response.json())
      .then(() => {
        setUploading(false);
      })
      .catch(error => {
        setUploading(false);
        console.error("Upload erorr:", error);
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
            onClick={() => handleIsNowPlayingClicked('nowPlaying')}>Queue</h1>
        <Search setSearchResults={handleSearchResults}/>
          <input type="file" id="file-upload" multiple onChange={handleFileUpload} />
          {!uploading && <label htmlFor="file-upload" className="custom-file-upload header-text"> Upload </label>}
          {uploading && <div className="spinner-container"><span className="spinner"></span></div>}
      </div>
      <div className="playlist">
        {buttonStates['nowPlaying'] && playlistMetadata?.map((song, index) => (
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
