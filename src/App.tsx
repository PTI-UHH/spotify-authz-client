import { Scopes, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { useState, useEffect, useRef } from "react";
import "./App.css";
import { usePostSpotifyAccessToken, useSpotifyApi } from "./hooks/useSpotify";
import { User, UserState } from "./types";
import { UserForm, UserFormData } from "./components/UserForm";

const LOCAL_STORAGE_USER_KEY = "PTI_USER";

function getFromLocalStorage(key: string) {
  return JSON.parse(localStorage.getItem(key) || "{}");
}

function saveToLocalStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function App() {
  const initialUserState = { ...getFromLocalStorage(LOCAL_STORAGE_USER_KEY) };
  const [user, setUser] = useState<User>(initialUserState);
  const status = useRef<{ success: boolean; message: string }>({
    success: false,
    message: "",
  });

  const spotifyApi = useSpotifyApi(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_AUTH_REDIRECT_TARGET,
    [...Scopes.userPlaybackRead],
    user
  );

  function updateUser(userData: Partial<User>) {
    saveToLocalStorage(LOCAL_STORAGE_USER_KEY, { ...user, ...userData });
    setUser((user: User) => ({ ...user, ...userData }));
  }

  function resetUser() {
    saveToLocalStorage(LOCAL_STORAGE_USER_KEY, {});
    setUser(() => ({}));
  }

  function handleFormSubmit(data: UserFormData) {
    updateUser({ ...data });
  }

  const response = usePostSpotifyAccessToken(spotifyApi, user);
  useEffect(() => {
    (async () => {

    if (response) {
      status.current.success = response.ok;

      if (response.ok) {
        resetUser();
        const json = await response.json();
        status.current.message = `POST to ${response.url} success: ${response.status}\n ${json}`;
      } else {
        const text = await response.text()
        status.current.message = `POST to ${response.url} failed: ${response.status}\n ${text}`;
      }

      console.log(status)
      console.log(response)
    } else {
      status.current.success = false;
      status.current.message = "";
    }
    })()
  }, [response, spotifyApi, status]);

  const messageColorClass =
    status.current.success && status.current.message
      ? "text-green-500"
      : "text-red-500";

  return (
    <div className="w-full flex flex-col flex-auto justify-center items-center bg-gray-200">
      <UserForm onSubmit={handleFormSubmit}></UserForm>
      <p className={`text-xl font-bold ${messageColorClass}`}>
        {status.current.message}
      </p>
    </div>
  );
}

export default App;
