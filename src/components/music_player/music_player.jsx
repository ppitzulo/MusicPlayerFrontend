import React, { useState } from 'react'
import './music_player.css'

function music_player() {

    const [sliderValue, setSliderValue] = useState(0)
    
    const handleSliderChange = (event) => {
        setSliderValue(event.target.value)
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
        <audio controls hidden></audio>
        <div className="player background">
          {/* <input type="range" id="volume-slider" max="100" value="100" /> */}
          <input type="range" id="seek-slider" max="100" value={sliderValue} onChange={handleSliderChange} />
          <div className="control-buttons">
            <div className="controls">
              <button id="previous"><i className="fa-solid fa-backward"></i></button>
              <button id="play-icon"><i className="fa-solid fa-play"></i></button>
              <button id="next"><i className="fa-solid fa-forward"></i></button>
            </div>
            <h1 className="title">Eternal Summer</h1>
          </div>
      </div>
    </div>
  )
}

export default music_player