import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Search from './pages/Search';
import AddRecipe from './pages/AddRecipe';
import RecipeDetail from './pages/RecipeDetail';
import Archive from './pages/Archive';
import Datenbank from './pages/Datenbank';
import Auth from './pages/Auth';
import './App.css';

function Nav() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/my-recipes', label: 'Meine Rezepte' },
    { to: '/recipe-database', label: 'Rezeptdatenbank' },
    ...(user ? [
      { to: '/add', label: 'Neues Rezept' },
      { to: '/archive', label: 'Archiv' },
    ] : [])
  ];
  return (
    <nav>
      {navLinks.map(link => (
        <Link
          key={link.to}
          to={link.to}
          style={{ color: location.pathname === link.to ? 'orange' : undefined }}
        >
          {link.label}
        </Link>
      ))}
      {user ? (
        <Link
          to="/auth"
          style={{ color: location.pathname === '/auth' ? 'orange' : undefined }}
          className="ml-4"
          onClick={async (e) => {
            e.preventDefault();
            await logout();
            window.location.href = '/auth';
          }}
        >
          Logout
        </Link>
      ) : (
        <>
          <Link
            to="/auth"
            style={{ color: location.pathname === '/auth' ? 'orange' : undefined }}
            className="ml-4"
          >
            Login / Register
          </Link>
        </>
      )}
    </nav>
  );
}

function Layout({ children }) {
  const location = useLocation();
  // hide nav on landing page and auth page
  const hideNavPaths = ['/', '/auth'];
  return (
    <>
      {!hideNavPaths.includes(location.pathname) && <Nav />}
      {children}
    </>
  );
}

function App() {
  const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/auth" />;
  };

  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-recipes" element={<Search />} />
            <Route path="/recipe-database" element={<Datenbank />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/add" 
              element={
                <PrivateRoute>
                  <AddRecipe />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/archive" 
              element={
                <PrivateRoute>
                  <Archive />
                </PrivateRoute>
              } 
            />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
          </Routes>
        </Layout>
        <footer>
          <p>&copy; {new Date().getFullYear()} Dish Diary</p>
        </footer>
      </AuthProvider>
    </Router>
  );
}

export default App;
