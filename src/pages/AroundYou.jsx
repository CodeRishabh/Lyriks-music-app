import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { Error, Loader, SongCard } from "../components";
import {
  useGetCountryListQuery,
  useGetCountryTopSongsQuery,
} from "../redux/services/shazamCore";

const AroundYou = () => {
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: countryListData, isFetching, error } = useGetCountryListQuery();

  //find current country query
  useEffect(() => {
    axios
      .get(
        `https://geo.ipify.org/api/v2/country?apiKey=${
          import.meta.env.VITE_GEO_API_KEY
        }`
      )
      .then((res) => setCountry(res?.data?.location.country))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [countryListData]);
  const currCountryDetails = (countryListData, country) => {
    if (countryListData) {
      for (const indexCountry of countryListData?.countries) {
        if (indexCountry.id === country) {
          return indexCountry.listid;
        }
      }
      // If no match is found, return details of country with id "IN"
      return "ip-country-chart-IN";
    }
  };
  const temp = currCountryDetails(countryListData, country);
  const { data: topSongsData } = useGetCountryTopSongsQuery( temp );
  if (isFetching || loading)
    return <Loader title="Loading Songs around you..." />;

  if (error && country !== "") return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Around you <span className="font-black">{country}</span>
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {topSongsData?.tracks.map((song, i) => (
          <SongCard
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={topSongsData}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default AroundYou;
