import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import cesiLogo from "@/assets/cesi-logo.png";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={cesiLogo} 
              alt="CESI - ArtVision Classifier" 
              className="h-10 md:h-12 object-contain transition-smooth group-hover:scale-105"
            />
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
            <Link 
              to="/denoising" 
              className="text-muted-foreground hover:text-foreground transition-smooth"
            >
              Débruitage
            </Link>
            
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            ) : (
              <Button
                variant="hero"
                size="sm"
                onClick={() => navigate("/auth")}
              >
                Connexion
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
