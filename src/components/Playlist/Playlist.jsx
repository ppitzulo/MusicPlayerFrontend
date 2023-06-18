import React, { useEffect, useState } from "react";
import "./Playlist.css";

function Playlist({ playlistMetadata, handleSongSelect }) {
  const [buttonStates, setButtonStates] = useState({
    nowPlaying: true,
    upload: false,
  });
  const [CSRFToken, setCSRFToken] = useState('')
  const [formData, setFormData] = useState(new FormData());
  const [numOfSelectedFiles, setNumOfSelectedFiles] = useState(0);

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
    const files = event.target.files;
    const tempFormData = new FormData();
    setNumOfSelectedFiles(files.length);

    for (let i = 0; i < files.length; i++) {
      tempFormData.append("files", files[i]);
    }

    setFormData(tempFormData);
  };

  const handleFileUpload = (event) => {
    fetch("http://192.168.0.125:8000/api/upload/", {
      method: "POST",
      headers: {
        "X-CSRFToken": CSRFToken,
      },
      body: formData,
    })
  };

  // const handleUserUploadText = (event) => {
  //   files = event.target.files;
  //   return files.length > 0 ? "Select your song(s)" : "You selected " + files.length + " files";
  // };


  const highlightMenu = (buttonName) => {
    return buttonStates[buttonName] ? 'white' : 'grey';
  };
    return (
    <>
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
          <div className="song" key={index}>
            <img className="thumbnail" src={song.thumbnail} alt="thumbnail" onClick={() => handleSongSelect(index)}/>
            <div className="titleContainer">
              <a onClick={() => handleSongSelect(index)}>{song.title}</a>
              <p className="artist">{song.artist}</p>
            </div>
            <p className="runtime">{song.runtime}</p>
            {/* <span className="duration">{formatTime(currentTime)} / {formatTime(duration)}</span> implement this later for desktop*/}
          </div>
        ))}
        {buttonStates['upload'] &&
            <div className="upload">
              <input type="file" id="file-upload" multiple onChange={handleFileChange} />
              <label htmlFor="file-upload" className="custom-file-upload"> { numOfSelectedFiles > 0 ? "You selected " + numOfSelectedFiles + " files" : "Select your song(s)"} </label>
              <button type="submit" onClick={handleFileUpload}>Submit</button>
            </div>
        }
      </div>
    </>
  );
}

export default Playlist;
