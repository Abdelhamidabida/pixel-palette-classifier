import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Brain } from "lucide-react";

const API_URL = "http://127.0.0.1:8000"; // Ton backend FastAPI local

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // =============================
  // 🚀 Connexion / Inscription
  // =============================
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // ========== 🔹 Connexion ==========
        const params = new URLSearchParams();
        params.append("grant_type", "password");
        params.append("username", email);
        params.append("password", password);

        const res = await axios.post(`${API_URL}/login`, params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const data = res.data;

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast({
          title: "Connexion réussie ✅",
          description: `Bienvenue ${data.user.username || ""}`,
        });

        navigate("/");
      } else {
        // ========== 🧾 Inscription ==========
        const formData = new FormData();
        formData.append("username", pseudo);
        formData.append("email", email);
        formData.append("password", password);
        if (photo) {
          formData.append("photo_profil", photo);
        }

        const res = await axios.post(`${API_URL}/users/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const createdUser = res.data;

        console.log("✅ Inscription réussie :", createdUser);

        toast({
          title: "Inscription réussie 🎉",
          description: `Bienvenue ${createdUser.username}`,
        });

        // Sauvegarde du nouvel utilisateur
        localStorage.setItem("user", JSON.stringify(createdUser));

        // Redirection vers la page d'accueil
        navigate("/");
      }
    } catch (err: any) {
      console.error("❌ Erreur :", err.response?.data || err.message);

      let message = "Une erreur est survenue";
      const detail = err.response?.data?.detail;

      if (typeof detail === "string") message = detail;
      else if (Array.isArray(detail))
        message = detail.map((d) => d.msg).join(" | ");
      else if (err.message) message = err.message;

      toast({
        title: "Erreur ❌",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🖼️ Preview photo de profil
  // =============================
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 py-24 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? "Connexion" : "Inscription"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Connectez-vous à votre compte"
                : "Créez votre compte ArtVision"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {/* Champs visibles uniquement à l'inscription */}
              {!isLogin && (
                <>
                  {/* Pseudo */}
                  <div className="space-y-2">
                    <Label htmlFor="pseudo">Pseudo</Label>
                    <Input
                      id="pseudo"
                      type="text"
                      placeholder="Entrez votre pseudo"
                      value={pseudo}
                      onChange={(e) => setPseudo(e.target.value)}
                      required
                    />
                  </div>

                  {/* Photo de profil */}
                  <div className="space-y-2">
                    <Label htmlFor="photo">Photo de profil</Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover mt-3 mx-auto border-2 border-primary"
                      />
                    )}
                  </div>
                </>
              )}

              {/* Bouton principal */}
              <Button
                type="submit"
                variant="hero"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? "Chargement..."
                  : isLogin
                  ? "Se connecter"
                  : "S'inscrire"}
              </Button>
            </form>

            {/* Switch Connexion / Inscription */}
            <div className="mt-4 text-center text-sm">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
              >
                {isLogin
                  ? "Pas encore de compte ? S'inscrire"
                  : "Déjà un compte ? Se connecter"}
              </button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
