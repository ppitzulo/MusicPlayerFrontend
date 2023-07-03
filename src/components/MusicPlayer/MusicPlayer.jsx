import React, { useState, useRef, useEffect } from "react";
import "./MusicPlayer.css";
import Playlist from "../Playlist/Playlist";
import PlayerControls from "../PlayerControls/PlayerControls";

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState(0);
  const [playlistMetadata, setPlaylistMetadata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([])

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

  const changeSong = (songID) => {
    for (var song in playlistMetadata) {
      if (playlistMetadata[song].id === songID) { setSelectedSong(song); }
    }
  }

  useEffect(() => {
    if ('mediaSession' in navigator && !isLoading && playlistMetadata.length != 0) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: playlistMetadata[selectedSong]?.title,
        artist: playlistMetadata[selectedSong]?.artist,
        artwork: [{ src: playlistMetadata[selectedSong]?.thumbnail, sizes: '512x512', type: 'image/png'}],
      });
    }
  }, [isPlaying, selectedSong]);

  useEffect(() => {
    const handleEnded = () => {
      setSelectedSong(++selectedSong);
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
    isPlaying ? audioPlayerRef.current.pause() : audioPlayerRef.current.play();
    setIsPlaying(!isPlaying);
  };
  
  const handleSearchResults = (results) => {
    setSearchResults(results)
  }
  
  const navigatePlaylist = (direction) => {
    if (direction === 'forward') {
      if (selectedSong < playlistMetadata.length) { setSelectedSong(prevSong => prevSong + 1); }
    }
    else if (direction === 'backward') {
      if (selectedSong > 0) { setSelectedSong(prevSong => prevSong - 1); }
    }
  }

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
            playlistMetadata={searchResults.length > 0 ? searchResults : playlistMetadata}
            handleSongSelect={changeSong}
            handleSearchResults={handleSearchResults}
          />
        )}
        <audio
          src={playlistMetadata[selectedSong]?.url}
          ref={audioPlayerRef}
        ></audio>
      {/* </div> */}
      <PlayerControls song={playlistMetadata[selectedSong]} isPlaying={isPlaying} handleIsPlaying={handleIsPlaying} audioPlayerRef={audioPlayerRef} changeSong={navigatePlaylist}/>
    </div>
  );
}

export default MusicPlayer;
