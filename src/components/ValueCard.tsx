import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const ValueCard = ({ icon: Icon, title, description, delay = 0 }: ValueCardProps) => {
  return (
    <Card 
      className="glass-card-premium p-8 hover-lift hover-glow-blue text-center transition-all duration-300 relative overflow-hidden group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500" />
      <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-primary/10 group-hover:scale-110 transition-transform duration-300">
        <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
        <Icon className="w-8 h-8 text-primary relative z-10" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  );
};

export default ValueCard;
