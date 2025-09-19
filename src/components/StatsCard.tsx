import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: "emergency" | "success" | "warning" | "destructive";
}

export function StatsCard({ title, value, description, icon, trend, color = "emergency" }: StatsCardProps) {
  const colorClasses = {
    emergency: "emergency-gradient",
    success: "success-gradient", 
    warning: "warning-gradient",
    destructive: "bg-destructive",
  };

  return (
    <Card className="emergency-transition hover:scale-105 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <span className={`text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
                  {trend.isPositive ? '+' : ''}{trend.value}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]} text-white`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}