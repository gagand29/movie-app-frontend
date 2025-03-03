"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import { fetchMovies, logout } from "@/utils/api";

type Movie = {
  id: number;
  title: string;
  publishing_year: number;
  poster_url: string;
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    fetchMovies(token)
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to fetch movies. Please login again");
        logout();
        router.push("/login");
      });
  }, [router]);

  const handleAddMovie = () => {
    router.push("/movie/add");
  };

  // Pagination logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Fixed Navbar */}
      <Navbar showAddButton={movies.length > 0} onAddClick={handleAddMovie} />

      <div className="content-container">
        {loading ? (
          <div className="empty-state">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4">Loading your movies...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="empty-state">
            <p className="text-xl font-semibold">Your movie list is empty</p>
            <button className="btn-primary mt-4" onClick={handleAddMovie}>
              Add a new movie
            </button>
          </div>
        ) : (
          <>
            {/* Responsive Movie Grid */}
            <div className="movie-grid">
              {currentMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  className="pagination-button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`pagination-number ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className="pagination-button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
