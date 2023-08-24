import { UserIdForm } from './components/userIdForm';
import { Scopes, SpotifyApi } from '@spotify/web-api-ts-sdk';
import './App.css'

function App() {
  const userId = null;
  return userId ? userIdForm() : "";
}

function userIdForm() {
  return ( 
    <UserIdForm onSubmit={(userId: string) => {
      userId = userId; 
      authorizeWithSpotify(userId);
    }} />
  )
}

function authorizeWithSpotify(userId: string) {
  SpotifyApi.performUserAuthorization(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID, 
    import.meta.env.VITE_REDIRECT_TARGET, 
    Scopes.userPlaybackRead, 
    import.meta.env.VITE_SERVER_USER_TOKEN_URL, 
  );
}

export default App;
