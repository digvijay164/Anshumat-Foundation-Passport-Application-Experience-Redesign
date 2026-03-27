import { Link, useNavigate } from 'react-router-dom';
import { Plane, LogOut, User } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group mr-4">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Plane className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">PassportApp</span>
            </Link>
            
            {/* Main Navigation Links */}
            <div className="hidden sm:flex items-center gap-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md font-medium">Home</Link>
              {user && (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md font-medium">Dashboard</Link>
                  <Link to="/applications" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md font-medium">Applications</Link>
                </>
              )}
              <Link to="/#help" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md font-medium">Help</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 border-l pl-4 ml-2 border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="bg-gray-100 p-1.5 rounded-full">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:inline-block font-medium">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors focus:outline-none"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md font-medium">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
