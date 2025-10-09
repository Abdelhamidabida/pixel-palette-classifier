import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Brain } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow transition-smooth group-hover:scale-110">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              ArtVision Classifier
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="text-muted-foreground hover:text-foreground transition-smooth"
            >
              Accueil
            </Link>
            <Link 
              to="/predict" 
              className="text-muted-foreground hover:text-foreground transition-smooth"
            >
              Prédiction
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
