import React, { useState, useEffect } from 'react'
import "./PlayerControls.css"
const PlayerControls = ({ song, isPlaying, handleIsPlaying, audioPlayerRef, changeSong }) => {
    const [currentTime, setCurrentTime] = useState(0);
  const [duration, setCurrentDuration] = useState(0);

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    audioPlayerRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
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
        <div className="media-controls">
        <input
          type="range"
          id="seek-slider"
          min="0"
          step="0.01"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
        />
          <span className="duration">
            {song?.runtime}
          </span>
          <div className="control-buttons">
            <div className="controls">
              <button id="previous">
                <i className="fa-solid fa-backward"></i>
              </button>
              <button onClick={handleIsPlaying} id="play-icon">
                <i
                  className={
                    isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play"
                  }
                ></i>
              </button>
              <button id="next">
                <i className="fa-solid fa-forward"></i>
              </button>
              {/* <span className="test-runtime">{song?.runtime}</span> */}
            </div>
            <h1 className="title">
              {song?.title
                ? song?.title
                : "No Title"}
            </h1>
          </div>
        </div>
  )
}

export default PlayerControls