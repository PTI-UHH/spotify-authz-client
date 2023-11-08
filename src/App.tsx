import { Scopes } from "@spotify/web-api-ts-sdk";
import { useState, useEffect } from "react";
import "./App.css";
import { usePostSpotifyAccessToken, useSpotifyApi } from "./hooks/useSpotify";
import { User } from "./types";
import { UserForm, UserFormData } from "./components/UserForm";

type Status = { success: boolean; message: string; result: string };

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
  const [status, setStatus] = useState<Status>({
    success: false,
    message: "",
    result: "",
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
        try {
          if (response.ok) {
            const json = await response.json();

            setStatus({
              success: response.ok,
              result: JSON.stringify(json, null, 2),
              message: `POST to ${response.url} success: ${response.status}`,
            });
          } else {
            const text = await response.text();
            setStatus({
              success: response.ok,
              result: text,
              message: `POST to ${response.url} failed: ${response.status}`,
            });
          }

          resetUser();
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [response, spotifyApi, status]);

  const boxColorClass =
    status.success && status.message
      ? "bg-green-100 border border-green-400"
      : "bg-red-100 border border-red-400";
  const messageColorClass =
    status.success && status.message ? "text-green-700" : "text-red-700";

  return (
    <div className="w-full flex flex-col flex-auto justify-center items-center bg-gray-200">
      <UserForm onSubmit={handleFormSubmit}></UserForm>
      <div
        className={`${boxColorClass} ${messageColorClass} px-4 py-3 rounded relative`}
        role="alert"
        hidden={!status.message}
      >
        <strong className="font-bold">
          {status.success ? "Success: " : "Error: "}
        </strong>
        <span className="block">{status.message}</span>
        <pre className="block">
          <code>{status.result}</code>
        </pre>
      </div>
    </div>
  );
}

export default App;
