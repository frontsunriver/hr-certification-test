import { useAuth } from '../../contexts/authProvider';
import Button from '../Button';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full h-16 text-white flex items-center justify-between shadow-md z-50 border-b header-border header-bg-gradient-navigation px-4 backdrop-blur-2xl">
      <nav className="space-x-4"></nav>
      {user && (
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            {/* Name: <strong>{user.username}</strong> */}
            Role: <strong>{user.role}</strong>
          </span>
          <Button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
          >
            Logout
          </Button>
        </div>
      )}
    </header>
  );
}
