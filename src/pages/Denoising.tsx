import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import cesiLogo from "@/assets/cesi-logo.png";
import { Upload, Wand2, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Denoising = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [denoisedImage, setDenoisedImage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 🔹 Navbar
  const [photoProfil, setPhotoProfil] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 🔹 Récupération du user
  const [user, setUser] = useState<any>(null);

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

  // 🔹 Gestion de l’upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setOriginalImage(reader.result as string);
      reader.readAsDataURL(file);
      setDenoisedImage("");
    }
  };

  // 🔹 Appel réel à l’API FastAPI
  const handleDenoise = async () => {
    if (!selectedFile || !user) {
      toast({
        title: "Erreur",
        description: "Veuillez vous connecter et sélectionner une image.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("id_user", user.id);
    formData.append("prediction_type", "denoising");
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/predictDenoising", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors du débruitage");

      const data = await response.json();
      console.log("✅ Réponse du backend :", data);

      setDenoisedImage(data.filename); // Cloudinary URL renvoyée
      toast({
        title: "Succès",
        description: "L'image a été débruitée avec succès.",
      });
    } catch (error) {
      console.error("❌ Erreur API :", error);
      toast({
        title: "Erreur",
        description: "Impossible de contacter le serveur.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!denoisedImage) return;

    try {
      const response = await fetch(denoisedImage);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "denoised-image.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("❌ Erreur lors du téléchargement :", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ================= NAVBAR ================= */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md fixed w-full top-0 z-50">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
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

          {/* 🔹 Nouveau bouton Captioning */}
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

      {/* ================= CONTENU PRINCIPAL ================= */}
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Débruitage d'Image par IA
              </h1>
              <p className="text-muted-foreground">
                Améliorez la qualité de vos images en réduisant le bruit.
              </p>
            </div>

            {/* Upload Section */}
            <div className="glass-card rounded-2xl p-8 shadow-elegant mb-8">
              <div className="flex flex-col items-center">
                <label htmlFor="file-upload" className="w-full cursor-pointer group">
                  <div className="border-2 border-dashed border-border rounded-xl p-12 text-center transition-smooth hover:border-primary/50 hover:bg-card/50">
                    {originalImage ? (
                      <img
                        src={originalImage}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg mb-4"
                      />
                    ) : (
                      <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-smooth" />
                    )}
                    <p className="text-foreground font-medium mb-2">
                      {originalImage
                        ? "Cliquez pour changer l'image"
                        : "Cliquez pour uploader une image"}
                    </p>
                    <p className="text-sm text-muted-foreground">PNG, JPG, JPEG jusqu'à 10MB</p>
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile && !denoisedImage && (
                  <Button
                    onClick={handleDenoise}
                    disabled={loading}
                    variant="hero"
                    size="lg"
                    className="mt-6 min-w-[200px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Appliquer le Débruitage
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Résultat */}
            {denoisedImage && (
              <div className="animate-fade-in">
                <div className="glass-card rounded-2xl p-8 shadow-elegant">
                  <h2 className="text-2xl font-bold mb-6 text-center">Résultat du débruitage</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-center">Image Originale</h3>
                      <img src={originalImage} alt="Original" className="rounded-lg border" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-center">Image Débruitée</h3>
                      <img src={denoisedImage} alt="Denoised" className="rounded-lg border" />
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center mt-6">
                    <Button onClick={handleDownload} variant="hero" size="lg">
                      <Download className="w-4 h-4" />
                      Télécharger l'image
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedFile(null);
                        setOriginalImage("");
                        setDenoisedImage("");
                      }}
                      variant="outline"
                      size="lg"
                    >
                      Nouvelle image
                    </Button>
                  </div>
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

export default Denoising;
