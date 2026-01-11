import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import TeamCard from "@/components/TeamCard";
import Footer from "@/components/Footer";
import heroBg from "@/assets/hero-bg-pink.jpg";
import cesiLogo from "@/assets/cesi-logo.png";
import {
  ArrowRight,
  Brain,
  Wand2,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import aminePhoto from "@/assets/amine.jpg";
import azizPhoto from "@/assets/Aziz.jpg";
import hamidouPhoto from "@/assets/hamidou.jpg";
import AhmedP from "@/assets/ahmadP.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [photoProfil, setPhotoProfil] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.photo_profil) {
          setPhotoProfil(parsedUser.photo_profil);
        }
      } catch (error) {
        console.error("Erreur parsing user :", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/auth");
    window.location.reload();
  };

  const teamMembers = [
    { name: "ELBAH Amine", image: aminePhoto },
    { name: "FRITIS Aziz", image: azizPhoto },
    { name: "ABIDA Abdelhamid", image: hamidouPhoto },
    { name: "DIAB Ahmad", image: AhmedP },
  ];

  return (
    <div className="min-h-screen">
      {/* ================= NAVBAR ================= */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md fixed w-full top-0 z-50">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <img src={cesiLogo} alt="CESI" className="h-14 object-contain" />
        </div>

        <div className="flex items-center gap-6 relative">
          <Button
            variant="outline"
            onClick={() => navigate("/predict")}
            className="hover:bg-primary hover:text-white transition"
          >
            Prédiction
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/denoising")}
            className="hover:bg-primary hover:text-white transition"
          >
            Débruitage
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/captioning")}
            className="hover:bg-primary hover:text-white transition"
          >
            Captioning
          </Button>

          {photoProfil ? (
            <div className="relative" ref={menuRef}>
              <img
                src={photoProfil}
                alt="Profil"
                className="w-14 h-14 rounded-full border-2 border-primary cursor-pointer object-cover hover:scale-105 transition-transform"
                onClick={() => setShowMenu((prev) => !prev)}
              />

              {showMenu && (
                <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-xl"
                  >
                    Mon profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-xl"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button onClick={() => navigate("/auth")}>Se connecter</Button>
          )}
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-12 overflow-hidden"> {/* ⬅️ Réduction du padding bas */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Intelligence Artificielle
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-secondary via-primary to-primary-glow bg-clip-text text-transparent">
              ArtVision Classifier
            </h1>

            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              ArtVision est une application d'intelligence artificielle
              permettant de prédire, débruiter et décrire automatiquement des
              images grâce à des modèles avancés.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap mb-4">
              <Button
                size="xl"
                variant="hero"
                onClick={() => navigate("/predict")}
                className="group"
              >
                Commencer la prédiction
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="xl"
                variant="hero"
                onClick={() => navigate("/denoising")}
                className="group"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Débruitage d'image
              </Button>

              <Button
                size="xl"
                variant="hero"
                onClick={() => navigate("/captioning")}
                className="group"
              >
                <MessageSquareText className="w-5 h-5 mr-2" />
                Captioning d'image
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="pt-6 pb-20"> {/* ⬅️ Réduction de l’espace haut */}
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

            {/* 🔹 Prédiction d'image */}
            <div className="glass-card rounded-2xl p-6 shadow-elegant hover:shadow-primary/20 transition-shadow">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 shadow-glow">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Prédiction d'image</h3>
              <p className="text-muted-foreground text-sm">
                Analyse intelligente permettant d’identifier la nature et le
                style artistique d’une image (peinture, photo, croquis, texte, etc.).
              </p>
            </div>

            {/* 🔹 Débruitage d'image */}
            <div className="glass-card rounded-2xl p-6 shadow-elegant hover:shadow-primary/20 transition-shadow">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 shadow-glow">
                <Wand2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Débruitage d'image</h3>
              <p className="text-muted-foreground text-sm">
                Nettoyage automatique des images pour supprimer le bruit visuel et
                améliorer la clarté et la netteté grâce à un modèle d’IA dédié.
              </p>
            </div>

            {/* 🔹 Captioning d'image */}
            <div className="glass-card rounded-2xl p-6 shadow-elegant hover:shadow-primary/20 transition-shadow">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 shadow-glow">
                <MessageSquareText className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Captioning d'image</h3>
              <p className="text-muted-foreground text-sm">
                Génération automatique de descriptions en français à partir
                d’images, permettant de comprendre le contenu visuel de manière textuelle.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= TEAM SECTION ================= */}
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
