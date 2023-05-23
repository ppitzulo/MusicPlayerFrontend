import React, { useState, useRef, useEffect } from 'react'
import './music_player.css'

function music_player() {
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setCurrentDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioPlayerRef = useRef(null)
    
    useEffect(() => {
      // Update the duration state when the audio is loaded
      audioPlayerRef.current.addEventListener('loadedmetadata', () => {
        setCurrentDuration(audioPlayerRef.current.duration)
      })
  
      // Update the currentTime state during playback
      audioPlayerRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioPlayerRef.current.currentTime)
      })
    }, [])

    const play = () => {
      audioPlayerRef.current.play()
      setIsPlaying(true)
    }

    const pause = () => {
      audioPlayerRef.current.pause()
      setIsPlaying(false)
    }

    const handleSeek = (e) => {
      const seekTime = parseFloat(e.target.value);
      audioPlayerRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    };

  return (
    <div id="music_player_container">
        <div className="music_player_header background">
          <img
            className="thumbnail"
            src="img/akatsuki_records.jpg"
            alt="Yuuka album art"
          />
        </div>
        <audio src="http://localhost:8000/media/audio/necromantic_7BBsJib.opus" ref={audioPlayerRef} ></audio>
        <div className="player background">
          {/* <input type="range" id="volume-slider" max="100" value="100" /> */}
          <input type="range" id="seek-slider" min="0" step="0.01" max={duration} value={currentTime} onChange={handleSeek} />
          <div className="control-buttons">
            <div className="controls">
              <button id="previous"><i className="fa-solid fa-backward"></i></button>
              <button onClick={isPlaying ? pause : play} id="play-icon"><i className="fa-solid fa-play"></i></button>
              <button id="next"><i className="fa-solid fa-forward"></i></button>
            </div>
            <h1 className="title">Eternal Summer</h1>
          </div>
      </div>
    </div>
  )
}

export default music_player