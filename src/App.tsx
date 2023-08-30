import { Scopes, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { useState } from "react";
import "./App.css";
import {
  usePostSpotifyAccessToken,
  useSpotifyApi,
} from "./hooks/useSpotify";
import { User, UserState } from "./types";

const LOCAL_STORAGE_USER_KEY = "PTI_USER";

function getUserIdFromUrlPath() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("userId");
}

function getFromLocalStorage(key: string) {
  return JSON.parse(localStorage.getItem(key) || "{}");
}

function saveToLocalStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function removeFromLocalStorage(key: string) {
  localStorage.removeItem(key);
}

function App() {
  const initialUserState = {
    state: UserState.LOGGED_OUT,
    ...getFromLocalStorage(LOCAL_STORAGE_USER_KEY),
  };
  const [user, setUser] = useState<User>(initialUserState);
  const pathUserId = getUserIdFromUrlPath();
  const newUserIdWasPassed = pathUserId && user.id !== pathUserId;

  function updateUser(userData: Partial<User>) {
    saveToLocalStorage(LOCAL_STORAGE_USER_KEY, { ...user, ...userData });
    setUser((user: User) => ({ ...user, ...userData }));
  }

  function handleUserStateTransitions(spotifyApi: SpotifyApi | null) {
    if (spotifyApi) {
      switch (user.state) {
        case UserState.LOGGED_OUT:
          updateUser({ state: UserState.LOGGED_IN });
          break;
        case UserState.CHANGED:
          spotifyApi.logOut();
          updateUser({ state: UserState.LOGGED_OUT });
          break;
        case UserState.LOGGED_IN:
          break;
      }
    }
  }

  function renderStatusMessage() {
    if (!user.id) {
      return <h1>Missing "userId" query parameter in URL!</h1>;
    }

    let statusMessage = null;
    switch (user.state) {
      case UserState.LOGGED_OUT:
        statusMessage = "Not yet authorized!";
        break;
      case UserState.CHANGED:
        statusMessage = "Changed user, reauthorizing!";
        break;
      case UserState.LOGGED_IN:
        statusMessage = "Already authorized!";
        break;
    }

    return (
      <h1>
        User with id "{user.id}", has status {user.state}.
        <br />
        {statusMessage}
      </h1>
    );
  }

  const spotifyApi = useSpotifyApi(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_AUTH_REDIRECT_TARGET,
    [...Scopes.userPlaybackRead],
    user.state
  );
  usePostSpotifyAccessToken(spotifyApi, user);

  if (newUserIdWasPassed) {
    updateUser({ id: pathUserId, state: UserState.CHANGED });
  }
  handleUserStateTransitions(spotifyApi);
  return renderStatusMessage();
}

export default App;
