import { User } from "lucide-react";

interface TeamCardProps {
  name: string;
  role: string;
  image?: string;
}

const TeamCard = ({ name, role, image }: TeamCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 shadow-elegant transition-smooth hover:scale-105 hover:shadow-glow">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mb-4 shadow-glow">
          {image ? (
            <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-primary-foreground" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
};

export default TeamCard;
