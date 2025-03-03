"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function AddMoviePage() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [poster, setPoster] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Allow only JPEG & PNG files
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Only PNG and JPEG images are allowed.");
        return;
      }

      setPoster(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a preview
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      // Allow only JPEG & PNG files
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Only PNG and JPEG images are allowed.");
        return;
      }

      setPoster(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in");
      return router.push("/login");
    }

    if (!title || !year || !poster) {
      alert("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("publishing_year", year);
    if (poster) {
      formData.append("poster", poster);
    }

    try {
      const response = await fetch("http://localhost:5001/api/movies", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add movie");
      }

      alert("Movie added successfully!");
      router.push("/movie");
    } catch (error) {
      alert("Error adding movie");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background text-white">

     {/* Background wave effect */}
     <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden">
        <svg className="w-full" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.2" d="M0 100L48 108.3C96 116.7 192 133.3 288 133.3C384 133.3 480 116.7 576 100C672 83.3 768 66.7 864 75C960 83.3 1056 116.7 1152 125C1248 133.3 1344 116.7 1392 108.3L1440 100V200H0V100Z" fill="#1E5470"/>
          <path opacity="0.4" d="M0 120L48 125C96 130 192 140 288 140C384 140 480 130 576 120C672 110 768 100 864 105C960 110 1056 130 1152 135C1248 140 1344 130 1392 125L1440 120V200H0V120Z" fill="#1E5470"/>
        </svg>
      </div>

      <div className="container max-w-4xl bg-card p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Create a new movie</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side: File upload */}
          <div
            className="border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center p-6 h-60 cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()} // Prevent default behavior
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover rounded-lg" />
            ) : (
              <p className="text-gray-400">Drop an image here or click to select</p>
            )}
          </div>

          {/* Right side: Form inputs */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="input w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Publishing Year"
              className="input w-full"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />

            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={() => router.push("/movie")} className="btn-secondary px-6 py-2">
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn-primary px-6 py-2">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
