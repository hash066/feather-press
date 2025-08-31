import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { LucideIcon, Heart, MessageCircle, Eye, Share2 } from "lucide-react";
import { useState } from "react";

interface ContentTypeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export const InteractiveContentCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  className = "" 
}: ContentTypeCardProps) => {
  const [enableComments, setEnableComments] = useState(true);
  const [enableLikes, setEnableLikes] = useState(true);
  const [enableViews, setEnableViews] = useState(true);
  const [enableShare, setEnableShare] = useState(true);

  return (
    <Card className={`card-gradient shadow-soft hover:shadow-medium transition-all duration-500 group cursor-pointer animate-fade-in hover-scale ${className}`} onClick={onClick}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 transition-all duration-500 animate-float">
          <Icon className="w-6 h-6 text-brand-primary group-hover:scale-110 transition-transform duration-300" />
        </div>
        <CardTitle className="text-content-primary font-display group-hover:text-brand-primary transition-colors duration-300">{title}</CardTitle>
        <CardDescription className="text-content-secondary">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Interactive Features Toggle */}
        <div className="space-y-3 p-4 bg-content-subtle/30 rounded-lg border border-content-subtle">
          <h4 className="text-sm font-medium text-content-primary mb-3">Interactive Features</h4>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-content-secondary" />
              <span className="text-sm text-content-secondary">Likes</span>
            </div>
            <Switch 
              checked={enableLikes} 
              onCheckedChange={setEnableLikes}
              className="data-[state=checked]:bg-brand-accent"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-content-secondary" />
              <span className="text-sm text-content-secondary">Comments</span>
            </div>
            <Switch 
              checked={enableComments} 
              onCheckedChange={setEnableComments}
              className="data-[state=checked]:bg-brand-accent"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-content-secondary" />
              <span className="text-sm text-content-secondary">View Count</span>
            </div>
            <Switch 
              checked={enableViews} 
              onCheckedChange={setEnableViews}
              className="data-[state=checked]:bg-brand-accent"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-content-secondary" />
              <span className="text-sm text-content-secondary">Social Share</span>
            </div>
            <Switch 
              checked={enableShare} 
              onCheckedChange={setEnableShare}
              className="data-[state=checked]:bg-brand-accent"
            />
          </div>
        </div>

        {/* Active Features Preview */}
        <div className="flex flex-wrap gap-2">
          {enableLikes && <Badge variant="secondary" className="text-xs">❤️ Likes</Badge>}
          {enableComments && <Badge variant="secondary" className="text-xs">💬 Comments</Badge>}
          {enableViews && <Badge variant="secondary" className="text-xs">👁️ Views</Badge>}
          {enableShare && <Badge variant="secondary" className="text-xs">🔗 Share</Badge>}
        </div>
        
        <Button 
          variant="content" 
          className="w-full group-hover:bg-brand-accent group-hover:text-brand-primary transition-all duration-500 transform group-hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          Create {title}
        </Button>
      </CardContent>
    </Card>
  );
};

