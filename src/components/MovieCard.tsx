"use client";

import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmAlert } from "react-confirm-alert"; 
import "react-confirm-alert/src/react-confirm-alert.css"; 
import api from "@/utils/api"; // Import global API instance

type Movie = {
  id: number;
  title: string;
  publishing_year: number;
  poster_url: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Function to get the correct image URL
const getMovieImageUrl = (poster_url: string) => {
  if (!poster_url) return "/placeholder.png"; // Show a placeholder if no image exists
  return poster_url.startsWith("http")
    ? poster_url
    : `${API_BASE_URL}/uploads/${poster_url.replace(/^\/?uploads\//, "")}`;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  const router = useRouter();
  const queryClient = useQueryClient(); // React Query client for refetching

  // Handle Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      try {
        await api.fetchApi(`${API_BASE_URL}/movies/${movie.id}`, {
          method: "DELETE",
        });

        toast.success("Movie deleted successfully!");
      } catch (error: any) {
        toast.error(error.message || "Error deleting movie.");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] }); // Trigger a refetch of movies after deletion
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting movie.");
    },
  });

  // Custom Delete Confirmation Modal
  const showDeleteConfirmation = () => {
    confirmAlert({
      title: "Confirm Deletion",
      message: `Are you sure you want to delete "${movie.title}"?`,
      buttons: [
        {
          label: "Yes, Delete",
          onClick: () => deleteMutation.mutate(),
          className: "confirm-button",
        },
        {
          label: "Cancel",
          onClick: () => console.log("Delete canceled"),
          className: "cancel-button",
        },
      ],
      overlayClassName: "custom-overlay",
    });
  };

  return (
    <div className="card">
      {/* Image Container */}
      <div className="h-[240px] w-full flex items-center justify-center overflow-hidden rounded-md">
        <Image
          src={getMovieImageUrl(movie.poster_url)}
          alt={movie.title}
          width={180}
          height={160}
          className="object-cover w-full h-full"
          loading="lazy"
          priority={false}
        />
      </div>

      {/* Movie Title */}
      <h2 className="text-lg font-bold mt-2 truncate">{movie.title}</h2>

      {/* Movie Year & Actions */}
      <div className="flex justify-between items-center mt-2">
        <p className="text-gray-400">{movie.publishing_year}</p>
        <div className="flex space-x-4">
          <button
            className="text-blue-400 hover:text-blue-500"
            onClick={() => router.push(`/movie/edit/${movie.id}`)}
            aria-label="Edit movie"
          >
            <FaEdit />
          </button>
          <button
            className="text-red-400 hover:text-red-500"
            onClick={showDeleteConfirmation}
            aria-label="Delete movie"
            disabled={deleteMutation.isPending}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}
