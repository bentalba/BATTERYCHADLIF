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
      className="glass-card p-8 hover-lift text-center transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  );
};

export default ValueCard;
