import { useState } from "react";
import { Button } from "@/components/ui/button";
import ResultCard from "@/components/ResultCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { predictBinary, predictMulticlass, PredictionResponse } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileImage, Loader2 } from "lucide-react";

const Predict = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handlePredict = async (type: 'binary' | 'multiclass') => {
    if (!selectedFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const prediction = type === 'binary' 
        ? await predictBinary(selectedFile)
        : await predictMulticlass(selectedFile);
      
      setResult(prediction);
      toast({
        title: "Prédiction réussie",
        description: `Classe prédite : ${prediction.prediction}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de contacter l'API. Vérifiez que le serveur est lancé.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Analyse d'image par IA
              </h1>
              <p className="text-muted-foreground">
                Uploadez une image pour découvrir sa classification
              </p>
            </div>

            {/* Upload Section */}
            <div className="glass-card rounded-2xl p-8 shadow-elegant mb-8">
              <div className="flex flex-col items-center">
                <label 
                  htmlFor="file-upload" 
                  className="w-full cursor-pointer group"
                >
                  <div className="border-2 border-dashed border-border rounded-xl p-12 text-center transition-smooth hover:border-primary/50 hover:bg-card/50">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded-lg mb-4"
                      />
                    ) : (
                      <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-smooth" />
                    )}
                    <p className="text-foreground font-medium mb-2">
                      {imagePreview ? "Cliquez pour changer l'image" : "Cliquez pour uploader une image"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG, JPEG jusqu'à 10MB
                    </p>
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile && (
                  <div className="flex gap-4 mt-6 w-full justify-center">
                    <Button
                      onClick={() => handlePredict('binary')}
                      disabled={loading}
                      variant="hero"
                      size="lg"
                      className="flex-1 max-w-xs"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileImage className="w-4 h-4" />
                      )}
                      Photo ou Non-photo
                    </Button>
                    <Button
                      onClick={() => handlePredict('multiclass')}
                      disabled={loading}
                      variant="outline"
                      size="lg"
                      className="flex-1 max-w-xs"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileImage className="w-4 h-4" />
                      )}
                      Identifier la catégorie
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            {result && imagePreview && (
              <div className="animate-fade-in">
                <ResultCard
                  prediction={result.prediction}
                  confidence={result.confidence}
                  imageUrl={imagePreview}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Predict;
