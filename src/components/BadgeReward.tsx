import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Medal, Award, Crown, Shield } from "lucide-react";

interface BadgeData {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
}

interface BadgeRewardProps {
  badge: BadgeData;
  isNewlyEarned?: boolean;
  onClaim?: () => void;
  onClose?: () => void;
}

const badgeIcons = {
  trophy: Trophy,
  star: Star,
  medal: Medal,
  award: Award,
  crown: Crown,
  shield: Shield,
};

const rarityConfig = {
  common: {
    gradient: "bg-gradient-to-br from-slate-400 to-slate-600",
    border: "border-slate-300",
    glow: "shadow-slate-200",
    textColor: "text-slate-700"
  },
  rare: {
    gradient: "bg-gradient-to-br from-blue-400 to-blue-600", 
    border: "border-blue-300",
    glow: "shadow-blue-200",
    textColor: "text-blue-700"
  },
  epic: {
    gradient: "bg-gradient-to-br from-purple-400 to-purple-600",
    border: "border-purple-300", 
    glow: "shadow-purple-200",
    textColor: "text-purple-700"
  },
  legendary: {
    gradient: "bg-gradient-to-br from-yellow-400 to-orange-500",
    border: "border-yellow-300",
    glow: "shadow-yellow-200", 
    textColor: "text-yellow-700"
  }
};

export function BadgeReward({ badge, isNewlyEarned = false, onClaim, onClose }: BadgeRewardProps) {
  const IconComponent = badgeIcons[badge.icon as keyof typeof badgeIcons] || Trophy;
  const config = rarityConfig[badge.rarity];

  if (isNewlyEarned) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className={`max-w-md mx-4 ${config.border} ${config.glow} shadow-2xl animate-scale-in`}>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className={`p-6 rounded-full ${config.gradient} ${config.glow} animate-pulse`}>
                <IconComponent className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Badge Earned!</CardTitle>
            <CardDescription className="text-lg">{badge.title}</CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{badge.description}</p>
            
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className={config.textColor}>
                {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">{badge.points} points</span>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  View Later
                </Button>
              )}
              {onClaim && (
                <Button onClick={onClaim} variant="hero">
                  Claim Badge
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className={`emergency-transition hover:scale-105 ${config.border}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${config.gradient}`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">{badge.title}</div>
            <div className="text-xs text-muted-foreground">{badge.description}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {badge.rarity}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs font-medium">{badge.points}pts</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}