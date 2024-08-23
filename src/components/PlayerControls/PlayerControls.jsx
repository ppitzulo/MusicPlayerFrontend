import React, { useState, useEffect } from 'react'
import "./PlayerControls.css"
import Upload from '../Upload/Upload';
const PlayerControls = ({ song, isPlaying, handleIsPlaying, audioPlayerRef, changeSong, isLibraryOpen }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setCurrentDuration] = useState(19);

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    audioPlayerRef.current.currentTime = seekTime;
    audioPlayerRef.current.play();
    if (!isPlaying) { handleIsPlaying(); }
  };

  useEffect(() => {
    // Update the duration state when the audio is loaded
    audioPlayerRef.current.addEventListener("loadedmetadata", () => {
      setCurrentDuration(audioPlayerRef.current.duration);
    });

    // Update the currentTime state during playback
    audioPlayerRef.current.addEventListener("timeupdate", () => {
      setCurrentTime(audioPlayerRef.current.currentTime);
    });
  }, []);

  return (
    // <span className="duration">
    //   {song?.runtime}
    // </span>
    <div className="media-controls-container">
      <div className="song-title wide">
        <h1 className="title">
          {song?.title
            ? song?.title
            : "No Title"}
        </h1>
        <h2 className="artist">
          {song?.artist
            ? song?.artist
            : "No Artist"}
        </h2>
      </div>
      <div className="controls">
        <div id="previous" onClick={() => { changeSong('backward') }}>
          <i className="fa-solid fa-backward"></i>
        </div>
        <div id="play-icon" onClick={handleIsPlaying}>
          <i
            className={
              isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play"
            }
          ></i>
        </div>
        <div id="next" onClick={() => { changeSong('forward') }}>
          <i className="fa-solid fa-forward"></i>
        </div>
      </div>
            <input
              type="range"
              id="seek-slider"
              min="0"
              step="0.01"
              max={duration}
              value={currentTime}
              onChange={(event) => handleSeek(event)}
            />
    </div>
  )
}

export default PlayerControls