import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs } from "../components";

import { setActiveSong, playPause } from "../redux/features/playerSlice";
import {
  useGetSongDetailsQuery,
  useGetSongIdQuery,
  useGetSongRelatedQuery,
} from "../redux/services/shazamCore";

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const handlePauseClick = () => {
    dispatch(playPause(false));
  };
  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({song, data, i}));
    dispatch(playPause(true));
  };

  // related songs query
  const { data, isFetching: isFetchingSongId } = useGetSongIdQuery({ songid });
  const songIdForDetails = data?.id;
  const {
    data: relatedSongsData,
    isFetching: isFetchingRelatedSongs,
    error,
  } = useGetSongRelatedQuery({ songIdForDetails });

  // song details(Lyrics) query
  const { data: songDetails, isFetching: isFetchingSongDetails } =
    useGetSongDetailsQuery({ songid });

  if (isFetchingSongId || isFetchingRelatedSongs || isFetchingSongDetails)
    return <Loader title="Searching song details" />;
  if (error) return <Error />;
  return (
    <div className="flex flex-col">
      <DetailsHeader artistId="" songDetails={songDetails} />
      <div className="mb-10 mt-5">
        <h2 className="text-white text-3xl font-bold">Lyrics:</h2>
        <div className="mt-5">
          {songDetails?.sections[1].type === "LYRICS" ? (
            songDetails?.sections[1].text?.map((line, i) => (
              <p
                key={`lyrics-${line}-${i}`}
                className="text-gray-400 text-base my-1"
              >
                {line}
              </p>
            ))
          ) : (
            <p className="text-gray-400 text-base my-1">
              Sorry, no Lyrics found!
            </p>
          )}
        </div>
      </div>

      <RelatedSongs 
        data={relatedSongsData}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseClick={handlePauseClick}
        handlePlayClick={handlePlayClick}
      />
    </div>
  );
};

export default SongDetails;
