import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import ErrorBox from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
import { useFetch } from "../hooks/useFetch.jsx";

async function fetchSortedPlaces() {
  const places = await fetchAvailablePlaces();
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const sortedPlaces = sortPlacesByDistance(places, latitude, longitude);
      resolve(sortedPlaces);
    }, reject);
  });
}

export default function AvailablePlaces({ onSelectPlace }) {
  const {
    data: availablePlaces,
    setData: setAvailablePlaces,
    loading: isFetching,
    error: errorState,
    setError,
  } = useFetch(fetchSortedPlaces, []);

  if (errorState) {
    return (
      <ErrorBox
        title="An error occurred!"
        message={errorState.message}
        onConfirm={() => setError(null)}
      />
    );
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      loadingText="Fetching places data..."
      isLoading={isFetching}
      onSelectPlace={onSelectPlace}
    />
  );
}
