import React, { useState, useEffect } from 'react'
import "./PlayerControls.css"
import Upload from '../Upload/Upload';
const PlayerControls = ({ song, isPlaying, handleIsPlaying, audioPlayerRef, changeSong }) => {
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
    <div className="media-controls-container">
      <input
        type="range"
        id="seek-slider"
        min="0"
        step="0.01"
        max={duration}
        value={currentTime}
        onChange={(event) => handleSeek(event)}
      />
      <span className="duration">
        {song?.runtime}
      </span>
      <div className="media-controls">
        <div className="controls">
          <button id="previous" onClick={() => { changeSong('backward') }}>
            <i className="fa-solid fa-backward"></i>
          </button>
          <button onClick={handleIsPlaying} id="play-icon">
            <i
              className={
                isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play"
              }
            ></i>
          </button>
          <button id="next" onClick={() => { changeSong('forward') }}>
            <i className="fa-solid fa-forward"></i>
          </button>
        </div>
        <h1 className="title">
          {song?.title
            ? song?.title
            : "No Title"}
        </h1>
        <Upload />
      </div>
    </div>
  )
}

export default PlayerControls