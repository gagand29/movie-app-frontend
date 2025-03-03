import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

type Movie = {
  id: number;
  title: string;
  publishing_year: number;
  poster_url: string;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${movie.title}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Unauthorized");

      const response = await fetch(`http://localhost:5001/api/movies/${movie.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete movie");

      alert("Movie deleted successfully!");
      window.location.reload();  // ✅ Refresh page after delete
    } catch (error) {
      alert("Error deleting movie");
    }
  };

  // Make sure the image URL is properly formatted
  const imageUrl = movie.poster_url.startsWith('http') 
    ? movie.poster_url 
    : `http://localhost:5001/${movie.poster_url.replace(/^\/+/, '')}`;

  return (
    <div className="card">
      {/* Image Container */}
      <div className="h-[240px] w-full flex items-center justify-center overflow-hidden rounded-md">
        <Image
          src={imageUrl}
          alt={movie.title}
          width={180}
          height={160}
          className="object-cover w-full h-full"
          priority={false}
          loading="lazy"
        />
      </div>

      {/* Title with ellipsis for long titles */}
      <h2 className="text-lg font-bold mt-0 truncate">{movie.title}</h2>

      {/* Year & Icons in the same row */}
      <div className="flex justify-between items-center mt-0">
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
            onClick={handleDelete}
            aria-label="Delete movie"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}