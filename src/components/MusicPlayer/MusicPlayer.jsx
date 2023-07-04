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
  const [page, setPage] = useState(1);

  let previousPage = null;
  const audioPlayerRef = useRef(null);

  const fetchPlaylist = () => {
    if (previousPage === page) {
      return;
    }
    else {
      previousPage = page;
    }

    fetch("http://192.168.0.125:8000/api/list-songs?page=" + page)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setPlaylistMetadata(prevPlaylistMetadata => [...prevPlaylistMetadata, ...data]);
        setIsLoading(false);
      });
  };

  const changeSong = (songID) => {
    // for (const song of playlistMetadata) {
    //   if (song.id === songID) {
    //     setSelectedSong(song);
    //   }
    // }
    for (let song = 0; song < playlistMetadata.length; song++) {
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
      navigatePlaylist('forward');
    }

    audioPlayerRef.current.addEventListener('ended', handleEnded);

    return () => {
      audioPlayerRef.current.removeEventListener('ended', handleEnded);
    };
  }, [selectedSong])

  useEffect(() => {
    fetchPlaylist();
  }, [page]);

  const handleSetPage = () => {
    setPage(prevPage => prevPage + 1);
    previousPage = page;
  }

  const handleIsPlaying = () => {
    isPlaying ? audioPlayerRef.current.pause() : audioPlayerRef.current.play();
    setIsPlaying(!isPlaying);
  };
  
  const handleSearchResults = (results) => {
    setSearchResults(results)
  }
  
  const navigatePlaylist = (direction) => {
    if (direction === 'forward') {
      if (selectedSong < playlistMetadata.length - 1) { setSelectedSong(prevSong => prevSong + 1); }
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
            isLoading={isLoading}
            fetchNextPage={handleSetPage}
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
