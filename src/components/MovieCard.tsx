"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import api from "@/utils/api";
import { getTranslator } from "@/utils/i18n";

type Movie = {
  id: number;
  title: string;
  publishing_year: number;
  poster_url: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

//Generate movie poster URL
const getMovieImageUrl = (poster_url: string) => {
  if (!poster_url) return "/placeholder.png";
  return poster_url.startsWith("http")
    ? poster_url
    : `${API_BASE_URL}/uploads/${poster_url.replace(/^\/?uploads\//, "")}`;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [t, setT] = useState<(key: string) => string>(
    () => (key: string) => key
  );
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    async function loadTranslations() {
      const storedLocale = localStorage.getItem("language") || "en";
      setLocale(storedLocale);
      const translator = await getTranslator(storedLocale);
      setT(() => translator);
    }
    loadTranslations();
  }, []);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      try {
        await api.fetchApi(`${API_BASE_URL}/movies/${movie.id}`, {
          method: "DELETE",
        });
        toast.success(t("movieDeleted"));
      } catch (error: any) {
        toast.error(error.message || t("deleteError"));
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (error) => {
      toast.error(error.message || t("deleteError"));
    },
  });

  //show delete confirmation dialog
  const showDeleteConfirmation = () => {
    confirmAlert({
      title: t("confirmDeletion"),
      message: t("deleteMessage").replace("{title}", movie.title),
      buttons: [
        {
          label: t("yesDelete"),
          onClick: () => deleteMutation.mutate(),
          className: "confirm-button",
        },
        {
          label: t("cancel"),
          onClick: () => console.log("Delete canceled"),
          className: "cancel-button",
        },
      ],
      overlayClassName: "custom-overlay",
    });
  };

  return (
    <div className="card p-4 bg-[#0E2A3F] rounded-lg shadow-md flex flex-col items-center justify-between">
      {/* movie poster */}
      <div className="h-[240px] w-full flex items-center justify-center overflow-hidden rounded-md">
        <Image
          src={getMovieImageUrl(movie.poster_url)}
          alt={movie.title}
          width={180}
          height={240}
          style={{ width: "100%", height: "auto" }}
          className="rounded-lg"
          priority={true}
        />
      </div>

    
      {/** Movie Title */}
      <h2 className="text-lg font-bold mt-2 truncate w-full text-center">
        {movie.title}
      </h2>

      {/* Movie year and action buttons */}

      <div className="flex justify-between items-center w-full mt-2">
        <p className="text-gray-400">{movie.publishing_year}</p>
        <div className="flex space-x-4">
          <button
            className="text-blue-400 hover:text-blue-500"
            onClick={() => router.push(`/movie/edit/${movie.id}`)}
            aria-label={t("editMovie")}
          >
            <FaEdit />
          </button>
          <button
            className="text-red-400 hover:text-red-500"
            onClick={showDeleteConfirmation}
            aria-label={t("deleteMovie")}
            disabled={deleteMutation.isPending}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}
