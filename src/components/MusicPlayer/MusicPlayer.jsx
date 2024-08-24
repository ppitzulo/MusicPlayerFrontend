import React, { useState, useRef, useEffect } from "react";
import "./MusicPlayer.css";
import Playlist from "../Playlist/Playlist";
import Library from "../Library/Library";
import PlayerControls from "../PlayerControls/PlayerControls";

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState(0);
  const [playlistMetadata, setPlaylistMetadata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [audioBlobURL, setAudioBlobURL] = useState("");
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const audioPlayerRef = useRef(null);
  const endOfData = useRef(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    // Fetch playlist data based on current page

    const controller = new AbortController();
    const signal = controller.signal;

    if (endOfData.current) {
      return;
    }

    fetch(backendURL + "/api/list-songs?page=" + page, { signal })
      .then((response) => {
        let json = response.json();
        return json;
      })
      .then((data) => {
        if (data.length === 0) { endOfData.current = true; }
        setPlaylistMetadata(prevPlaylistMetadata => [...prevPlaylistMetadata, ...data]);
        setIsLoading(false);
      }).catch(err => {
        if (err.name === "AbortError") {
          console.log("Canceled duplicate request.");
        }
        else {
          console.log(err);
        }
      });

    return () => {
      controller.abort();
    };
  }, [page]);


  const changeSong = (songID) => {
    for (let song = 0; song < playlistMetadata.length; song++) {
      if (playlistMetadata[song].id === songID) { setSelectedSong(song); }
    }
  }

  const loadMetadata = () => {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: playlistMetadata[selectedSong]?.title,
      artist: playlistMetadata[selectedSong]?.artist,
      artwork: [{ src: playlistMetadata[selectedSong]?.thumbnail, sizes: '512x512', type: 'image/png' }],
    });
  }

  const fetchNextPage = () => {
    setPage(prevPage => prevPage + 1);
  }


  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 992) {
            setIsLibraryOpen(true);
        }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
        window.removeEventListener("resize", handleResize);
    };
}, [setIsLibraryOpen]);

  useEffect(() => {
    isPlaying ? audioPlayerRef.current.play() : audioPlayerRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    // Deallocate old audio blob if exists
    if (audioBlobURL !== "") {
      URL.revokeObjectURL(audioBlobURL)
    }

    if (playlistMetadata.length > 0) {
      fetch(backendURL + `/api/audio/${playlistMetadata[selectedSong]?.id}/`)
        .then((response) => response.blob())
        .then((audioBlob) => {
          /* make sure to deallocate this */
          setAudioBlobURL(URL.createObjectURL(audioBlob));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoading, selectedSong]);

  const handleIsPlaying = () => {
    setIsPlaying(!isPlaying);
  };

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

  const song = playlistMetadata[selectedSong];

  return (
    <div id="music_player_container" className={isLibraryOpen && window.innerWidth < 992 ? "library-open" : ""}>
      <div className={`music_player_header background ${isLibraryOpen && window.innerWidth < 992 ? "library-open" : ""}`} >
        <img
          className={`album-art large-album square-image ${isLibraryOpen && window.innerWidth < 992 ? "shrink" : ""}`}
          src={song?.thumbnail}
          alt="Album art"
          onClick={() => { handleIsPlaying() }}
        />
        {isLibraryOpen && window.innerWidth < 992 &&
          <div className="song-info">
            <h1 className="title">
              {song?.title || "No Title"}
            </h1>
            <h2 className="artist">
              {song?.artist || "No Artist"}
            </h2>
          </div>
        }
      </div>
      <audio
        src={audioBlobURL}
        ref={audioPlayerRef}
        onEnded={() => navigatePlaylist('forward')}
        onPlay={() => loadMetadata()}
      ></audio>
      <PlayerControls song={song}
        isPlaying={isPlaying}
        handleIsPlaying={handleIsPlaying}
        audioPlayerRef={audioPlayerRef}
        changeSong={navigatePlaylist}
        isLibraryOpen />
      <Library playlistMetadata={playlistMetadata}
        handleSongSelect={changeSong}
        fetchNextPage={fetchNextPage}
        isLibraryOpen={isLibraryOpen}
        setIsLibraryOpen={setIsLibraryOpen}
      />
    </div>
  );
}

export default MusicPlayer;