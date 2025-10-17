import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Upload, Wand2, Loader2, Download } from "lucide-react";

const Denoising = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [denoisedImage, setDenoisedImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setDenoisedImage("");
    }
  };

  const handleDenoise = async () => {
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
      // TODO: Remplacer par l'appel réel à l'API de denoising quand le modèle sera prêt
      // const formData = new FormData();
      // formData.append('file', selectedFile);
      // const response = await fetch('YOUR_API_URL', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // setDenoisedImage(data.denoisedImage);
      
      // Simulation pour le moment
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDenoisedImage(originalImage); // Placeholder
      
      toast({
        title: "Denoising réussi",
        description: "L'image a été traitée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter l'image. Le modèle n'est pas encore disponible.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (denoisedImage) {
      const link = document.createElement('a');
      link.href = denoisedImage;
      link.download = 'denoised-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Denoising d'Image par IA
              </h1>
              <p className="text-muted-foreground">
                Améliorez la qualité de vos images en réduisant le bruit
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
                      {originalImage ? "Cliquez pour changer l'image" : "Cliquez pour uploader une image"}
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
                        Appliquer le Denoising
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Comparison Section */}
            {denoisedImage && (
              <div className="animate-fade-in">
                <div className="glass-card rounded-2xl p-8 shadow-elegant">
                  <h2 className="text-2xl font-bold mb-6 text-center">Comparaison</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-center">Image Originale</h3>
                      <div className="rounded-lg overflow-hidden border border-border">
                        <img 
                          src={originalImage} 
                          alt="Original" 
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-center">Image Améliorée</h3>
                      <div className="rounded-lg overflow-hidden border border-border">
                        <img 
                          src={denoisedImage} 
                          alt="Denoised" 
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 justify-center mt-6">
                    <Button
                      onClick={handleDownload}
                      variant="hero"
                      size="lg"
                    >
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
