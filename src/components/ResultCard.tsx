import { Sparkles } from "lucide-react";

interface ResultCardProps {
  prediction: string;
  confidence: number;
  imageUrl: string;
}

const ResultCard = ({ prediction, confidence, imageUrl }: ResultCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 shadow-elegant">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-2">Résultat de la prédiction</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Classe prédite :</span>
              <span className="text-primary font-semibold">{prediction}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Confiance :</span>
              <span className="text-secondary font-semibold">{(confidence * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 rounded-lg overflow-hidden border border-border">
        <img 
          src={imageUrl} 
          alt="Image analysée" 
          className="w-full h-auto object-contain max-h-96"
        />
      </div>
    </div>
  );
};

export default ResultCard;
