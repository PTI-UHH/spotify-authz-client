import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { useEffect, useRef, useState } from "react";
import { User, UserState } from "../types";

export function useSpotifyApi(
  clientId: string,
  redirectUrl: string,
  scopes: string[],
  userState: UserState
) {
  const [spotifyApi, setSpotifyApi] = useState<SpotifyApi | null>(null);
  const { current: activeScopes } = useRef(scopes);

  useEffect(() => {
    (async () => {
      const api = SpotifyApi.withUserAuthorization(
        clientId,
        redirectUrl,
        activeScopes
      );

      try {
        const { authenticated } = await api.authenticate();

        if (authenticated) {
          setSpotifyApi(() => api);
        }
      } catch (e: Error | unknown) {
        const error = e as Error;
        if (error?.message?.includes("No verifier found in cache")) {
          console.error(
            "If you are seeing this error in a React Development Environment it's because React calls useEffect twice. Using the Spotify SDK performs a token exchange that is only valid once, so React re-rendering this component will result in a second, failed authentication. This will not impact your production applications (or anything running outside of Strict Mode - which is designed for debugging components).",
            error
          );
        } else {
          console.error(e);
        }
      }
    })();
  }, [clientId, redirectUrl, activeScopes, userState]);

  return spotifyApi;
}

export function usePostSpotifyAccessToken(
  spotifyApi: SpotifyApi | null,
  user: User
) {
  useEffect(() => {
    (async () => {
      const tokenPostUrl = `${
        import.meta.env.VITE_POLLING_SERVER_BASE_URL
      }/user/${user.id}/auth`;

      if (spotifyApi && user.state === UserState.LOGGED_IN) {
        const accessToken = await spotifyApi.getAccessToken();

        await fetch(tokenPostUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accessToken),
        });
      }
    })();
  }, [spotifyApi, user]);
}
