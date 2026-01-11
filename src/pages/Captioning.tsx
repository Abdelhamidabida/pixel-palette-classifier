import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import cesiLogo from "@/assets/cesi-logo.png";
import { Upload, MessageSquareText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Captioning = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 🔹 Navbar
  const [photoProfil, setPhotoProfil] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);

  // 🔹 Récupération du user
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        if (parsedUser.photo_profil) setPhotoProfil(parsedUser.photo_profil);
      } catch (error) {
        console.error("Erreur parsing user :", error);
      }
    }
  }, []);

  // 🔹 Fermer le menu si on clique à l’extérieur
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

  // 🔹 Upload image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
      setCaption("");
    }
  };

  // 🔹 Simulation du captioning (plus tard : appel API FastAPI)
  // 🔹 Génération réelle via FastAPI (BLIP)
const handleGenerateCaption = async () => {
  if (!selectedFile) {
    toast({
      title: "Erreur",
      description: "Veuillez sélectionner une image avant de générer une légende.",
      variant: "destructive",
    });
    return;
  }

  if (!user || !user.id) {
    toast({
      title: "Erreur",
      description: "Utilisateur non connecté.",
      variant: "destructive",
    });
    return;
  }

  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("id_user", user.id);
    formData.append("file", selectedFile);
    
    const response = await fetch("http://127.0.0.1:8000/caption", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const data = await response.json();
    console.log("🧠 Réponse API Caption:", data);

    if (data.result) {
      setCaption(data.result);
      toast({
        title: "Succès",
        description: "Légende générée avec succès.",
      });
    } else {
      throw new Error("Pas de résultat de légende trouvé.");
    }
  } catch (error) {
    console.error("Erreur lors du captioning :", error);
    toast({
      title: "Erreur",
      description: "Impossible de générer la légende pour l’instant.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col">
      {/* ================= NAVBAR ================= */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md fixed w-full top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
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

      {/* ================= CONTENU ================= */}
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Captioning d'Image (Rédaction automatique)
            </h1>
            <p className="text-muted-foreground mb-12">
              Téléversez une image et laissez l’IA rédiger une description en français.
            </p>

            {/* Upload Section */}
            <div className="glass-card rounded-2xl p-8 shadow-elegant mb-8">
              <div className="flex flex-col items-center">
                <label htmlFor="file-upload" className="w-full cursor-pointer group">
                  <div className="border-2 border-dashed border-border rounded-xl p-12 text-center transition hover:border-primary/50 hover:bg-card/50">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg mb-4"
                      />
                    ) : (
                      <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground group-hover:text-primary transition" />
                    )}
                    <p className="text-foreground font-medium mb-2">
                      {previewImage ? "Cliquez pour changer l'image" : "Cliquez pour uploader une image"}
                    </p>
                    <p className="text-sm text-muted-foreground">Formats acceptés : PNG, JPG, JPEG</p>
                  </div>
                </label>

                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile && !caption && (
                  <Button
                    onClick={handleGenerateCaption}
                    disabled={loading}
                    variant="hero"
                    size="lg"
                    className="mt-6 min-w-[220px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <MessageSquareText className="w-4 h-4" />
                        Générer la légende
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Résultat */}
            {caption && (
              <div className="glass-card rounded-2xl p-8 shadow-elegant animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">📝 Légende générée :</h2>
                <p className="text-lg text-gray-800 italic max-w-3xl mx-auto">
                  “{caption}”
                </p>
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewImage("");
                      setCaption("");
                    }}
                    variant="outline"
                    size="lg"
                  >
                    Nouvelle image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Captioning;
 