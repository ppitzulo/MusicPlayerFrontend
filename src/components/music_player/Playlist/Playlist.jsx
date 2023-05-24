import React from 'react'
import './Playlist.css'

function Playlist() {

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }


  return (
    <div className="playlist-container">
      <div className="header">
        Header
      </div>
      <div className="playlist">
        <div className="song">
          <div className="test">
            <img className="thumbnail2" src="img/akatsuki_records.jpg" alt="thumbnail" />
            <div>
              <p>Bloody Devotion</p>
              <p>Akatsuki Records</p>
            </div>
          </div>
          <p>3:48</p>
          {/* <span className="duration">{formatTime(currentTime)} / {formatTime(duration)}</span> */}

        </div>
      </div>
    </div>
  )
}

export default Playlist