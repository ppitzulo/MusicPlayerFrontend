import React, { useState, useRef, useEffect } from "react";
import "./music_player.css";
import Playlist from "./Playlist/Playlist";

function music_player() {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setCurrentDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState(0);
  const [playlistMetadata, setPlaylistMetadata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const audioPlayerRef = useRef(null);

  const fetchPlaylist = () => {
    fetch("http://192.168.0.125:8000/api/list-songs")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setPlaylistMetadata(data);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    isPlaying ? audioPlayerRef.current.pause() : audioPlayerRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const changeSong = (songIndex) => {
    setSelectedSong(songIndex);
    audioPlayerRef.current.addEventListener("canplay", () => {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    });
  };

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
          src={playlistMetadata[selectedSong]?.thumbnail}
          alt="Yuuka album art"
          onClick={togglePlay}
        />
      </div>
      {isLoading ? (
        <div></div>
      ) : (
        <Playlist
          playlistMetadata={playlistMetadata}
          handleSongSelect={changeSong}
        />
      )}
      <audio
        src={playlistMetadata[selectedSong]?.url}
        ref={audioPlayerRef}
      ></audio>
      <div className="player background">
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
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <div className="control-buttons">
          <div className="controls">
            <button id="previous">
              <i className="fa-solid fa-backward"></i>
            </button>
            <button onClick={togglePlay} id="play-icon">
              <i
                className={isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play"}
              ></i>
            </button>
            <button id="next">
              <i className="fa-solid fa-forward"></i>
            </button>
          </div>
          <h1 className="title">
            {playlistMetadata[selectedSong]?.title
              ? playlistMetadata[selectedSong]?.title
              : "No Title"}{" "}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default music_player;
