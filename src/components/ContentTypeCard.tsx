import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ContentTypeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export const ContentTypeCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  className = "" 
}: ContentTypeCardProps) => {
  return (
    <Card className={`card-gradient shadow-soft hover:shadow-medium transition-all duration-300 group cursor-pointer ${className}`} onClick={onClick}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 transition-colors duration-300">
          <Icon className="w-6 h-6 text-brand-primary" />
        </div>
        <CardTitle className="text-content-primary font-display">{title}</CardTitle>
        <CardDescription className="text-content-secondary">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button variant="content" className="w-full group-hover:bg-brand-accent group-hover:text-brand-primary transition-all duration-300">
          Create {title}
        </Button>
      </CardContent>
    </Card>
  );
};