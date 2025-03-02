import React from "react";

interface MovieCardProps {
  title: string;
  year: number;
  imageUrl: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, year, imageUrl }) => {
  return (
    <div className="card">
      <img src={imageUrl} alt={title} className="w-full h-40 object-cover rounded-md" />
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-gray-400">{year}</p>
    </div>
  );
};

export default MovieCard;
