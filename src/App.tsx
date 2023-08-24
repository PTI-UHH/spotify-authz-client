import { useState } from 'react';
import { UserIdForm } from './components/userIdForm';
import { Scopes, SpotifyApi } from '@spotify/web-api-ts-sdk';
import './App.css'

const LOCAL_STORAGE_USER_ID_KEY = 'PTI_USER_ID'

function App() {
  const [userId, setUserId] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY)) || null
  )

  return userId
    ? alreadyAuthorizedMessage()
    : userIdForm();

  function updateUserId(userId: string) {
    localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, JSON.stringify(userId));
    setUserId(userId);
  }

  function alreadyAuthorizedMessage() {
    return (
      <h1>
        User {userId}, you have already authorized collection of Spotify data.
        Thank you for your participation!
      </h1>
    )
  }

  function userIdForm() {
    return (
      <UserIdForm onSubmit={authorizeWithSpotify} />
    )
  }

  async function authorizeWithSpotify(userId: string) {
    await SpotifyApi.performUserAuthorization(
      import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      import.meta.env.VITE_AUTH_REDIRECT_TARGET,
      Scopes.userPlaybackRead,
      `${import.meta.env.VITE_POLLING_SERVER_BASE_URL}/${userId}/auth`,
    );

    setTimeout(() => {
      updateUserId(userId);
    }, 1000);
  }
}

export default App;
