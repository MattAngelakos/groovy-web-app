import { useEffect, useState } from "react";
import {
    createBrowserRouter,
    RouteObject,
    RouterProvider,
    Link,
} from "react-router-dom";
import "./App.css";
import {
    search,
    getArtist2,
    getArtistAlbumsWithImage,
} from "./lib/spotify/data";
import { emptyAPIContextValue } from "./lib/spotify/types";
import SpotifyContext from "./contexts/SpotifyContext";
import Homepage from "./homepage/Homepage";
import SearchPage from "./SearchPage";
import ArtistPage from "./ArtistPage";
import Selection from "./Selection";
import RankerPage from "./Ranker/RankerPage";
import TierListPage from "./TierList/TierListPage";
import NotFound from "./NotFound";
import getSpotifyToken from "./lib/spotify/spotifyAuth";

export default function App() {
    const [apiState, setApiState] = useState(emptyAPIContextValue());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchToken = async () => {
            if (!apiState.accessToken) {
                try {
                    const token = await getSpotifyToken();
                    if (token) {
                        setApiState((prevState) => ({
                            ...prevState,
                            accessToken: token,
                        }));
                    } else {
                        console.error("Failed to fetch Spotify token.");
                    }
                } catch (error) {
                    console.error("Error fetching Spotify token:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false); 
            }
        };

        fetchToken();
    }, [apiState.accessToken]);

    const routeObjects: Array<RouteObject> = [
        {
            path: "/",
            element: (
                <>
                    <Homepage />
                    <br />
                    <hr className="border-gray-500" />
                    <br />
                    <h1 className="text-4xl font-bold">
                        Click here to get started!
                    </h1>
                    <br />
                    <nav>
                        <Link
                            to="/search"
                            className="mt-4 px-4 py-2 bg-pink-300 text-black font-spotify font-semibold rounded hover:bg-pink-400 transition m-3"
                        >
                            Search
                        </Link>
                    </nav>
                    <br />
                </>
            ),
        },
        {
            path: "/search",
            element: (
                <>
                    {apiState.accessToken === null ? (
                        <div>
                            <h1 className="text-4xl font-bold">
                                Click below to authorize:
                            </h1>
                            <br />
                            <Link
                                to="/auth"
                                className="mt-4 px-4 py-2 bg-pink-300 text-black font-spotify font-semibold rounded hover:bg-pink-400 transition m-3"
                            >
                                Authorize
                            </Link>
                        </div>
                    ) : (
                        <SearchPage
                            handleSearch={(searched: string, type: string, page?: number) =>
                                search(
                                    apiState.accessToken!,
                                    searched,
                                    type,
                                    page ?? 1
                                )
                            }
                        />
                    )}
                </>
            ),
        },
        {
            path: "/artist/:id",
            element: (
                <ArtistPage
                    handleArtist={(token: string, artistId: string) =>
                        getArtist2(token, artistId)
                    }
                    handleAlbums={(token: string, artistId: string) =>
                        getArtistAlbumsWithImage(token, artistId)
                    }
                />
            ),
        },
        {
            path: "/ranker",
            element: <RankerPage />,
        },
        {
            path: "/tierlist",
            element: <TierListPage />,
        },
        {
            path: "/selection/:id",
            element: (
                <>
                    {apiState.accessToken === null ? (
                        <div>
                            <h1 className="text-4xl font-bold">
                                Click below to authorize:
                            </h1>
                            <br />
                            <Link
                                to="/auth"
                                className="mt-4 px-4 py-2 bg-pink-300 text-black font-spotify font-semibold rounded hover:bg-pink-400 transition m-3"
                            >
                                Authorize
                            </Link>
                        </div>
                    ) : (
                        <Selection />
                    )}
                </>
            ),
        },
        {
            path: "*",
            element: <NotFound />,
        },
    ];

    const router = createBrowserRouter(routeObjects);
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <SpotifyContext.Provider
            value={{ stateValue: apiState, stateSetter: setApiState }}
        >
            <RouterProvider router={router} />
        </SpotifyContext.Provider>
    );
}
