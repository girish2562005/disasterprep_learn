import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Glasses, 
  Smartphone, 
  Globe, 
  Zap,
  Users,
  Target,
  ArrowRight,
  Sparkles
} from "lucide-react";

export const ARVRComingSoon = () => {
  const features = [
    {
      icon: <Glasses className="w-6 h-6" />,
      title: "Immersive VR Training",
      description: "Experience realistic disaster scenarios in a safe virtual environment"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "AR Emergency Guides",
      description: "Overlay emergency instructions and safety information in real-world settings"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Virtual Evacuation Routes",
      description: "Navigate emergency evacuation paths with AR-guided directions"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Collaborative Training",
      description: "Train with others in shared virtual emergency scenarios"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-1">
            <div className="bg-background rounded-lg">
              <CardHeader className="text-center space-y-4">
                <Badge variant="outline" className="w-fit mx-auto">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Coming Soon
                </Badge>
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  AR/VR Experience
                </CardTitle>
                <CardDescription className="text-lg max-w-2xl mx-auto">
                  Revolutionary immersive technology for emergency preparedness training. 
                  Experience realistic disaster scenarios and practice life-saving skills in virtual reality.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg text-primary">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preview Image Placeholder */}
                <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-8 text-center">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10 rounded-xl"></div>
                  <div className="relative z-10">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <Glasses className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Immersive Learning Experience</h3>
                    <p className="text-muted-foreground mb-6">
                      Step into realistic emergency scenarios and practice your response skills
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>Realistic Scenarios</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span>Interactive Training</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Multi-user Support</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-center">Development Progress</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
                      <div className="text-2xl font-bold text-success mb-1">85%</div>
                      <div className="text-sm text-muted-foreground">VR Scenarios</div>
                    </div>
                    <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
                      <div className="text-2xl font-bold text-warning mb-1">60%</div>
                      <div className="text-sm text-muted-foreground">AR Features</div>
                    </div>
                    <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="text-2xl font-bold text-primary mb-1">40%</div>
                      <div className="text-sm text-muted-foreground">Testing Phase</div>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="text-center space-y-4">
                  <h4 className="font-semibold">Be the First to Experience AR/VR Training</h4>
                  <p className="text-muted-foreground">
                    Join our beta program and get early access to revolutionary emergency preparedness training
                  </p>
                  <Button size="lg" className="font-semibold">
                    Join Beta Program
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};