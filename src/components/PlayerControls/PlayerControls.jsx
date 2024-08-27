import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import "./PlayerControls.css"



const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const formattedMinutes = minutes >= 10 ? minutes : `${minutes}`;
  const formattedSeconds = String(seconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};

const PlayerControls = ({ song, isPlaying, handleIsPlaying, audioPlayerRef, changeSong }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setCurrentDuration] = useState(19);

  PlayerControls.propTypes = {
    song: PropTypes.shape({
      title: PropTypes.string,
      artist: PropTypes.string,
      runtime: PropTypes.string,
    }).isRequired,
    isPlaying: PropTypes.bool.isRequired,
    handleIsPlaying: PropTypes.func.isRequired,
    audioPlayerRef: PropTypes.shape({
      current: PropTypes.instanceOf(Element),
    }).isRequired,
    changeSong: PropTypes.func.isRequired,
  };
  
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
  }, [audioPlayerRef]);

  return (
    <div className="media-controls-container">
      <div className="song-title wide">
        <h1 className="title">
          {song?.title ? song?.title : "No Title"}
        </h1>
        <h2 className="artist">
          {song?.artist ? song?.artist : "No Artist"}
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
      <div className="time-container">
        <span className="current-time">{formatTime(currentTime)}</span>
        <span className="duration">{song?.runtime}</span>
      </div>
    </div>
  )
}

export default PlayerControls