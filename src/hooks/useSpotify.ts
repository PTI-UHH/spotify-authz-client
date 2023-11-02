import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { useEffect, useRef, useState } from "react";
import { User, UserState } from "../types";

const isUserValid = (user: User) => user?.id && user?.email;

export function useSpotifyApi(
  clientId: string,
  redirectUrl: string,
  scopes: string[],
  user: User
) {
  console.log("useSpotifyApi called");
  const [spotifyApi, setSpotifyApi] = useState<SpotifyApi | null>(null);
  const { current: activeScopes } = useRef(scopes);

  useEffect(() => {
    (async () => {
      function resetSpotifyApi() {
        spotifyApi?.logOut();
        setSpotifyApi(() => null);
        return;
      }

      async function setupSpotifyApi() {
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
      }

      if (!isUserValid(user)) {
        resetSpotifyApi();
      }

      if (!spotifyApi && isUserValid(user)) {
        await setupSpotifyApi();
      }
    })();
  }, [clientId, redirectUrl, activeScopes, user, spotifyApi]);

  return spotifyApi;
}

export function usePostSpotifyAccessToken(
  spotifyApi: SpotifyApi | null,
  user: User
) {
  const [response, setResponse] = useState<Response | null>(null);

  useEffect(() => {
    (async () => {
      const tokenPostUrl = `${
        import.meta.env.VITE_POLLING_SERVER_BASE_URL
      }/user/${user.id}/auth`;

      if (spotifyApi && isUserValid(user)) {
        const accessToken = await spotifyApi.getAccessToken();

        const result = await fetch(tokenPostUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email, ...accessToken }),
        });

        setResponse(() => result);
      } else {
        setResponse(() => null);
      }
    })();
  }, [spotifyApi, user]);

  return response;
}
