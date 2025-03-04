"use client";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";

// Logout Utility Function
const logoutUser = (router: any) => {
  localStorage.removeItem("token");
  toast.success("Logged out successfully");
  router.push("/login");
};

export default function Navbar({
  showAddButton,
  onAddClick,
}: {
  showAddButton: boolean;
  onAddClick: () => void;
}) {
  const router = useRouter();

  return (
    <nav className="navbar">
      <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center">
        {/*  Left Side - My Movies Title */}
        <h1 className="navbar-title text-2xl font-bold flex items-center">
          My Movies
          {showAddButton && (
            <FaPlusCircle
              className="ml-3 navbar-icon text-lg cursor-pointer hover:text-gray-400"
              onClick={onAddClick}
              aria-label="Add new movie"
            />
          )}
        </h1>

        {/*  Right Side - Logout Button */}
        <button
          className="flex items-center text-white text-lg hover:text-gray-400"
          onClick={() => logoutUser(router)}
          aria-label="Logout"
        >
          Logout <FiLogOut className="ml-2 navbar-icon" />
        </button>
      </div>
    </nav>
  );
}
