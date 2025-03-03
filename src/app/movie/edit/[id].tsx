"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditMoviePage() {
  const { id } = useParams(); // Get movie ID from URL
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [poster, setPoster] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const response = await fetch(`http://localhost:5001/api/movies/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch movie");

        const movie = await response.json();
        setTitle(movie.title);
        setYear(movie.publishing_year);
        setPreviewUrl(`http://localhost:5001${movie.poster_url}`); // Set existing image
      } catch (error) {
        console.error("Error fetching movie", error);
      }
    };

    fetchMovie();
  }, [id, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Only PNG and JPEG images are allowed.");
        return;
      }

      setPoster(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("publishing_year", year);
      if (poster) formData.append("poster", poster);

      const response = await fetch(`http://localhost:5001/api/movies/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update movie");

      alert("Movie updated successfully!");
      router.push("/movie");
    } catch (error) {
      alert("Error updating movie");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background text-white">
      <div className="container max-w-4xl bg-card p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Edit Movie</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: File Upload */}
          <div
            className="border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center p-6 h-60 cursor-pointer"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <input id="fileInput" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover rounded-lg" />
            ) : (
              <p className="text-gray-400">Drop an image here or click to select</p>
            )}
          </div>

          {/* Right: Form */}
          <div className="space-y-4">
            <input type="text" placeholder="Title" className="input w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="number" placeholder="Publishing Year" className="input w-full" value={year} onChange={(e) => setYear(e.target.value)} />

            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={() => router.push("/movie")} className="btn-secondary px-6 py-2">
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn-primary px-6 py-2">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
