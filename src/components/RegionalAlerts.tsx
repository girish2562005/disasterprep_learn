import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  AlertTriangle, 
  Cloud, 
  Thermometer,
  Wind,
  Droplets,
  Bell,
  BellOff
} from "lucide-react";

interface RegionalAlert {
  id: string;
  type: "warning" | "watch" | "advisory";
  category: "weather" | "seismic" | "flood" | "fire";
  title: string;
  description: string;
  region: string;
  severity: "low" | "medium" | "high" | "critical";
  issuedAt: Date;
  expiresAt: Date;
}

export const RegionalAlerts = () => {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("Maharashtra");
  const [alerts] = useState<RegionalAlert[]>([
    {
      id: "1",
      type: "warning",
      category: "weather",
      title: "Heavy Rainfall Warning",
      description: "Heavy to very heavy rainfall expected in coastal areas. Risk of waterlogging in low-lying areas.",
      region: "Mumbai",
      severity: "high",
      issuedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000)
    },
    {
      id: "2",
      type: "advisory",
      category: "seismic",
      title: "Earthquake Preparedness Advisory",
      description: "Recent seismic activity detected. Review your emergency preparedness plans.",
      region: "Pune",
      severity: "medium",
      issuedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: "3",
      type: "watch",
      category: "fire",
      title: "Fire Weather Watch",
      description: "Dry conditions and strong winds create elevated fire risk. Avoid outdoor burning.",
      region: "Nagpur",
      severity: "medium",
      issuedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000)
    }
  ]);

  const regions = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "West Bengal"];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "weather": return <Cloud className="w-4 h-4" />;
      case "seismic": return <AlertTriangle className="w-4 h-4" />;
      case "flood": return <Droplets className="w-4 h-4" />;
      case "fire": return <Thermometer className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Regional Emergency Alerts
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAlertsEnabled(!alertsEnabled)}
          >
            {alertsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </Button>
        </CardTitle>
        <CardDescription>
          Real-time emergency alerts and warnings for your region
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Region Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Your Region</label>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </Button>
            ))}
          </div>
        </div>

        {/* Alert Status */}
        {alertsEnabled ? (
          <Alert className="border-success bg-success/10">
            <Bell className="h-4 w-4" />
            <AlertDescription>
              Alert notifications are enabled for {selectedRegion}. You'll receive real-time updates.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-warning bg-warning/10">
            <BellOff className="h-4 w-4" />
            <AlertDescription>
              Alert notifications are disabled. Enable them to stay informed about regional emergencies.
            </AlertDescription>
          </Alert>
        )}

        {/* Active Alerts */}
        <div className="space-y-4">
          <h4 className="font-semibold">Active Alerts</h4>
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(alert.category)}
                      <div>
                        <h5 className="font-medium">{alert.title}</h5>
                        <p className="text-sm text-muted-foreground">{alert.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(alert.severity) as any}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm">{alert.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Issued {formatTimeAgo(alert.issuedAt)}</span>
                    <span>Expires in {Math.floor((alert.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))}h</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active alerts for {selectedRegion}</p>
              <p className="text-sm">Stay prepared and check back regularly</p>
            </div>
          )}
        </div>

        {/* Weather Summary */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <Wind className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Wind Speed</p>
            <p className="text-lg font-bold">15 km/h</p>
          </div>
          <div className="text-center">
            <Droplets className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Humidity</p>
            <p className="text-lg font-bold">78%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};