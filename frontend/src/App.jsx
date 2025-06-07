import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Search from './pages/Search';
import AddRecipe from './pages/AddRecipe';
import RecipeDetail from './pages/RecipeDetail';
import Archive from './pages/Archive';
import './App.css';

function Nav() {
  const location = useLocation();
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Suche' },
    { to: '/add', label: 'Neues Rezept' },
    { to: '/archive', label: 'Archiv' },
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
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/add" element={<AddRecipe />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
      </Routes>
      <footer>
        <p>&copy; {new Date().getFullYear()} Dish Diary</p>
      </footer>
    </Router>
  );
}

export default App;
