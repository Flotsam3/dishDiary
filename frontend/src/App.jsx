import { useState } from "react";
import {
   BrowserRouter as Router,
   Routes,
   Route,
   Link,
   useLocation,
   Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Search from "./pages/Search";
import AddRecipe from "./pages/AddRecipe";
import RecipeDetail from "./pages/RecipeDetail";
import Archive from "./pages/Archive";
import Datenbank from "./pages/Datenbank";
import Auth from "./pages/Auth";
import "./App.css";

function Nav() {
   const location = useLocation();
   const { user, logout } = useAuth();
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const navLinks = [
      { to: "/", label: "Home" },
      { to: "/my-recipes", label: "Meine Rezepte" },
      { to: "/recipe-database", label: "Rezeptdatenbank" },
      ...(user
         ? [
              { to: "/add", label: "Neues Rezept" },
              { to: "/archive", label: "Archiv" },
           ]
         : []),
   ];

   return (
      <nav>
         {/* Hamburger button - only visible on mobile */}
         <button
            className={`lg:hidden absolute right-4 top-4 !bg-transparent z-50 ${
               mobileMenuOpen ? "!text-white" : "!text-gray-800"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
         >
            {mobileMenuOpen ? (
               // X icon when open
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M6 18L18 6M6 6l12 12"
                  />
               </svg>
            ) : (
               // Hamburger icon when closed
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M4 6h16M4 12h16M4 18h16"
                  />
               </svg>
            )}
         </button>

         {/* Nav links - hidden on mobile unless menu is open */}
         <div
            className={`${
               mobileMenuOpen ? "flex" : "hidden"
            } lg:flex flex-col lg:flex-row w-full lg:justify-around absolute lg:relative top-0 lg:top-0 left-0 bg-[#333] pt-4 lg:pt-0`}
         >
            {navLinks.map((link) => (
               <Link
                  key={link.to}
                  to={link.to}
                  style={{ color: location.pathname === link.to ? "orange" : undefined }}
                  onClick={() => setMobileMenuOpen(false)} // Close menu on click
               >
                  {link.label}
               </Link>
            ))}
            {user ? (
               <Link
                  to="/auth"
                  style={{ color: location.pathname === "/auth" ? "orange" : undefined }}
                  className="lg:ml-4"
                  onClick={async (e) => {
                     e.preventDefault();
                     setMobileMenuOpen(false);
                     await logout();
                     window.location.href = "/auth";
                  }}
               >
                  Logout
               </Link>
            ) : (
               <Link
                  to="/auth"
                  style={{ color: location.pathname === "/auth" ? "orange" : undefined }}
                  className="lg:ml-4"
                  onClick={() => setMobileMenuOpen(false)}
               >
                  Login / Register
               </Link>
            )}
         </div>
      </nav>
   );
}

function Layout({ children }) {
   const location = useLocation();
   // hide nav on landing page and auth page
   const hideNavPaths = ["/", "/auth"];
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
