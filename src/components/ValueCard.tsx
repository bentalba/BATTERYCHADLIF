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
      className="relative p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 group hover:-translate-y-1 overflow-hidden"
      style={{ animationDelay: `${delay}ms`, animation: 'fadeInUp 0.6s ease-out both' }}
    >
      {/* Electric pulse background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0071E3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Power surge line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0071E3] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
      
      <div className="relative z-10">
        {/* Icon Container with electric effect */}
        <div className="relative inline-flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-[#0071E3]/10 group-hover:bg-[#0071E3] transition-all duration-300 group-hover:animate-electric-pulse">
          <Icon className="w-6 h-6 text-[#0071E3] group-hover:text-white transition-colors duration-300 group-hover:animate-lightning" />
          
          {/* Spark dots */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF6B00] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-charging-spark" />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#0071E3] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-charging-spark" style={{ animationDelay: '0.5s' }} />
        </div>

        <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>
    </Card>
  );
};

export default ValueCard;
