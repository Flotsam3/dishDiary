// Home.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, Filter, Edit, Printer, Image, Utensils, TrendingUp } from 'lucide-react';
import FeatureImage from '../components/FeatureImage';
import './Home.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/recipes`)
      .then(res => res.json())
      .then(data => setRecipes(data))
      .catch(err => console.error(err));
  }, []);

  const recipesWithImages = recipes.filter(
    r => r.imageUrl && !r.imageUrl.includes('/default-recipe.jpg')
  );

  const features = [
    {
      icon: <Utensils size={32} />,
      title: 'Rezepte erstellen',
      description: 'Erstelle deine eigenen Rezepte mit anpassbaren Portionen, Zutaten und Anweisungen'
    },
    {
      icon: <Image size={32} />,
      title: 'Bilder hinzufügen',
      description: 'Lade appetitliche Fotos deiner Gerichte hoch und mache deine Rezepte lebendig'
    },
    {
      icon: <Star size={32} />,
      title: 'Bewerten & Kommentieren',
      description: 'Bewerte deine Rezepte mit Sternen und füge persönliche Notizen hinzu'
    },
    {
      icon: <Calendar size={32} />,
      title: 'Kochverlauf tracken',
      description: 'Speichere ins Archiv, wann du welches Rezept gekocht hast'
    },
    {
      icon: <Filter size={32} />,
      title: 'Intelligent filtern',
      description: 'Sortiere nach zuletzt gekocht, am häufigsten gekocht oder alphabetisch'
    },
    {
      icon: <Edit size={32} />,
      title: 'Flexibel bearbeiten',
      description: 'Passe deine Rezepte jederzeit an und verbessere sie kontinuierlich'
    },
    {
      icon: <Printer size={32} />,
      title: 'Einfach ausdrucken',
      description: 'Drucke deine Lieblingsrezepte aus für die Küche'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Statistiken',
      description: 'Behalte den Überblick über deine Kochgewohnheiten'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          {/* <div className="hero-badge pacifico-regular">Dish Diary
            <span className="badge-dot"></span>
            Deine digitale Rezeptsammlung
          </div> */}
          <h2 className='pacifico-regular'>Dish Diary</h2>
          <h1 className="hero-title">
            Organisiere deine Rezepte
            <span className="gradient-text"> auf moderne Art</span>
          </h1>
          <p className="hero-subtitle">
            Erstelle, verwalte und teile deine Lieblingsrezepte. 
            Mit intelligenten Funktionen für ambitionierte Hobbyköche.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/auth')}>
              Jetzt starten
            </button>
            <button className="btn btn-secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              Mehr erfahren
            </button>
          </div>
          
          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{recipes.length}</div>
              <div className="stat-label">Rezepte</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">{recipesWithImages.length}</div>
              <div className="stat-label">Mit Bildern</div>
            </div>
          </div>
        </div>

        {/* Hero Visual with FeatureImage */}
        <div className="hero-visual">
          <div className="feature-image-wrapper">
            <img src="feature.jpg" alt="Ein leckeres Dessert" />
            {/* <FeatureImage recipes={recipesWithImages} /> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Alles was du brauchst
              <span className="accent-dot">.</span>
            </h2>
            <p className="section-subtitle">
              Moderne Funktionen für die perfekte Rezeptverwaltung
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              So einfach geht's
              <span className="accent-dot">.</span>
            </h2>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <h3>Rezept erstellen</h3>
              <p>Füge deine Zutaten, Anweisungen und ein Foto hinzu</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">02</div>
              <h3>Kochen & Bewerten</h3>
              <p>Koche das Rezept und bewerte es mit Sternen</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">03</div>
              <h3>Tracken & Optimieren</h3>
              <p>Behalte den Überblick und verbessere deine Rezepte</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Bereit loszulegen?</h2>
          <p>Starte jetzt und bringe Ordnung in deine Rezeptsammlung</p>
          <button className="btn btn-primary btn-large" onClick={() => navigate('/auth')}>
            Kostenlos registrieren
          </button>
        </div>
      </section>
    </div>
  );
}