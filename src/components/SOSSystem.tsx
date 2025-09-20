import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  MapPin, 
  AlertCircle, 
  Shield,
  Users,
  Clock
} from "lucide-react";

export const SOSSystem = () => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [emergencyContacts] = useState([
    { name: "Emergency Services", number: "911", type: "primary" },
    { name: "Police", number: "100", type: "police" },
    { name: "Fire Department", number: "101", type: "fire" },
    { name: "Medical Emergency", number: "102", type: "medical" },
    { name: "Disaster Management", number: "108", type: "disaster" }
  ]);

  const handleSOSActivation = () => {
    setIsSOSActive(true);
    // In a real app, this would send location and alerts
    setTimeout(() => setIsSOSActive(false), 5000);
  };

  return (
    <Card className="emergency-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-destructive" />
          Emergency SOS System
        </CardTitle>
        <CardDescription>
          Quick access to emergency services and contacts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isSOSActive && (
          <Alert className="border-destructive bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-semibold">
              Emergency alert sent! Help is on the way. Your location has been shared with emergency services.
            </AlertDescription>
          </Alert>
        )}

        {/* Main SOS Button */}
        <div className="text-center">
          <Button 
            onClick={handleSOSActivation}
            size="lg"
            variant="destructive"
            className={`w-32 h-32 rounded-full text-xl font-bold ${isSOSActive ? 'emergency-pulse' : ''}`}
            disabled={isSOSActive}
          >
            {isSOSActive ? (
              <div className="flex flex-col items-center">
                <Clock className="w-8 h-8 mb-1" />
                SENT
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <AlertCircle className="w-8 h-8 mb-1" />
                SOS
              </div>
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Press and hold for 3 seconds to activate emergency alert
          </p>
        </div>

        {/* Emergency Contacts */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Emergency Contacts
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-lg font-bold text-primary">{contact.number}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Location Services */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Location Services</p>
              <p className="text-sm text-muted-foreground">Enabled for emergency response</p>
            </div>
          </div>
          <Badge variant="outline" className="text-success border-success">
            Active
          </Badge>
        </div>

        {/* Community Alert */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Community Alert Network</p>
              <p className="text-sm text-muted-foreground">Notify nearby trained volunteers</p>
            </div>
          </div>
          <Badge variant="outline" className="text-success border-success">
            Connected
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};