import React, { useState, useRef, useEffect } from "react";
import "./MusicPlayer.css";
import Playlist from "../Playlist/Playlist";
import PlayerControls from "../PlayerControls/PlayerControls";

function MusicPlayer() {
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

  const changeSong = (song) => {
    setSelectedSong(song);
  }

  useEffect(() => {
    if ('mediaSession' in navigator && playlistMetadata.length != 0) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: playlistMetadata[selectedSong]?.title,
        artist: playlistMetadata[selectedSong]?.artist,
        // album: playlistMetadata[selectedSong]?.title,
        artwork: [{ src: playlistMetadata[selectedSong]?.thumbnail, sizes: '512x512', type: 'image/png'}],
        // ... set other metadata properties as needed
      });
    }
  }, [isPlaying, selectedSong]);

  useEffect(() => {
    console.log("outside")
    const handleEnded = () => {
    console.log("handleended")
      if (selectedSong < playlistMetadata.length) {
    console.log("if")
        changeSong(prevIndex => prevIndex + 1);
        console.log(selectedSong)
        // handleIsPlaying();
      }
    }

    audioPlayerRef.current.addEventListener('ended', handleEnded);

    return () => {
      audioPlayerRef.current.removeEventListener('ended', handleEnded);
    };
  }, [selectedSong])

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const handleIsPlaying = () => {
    console.log("isplaying");
    isPlaying ? audioPlayerRef.current.pause() : audioPlayerRef.current.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    audioPlayerRef.current.addEventListener("loadedmetadata", () => {
      if (playlistMetadata.length > 0) {
        audioPlayerRef.current.play();
        setIsPlaying(true);
      }
    });
  }, [selectedSong]);

  return (
    <div id="music_player_container">
        {/* <div className="test"> */}
        <div className="music_player_header background">
          <img
            className="album-art"
            src={playlistMetadata[selectedSong]?.thumbnail}
            alt="Album art"
            onClick={() => { handleIsPlaying() }}
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
      {/* </div> */}
      <PlayerControls song={playlistMetadata[selectedSong]} isPlaying={isPlaying} handleIsPlaying={handleIsPlaying} audioPlayerRef={audioPlayerRef} changeSong={changeSong}/>
    </div>
  );
}

export default MusicPlayer;
