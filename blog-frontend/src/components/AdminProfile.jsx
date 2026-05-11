
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { pageWrapper } from "../styles/common";


import { useEffect, useState } from 'react';
import axios from "axios";

function AdminProfile() {
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/admin/users", { withCredentials: true });
        setUsers(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.log(err)
        setUsers([]);
        setError(err.response?.data?.message || "Failed to fetch users");
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  const deactivateUser = async (id) => {
    try {
      await axios.patch(`/admin/deactivate/${id}`, {}, { withCredentials: true });
      setUsers((prev) => prev.map(u => u._id === id ? { ...u, isUserActive: false } : u));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to deactivate user");
    }
  };

  return (
    <div className={pageWrapper}>
      {/* PROFILE HEADER */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 shadow-sm flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              className="w-16 h-16 rounded-full object-cover border"
              alt="profile"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-xl font-semibold">
              {currentUser?.firstName?.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Name */}
          <div>
            <p className="text-sm text-[#6e6e73]">Welcome back</p>
            <h2 className="text-xl font-semibold text-[#1d1d1f]">{currentUser?.firstName}</h2>
          </div>
        </div>
        {/* LOGOUT */}
        <button
          className="bg-[#ff3b30] text-white text-sm px-5 py-2 rounded-full hover:bg-[#d62c23] transition"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {/* USERS & AUTHORS TABLE */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">All Users & Authors</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="py-2">{user.firstName} {user.lastName}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">{user.role}</td>
                  <td className="py-2">{user.isUserActive ? "Active" : "Inactive"}</td>
                  <td className="py-2">
                    {user.isUserActive ? (
                      <button
                        className="bg-[#ff3b30] text-white px-3 py-1 rounded hover:bg-[#d62c23] text-xs"
                        onClick={() => deactivateUser(user._id)}
                        disabled={user.role === "ADMIN"}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">Deactivated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminProfile