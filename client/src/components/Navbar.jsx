import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">🎯</span>
        <span className="font-semibold text-gray-900 text-lg">JobTrackr</span>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Hi, {user.name.split(' ')[0]}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
