import React, { useState, useRef, useEffect } from "react";
import "./MusicPlayer.css";
import Playlist from "../Playlist/Playlist";
import PlayerControls from "../PlayerControls/PlayerControls";

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState({});
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
        setSelectedSong(data[0]);
        setIsLoading(false);
      });
  };

  const changeSong = (songID) => {
    console.log(songID);
    for (var song in playlistMetadata) {
      console.log(song.id);
      if (playlistMetadata[song].id === songID) { setSelectedSong(playlistMetadata[song]); }
    }
  }

  useEffect(() => {
    if ('mediaSession' in navigator && playlistMetadata.length != 0) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: selectedSong?.title,
        artist: selectedSong?.artist,
        artwork: [{ src: selectedSong?.thumbnail, sizes: '512x512', type: 'image/png'}],
      });
    }
  }, [isPlaying, selectedSong]);

  useEffect(() => {
    const handleEnded = () => {
      // Edit this to incorporate the new database IDs instead of the old array positions
      if (selectedSong < playlistMetadata.length) {
        changeSong(prevIndex => prevIndex + 1);
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
    isPlaying ? audioPlayerRef.current.pause() : audioPlayerRef.current.play();
    setIsPlaying(!isPlaying);
  };
  
  const handleSearchResults = (results) => {
    setSearchResults(results)
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
            src={selectedSong?.thumbnail}
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
          src={selectedSong?.url}
          ref={audioPlayerRef}
        ></audio>
      {/* </div> */}
      <PlayerControls song={playlistMetadata[selectedSong]} isPlaying={isPlaying} handleIsPlaying={handleIsPlaying} audioPlayerRef={audioPlayerRef} changeSong={changeSong}/>
    </div>
  );
}

export default MusicPlayer;
