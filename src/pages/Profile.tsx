import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import cesiLogo from "@/assets/cesi-logo.png";
import { Calendar, Percent, Image as ImageIcon, X, Wand2, FileText } from "lucide-react";

interface Prediction {
  id: number;
  filename: string;
  result: string;
  confidence: number | null;
  prediction_type: string;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  photo_profil: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Champs d’édition
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Pagination
  const [multiPage, setMultiPage] = useState(1);
  const [binaryPage, setBinaryPage] = useState(1);
  const [denoisePage, setDenoisePage] = useState(1);
  const [captioningPage, setCaptioningPage] = useState(1);
  const itemsPerPage = 6;

  // 🔹 Récupération du user depuis le localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser: User = JSON.parse(userData);
        setUser(parsedUser);
        setEditUsername(parsedUser.username);
        setEditEmail(parsedUser.email);
        setPreviewPhoto(parsedUser.photo_profil);
      } catch (error) {
        console.error("Erreur parsing user :", error);
      }
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  // 🔹 Charger les prédictions depuis l'API
  useEffect(() => {
    const fetchPredictions = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`http://127.0.0.1:8000/predictions/user/${user.id}`);
        if (!response.ok) throw new Error("Erreur lors du chargement des prédictions");
        const data = await response.json();
        setPredictions(data || []);
      } catch (error) {
        console.error("Erreur API prédictions :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Chargement du profil...
      </div>
    );
  }

  // Pagination helpers
  const paginate = (items: Prediction[], currentPage: number) => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  const multiclassPredictions = predictions.filter((p) => p.prediction_type === "multiclass");
  const binaryPredictions = predictions.filter((p) => p.prediction_type === "binaire");
  const denoisePredictions = predictions.filter((p) => p.prediction_type === "denoising");
  const captioningPredictions = predictions.filter((p) => p.prediction_type === "captioning");

  const totalMultiPages = Math.ceil(multiclassPredictions.length / itemsPerPage);
  const totalBinaryPages = Math.ceil(binaryPredictions.length / itemsPerPage);
  const totalDenoisePages = Math.ceil(denoisePredictions.length / itemsPerPage);
  const totalCaptioningPages = Math.ceil(captioningPredictions.length / itemsPerPage);

  // 🔹 Gérer la modification du profil
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditPhoto(file);
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    const payload = {
      username: editUsername,
      email: editEmail,
      ...(editPassword && { password: editPassword }),
    };

    try {
      const res = await fetch(`https://artvision-back-production.up.railway.app/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour du profil");

      const updatedUser = await res.json();
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur maj profil :", error);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ================= NAVBAR ================= */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md fixed w-full top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img src={cesiLogo} alt="CESI" className="h-14 object-contain" />
        </div>

        <div className="flex items-center gap-6">
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
          <img
            src={user.photo_profil}
            alt="Profil"
            className="w-14 h-14 rounded-full border-2 border-primary object-cover cursor-pointer"
          />
        </div>
      </nav>

      {/* ================= CONTENU DU PROFIL ================= */}
      <main className="flex-1 pt-32 pb-20 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Informations du user */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={user.photo_profil}
                alt="photo_profil"
                className="w-32 h-32 rounded-full border-4 border-primary object-cover"
              />
              <div>
                <h1 className="text-3xl font-bold mb-1">{user.username}</h1>
                <p className="text-gray-500 mb-3">{user.email}</p>
                <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                  Modifier
                </Button>
              </div>
            </div>
          </div>

          {/* ================= MODAL ================= */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X size={22} />
                </button>

                <h2 className="text-2xl font-semibold mb-4 text-center">Modifier le profil</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Pseudo</label>
                    <input
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
                    <input
                      type="password"
                      placeholder="Laisser vide pour ne pas changer"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Photo de profil</label>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full" />
                    {previewPhoto && (
                      <img
                        src={previewPhoto}
                        alt="preview"
                        className="w-24 h-24 rounded-full mt-3 object-cover border-2 border-primary"
                      />
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleUpdateProfile}>Enregistrer</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PRÉDICTIONS ================= */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">Mes Prédictions</h2>

            {loading ? (
              <p className="text-center text-gray-500">Chargement des prédictions...</p>
            ) : predictions.length > 0 ? (
              <>
                {/* Multiclass */}
                {multiclassPredictions.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold mb-4 text-primary">🎨 Prédictions Multiclass</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {paginate(multiclassPredictions, multiPage).map((p) => (
                        <PredictionCard key={p.id} prediction={p} />
                      ))}
                    </div>
                  </>
                )}

                {/* Binaire */}
                {binaryPredictions.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold mb-4 text-primary">📷 Prédictions Binaires</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {paginate(binaryPredictions, binaryPage).map((p) => (
                        <PredictionCard key={p.id} prediction={p} />
                      ))}
                    </div>
                  </>
                )}

                {/* Denoising */}
                {denoisePredictions.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold mb-4 text-primary">🪄 Débruitage d'Images</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {paginate(denoisePredictions, denoisePage).map((p) => (
                        <PredictionCard key={p.id} prediction={p} />
                      ))}
                    </div>
                  </>
                )}

                {/* Captioning */}
                {captioningPredictions.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold mb-4 text-primary">📝 Prédictions Captioning</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {paginate(captioningPredictions, captioningPage).map((p) => (
                        <PredictionCard key={p.id} prediction={p} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="text-center text-gray-500">Aucune prédiction trouvée.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// ✅ Composant carte de prédiction
const PredictionCard = ({ prediction }: { prediction: Prediction }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <img src={prediction.filename} alt="prediction" className="w-full h-32 object-cover" />
    <div className="p-3">
      <div className="flex items-center gap-2 mb-2">
        {prediction.prediction_type === "denoising" ? (
          <Wand2 className="w-5 h-5 text-primary" />
        ) : prediction.prediction_type === "captioning" ? (
          <FileText className="w-5 h-5 text-primary" />
        ) : (
          <ImageIcon className="w-5 h-5 text-primary" />
        )}
        <p className="font-semibold text-lg">{prediction.result}</p>
      </div>

      {prediction.prediction_type !== "denoising" && (
        <div className="flex items-center text-sm text-gray-600 gap-2">
          <Percent className="w-4 h-4 text-primary" />
          <span>Confiance : {(prediction.confidence! * 100).toFixed(1)}%</span>
        </div>
      )}

      <div className="flex items-center text-sm text-gray-600 gap-2 mt-1">
        <Calendar className="w-4 h-4 text-primary" />
        <span>
          {new Date(prediction.created_at).toLocaleString("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </span>
      </div>
    </div>
  </div>
);

export default Profile;
