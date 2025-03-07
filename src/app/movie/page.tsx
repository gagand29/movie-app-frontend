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

  // Fetch movies using React Query
  const { data: movies = [], isLoading, error }: UseQueryResult<Movie[], Error> = useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  });

  // Handle API errors
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

  // Memoized Pagination Logic
  const paginatedMovies = useMemo(() => {
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    return movies.slice(indexOfFirstMovie, indexOfLastMovie);
  }, [movies, currentPage]);

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Navbar (Handles Language Selector) */}
      <Navbar showAddButton={movies.length > 0} onAddClick={handleAddMovie} />

      <div className="content-container max-w-[1200px] mx-auto p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg">Loading your movies...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-xl font-semibold">Your movie list is empty</p>
            <button
              className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
              onClick={handleAddMovie}
            >
              Add a new movie
            </button>
          </div>
        ) : (
          <>
            {/* Movie Grid */}
            <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {paginatedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            </div>
            

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 mt-8">
                <button
                  className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  ⏪ First
                </button>
                <button
                  className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`px-3 py-2 rounded-md transition ${
                      currentPage === index + 1
                        ? "bg-green-500 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
                <button
                  className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
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
