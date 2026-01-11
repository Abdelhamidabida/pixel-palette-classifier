export interface PredictionResponse {
  prediction: string; // ex: "Photo", "Sketch", etc.
  confidence: number;
  filename?: string; // URL Cloudinary renvoyée par ton backend
}

const API_BASE_URL = "http://127.0.0.1:8000"; // ⚙️ Ton backend FastAPI

// =====================================================
// 🔹 Fonction commune pour les prédictions
// =====================================================
const createPrediction = async (
  file: File,
  id_user: number,
  prediction_type: "binaire" | "multiclass"
): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append("id_user", id_user.toString());
  formData.append("prediction_type", prediction_type);
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/predictions/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur lors de la prédiction: ${errorText}`);
  }

  const data = await response.json();

  // Adapter à ton modèle FastAPI (PredictionResponse)
  return {
    prediction: data.result,       // ton backend renvoie "result"
    confidence: data.confidence,   // ton backend renvoie "confidence"
    filename: data.filename        // lien Cloudinary
  };
};

// =====================================================
// 🔹 Prédiction binaire : Photo / Non-photo
// =====================================================
export const predictBinary = async (
  file: File,
  id_user: number
): Promise<PredictionResponse> => {
  return await createPrediction(file, id_user, "binaire");
};

// =====================================================
// 🔹 Prédiction multi-classes : Catégorie artistique
// =====================================================
export const predictMulticlass = async (
  file: File,
  id_user: number
): Promise<PredictionResponse> => {
  return await createPrediction(file, id_user, "multiclass");
};
