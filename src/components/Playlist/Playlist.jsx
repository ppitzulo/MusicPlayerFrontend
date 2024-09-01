import PropTypes from "prop-types";
import "./Playlist.css";

Playlist.propTypes = {
  playlistMetadata: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      thumbnail: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
      runtime: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleSongSelect: PropTypes.func.isRequired,
  fetchNextPage: PropTypes.func.isRequired,
};

function Playlist({
  playlistMetadata,
  handleSongSelect,
  fetchNextPage,
}) {

  const handleScroll = () => {
    const playlistDiv = document.querySelector(".playlist");

    let scrollDistance = Math.round(
      playlistDiv.scrollTop + playlistDiv.offsetHeight
    );

    if (scrollDistance === playlistDiv.scrollHeight) {
      fetchNextPage();
    }
  };

  return (
    <div className="playlist" onScroll={handleScroll}>
      {playlistMetadata.map((song) => (
        <div className="song" key={song.id}>
          <img
            className="thumbnail square-image"
            src={song.thumbnail}
            alt="thumbnail"
            onClick={() => handleSongSelect(song.id)}
          />
          <div className="titleContainer">
            <a
              className="title medium-font"
              onClick={() => handleSongSelect(song.id)}
            >
              {song.title}
            </a>
            <p className="artist medium-font opaque">{song.artist}</p>
          </div>
          <p className="runtime">{song.runtime}</p>
        </div>
      ))}
    </div>
  );
}

export default Playlist;
