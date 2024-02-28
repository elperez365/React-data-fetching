import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import ErrorBox from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [errorState, setError] = useState(null);

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const sortedPlaces = sortPlacesByDistance(
            places,
            latitude,
            longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch places, please try again Later",
        });
        setIsFetching(false);
      }
    }
    fetchPlaces();
  }, []);

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
