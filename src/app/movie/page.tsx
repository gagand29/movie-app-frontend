"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "react-toastify";

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
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;
  const router = useRouter();

  //Fetch movies using React Query (No need to pass token)
  const { data: movies = [], isLoading, error }: UseQueryResult<Movie[], Error> = useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies, // ✅ No manual token handling
  });

  //Handle API errors properly
  useEffect(() => {
    if (error) {
      const errorMessage = error.message || "";
      
      if (errorMessage.includes("Unauthorized") || errorMessage.includes("Token expired")) {
        toast.error("Session expired. Please login again.");
        logout();
        router.push("/login");
      } else {
        toast.error("Failed to fetch movies. Please try again.");
      }
    }
  }, [error, router]);

  const handleAddMovie = () => router.push("/movie/add");

  //Memoized Pagination logic for better performance
  const paginatedMovies = useMemo(() => {
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    return movies.slice(indexOfFirstMovie, indexOfLastMovie);
  }, [movies, currentPage]);

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Navbar */}
      <Navbar showAddButton={movies.length > 0} onAddClick={handleAddMovie} />

      <div className="content-container">
        {isLoading ? (
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
            {/* Movie Grid */}
            <div className="movie-grid">
              {paginatedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button className="pagination-button" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                  ⏪ First
                </button>
                <button className="pagination-button" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                  Prev
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`pagination-number ${currentPage === index + 1 ? "active" : ""}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button className="pagination-button" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                  Next
                </button>
                <button className="pagination-button" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                  Last ⏩
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
