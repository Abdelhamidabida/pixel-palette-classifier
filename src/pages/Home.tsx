import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TeamCard from "@/components/TeamCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroBg from "@/assets/hero-bg-pink.jpg";
import cesiLogo from "@/assets/cesi-logo.png";
import { ArrowRight, Brain, Image as ImageIcon, Sparkles, Wand2 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const teamMembers = [
    { name: "Alice Dupont", role: "Lead Developer" },
    { name: "Thomas Martin", role: "ML Engineer" },
    { name: "Sophie Bernard", role: "UI/UX Designer" },
    { name: "Lucas Petit", role: "Backend Developer" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Intelligence Artificielle</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-secondary via-primary to-primary-glow bg-clip-text text-transparent">
              ArtVision Classifier
            </h1>
            
            <div className="flex justify-center mb-6">
              <img 
                src={cesiLogo} 
                alt="CESI École d'Ingénieurs" 
                className="h-16 md:h-20 object-contain"
              />
            </div>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              ArtVision est une application d'intelligence artificielle permettant de prédire 
              si une image est une photo ou non, et d'identifier sa catégorie artistique 
              <span className="text-primary font-semibold"> (Painting, Photo, Sketch, Text, Schematic)</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="xl" 
                variant="hero"
                onClick={() => navigate("/predict")}
                className="group"
              >
                Commencer la prédiction
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="xl" 
                variant="hero"
                onClick={() => navigate("/denoising")}
                className="group"
              >
                <Wand2 className="w-5 h-5" />
                Débruitage d'image
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="glass-card rounded-2xl p-6 shadow-elegant">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 shadow-glow">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">IA Avancée</h3>
              <p className="text-muted-foreground text-sm">
                Modèles d'apprentissage profond pour une classification précise
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 shadow-elegant">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 shadow-glow">
                <ImageIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multi-Classes</h3>
              <p className="text-muted-foreground text-sm">
                Détection de 5 catégories artistiques différentes
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 shadow-elegant">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 shadow-glow">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Haute Précision</h3>
              <p className="text-muted-foreground text-sm">
                Résultats instantanés avec taux de confiance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Notre Équipe
              </h2>
              <p className="text-muted-foreground">
                Les experts derrière ArtVision Classifier
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <TeamCard key={index} {...member} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
