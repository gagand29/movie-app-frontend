"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function EditMoviePage() {
  const { id } = useParams(); //  Get movie ID from URL
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [poster, setPoster] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading State

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const token = sessionStorage.getItem("token"); // sessionStorage
        if (!token) return router.push("/login");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch movie");

        const movie = await response.json();
        setTitle(movie.title);
        setYear(movie.publishing_year);
        setPreviewUrl(`${process.env.NEXT_PUBLIC_API_URL}${movie.poster_url}`);
      } catch (error: any) {
        toast.error("Error fetching movie.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, router]);

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Only PNG and JPEG images are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB.");
        return;
      }

      setPoster(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return router.push("/login");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("publishing_year", year);
      if (poster) formData.append("poster", poster);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update movie");

      toast.success("Movie updated successfully!");
      router.push("/movie");
    } catch (error: any) {
      toast.error(error.message || "Error updating movie.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background text-white">
      {loading ? (
        <p className="text-white text-lg">Loading...</p>
      ) : (
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
              <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input type="number" placeholder="Publishing Year" value={year} onChange={(e) => setYear(e.target.value)} />

              <div className="flex justify-end space-x-4 mt-4">
                <Button onClick={() => router.push("/movie")} variant="secondary">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} variant="primary">
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
