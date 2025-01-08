import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-6xl font-bold text-pink-500">404</h1>
            <p className="text-2xl mt-4 text-gray-700">Page not found.</p>
            <Link
                to="/"
                className="mt-6 px-6 py-3 bg-pink-300 text-black font-spotify font-semibold rounded hover:bg-pink-400 transition"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
