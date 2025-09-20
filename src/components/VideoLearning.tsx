import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  source: "local" | "external";
  url: string;
  thumbnail?: string;
  category: "demonstration" | "training" | "preparation" | "awareness";
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface VideoLearningProps {
  onVideoComplete?: (videoId: string) => void;
}

const videos: Video[] = [
  {
    id: "safety-demo",
    title: "Earthquake Safety Demonstration",
    description: "Practical demonstration of Drop, Cover, and Hold On technique with real-world scenarios.",
    duration: "3:45",
    source: "local",
    url: "/videos/earthquake-safety-demo.mp4",
    category: "demonstration",
    difficulty: "beginner"
  },
  {
    id: "shakeout-official",
    title: "Great ShakeOut: How to Drop, Cover, and Hold On",
    description: "Official training video from ShakeOut.org showing proper earthquake response techniques.",
    duration: "4:12",
    source: "external",
    url: "https://www.youtube.com/embed/t2AKGdaHrVs",
    category: "training",
    difficulty: "beginner"
  },
  {
    id: "preparedness-kit",
    title: "Building Your Emergency Preparedness Kit",
    description: "Comprehensive guide to assembling an earthquake emergency kit for your family.",
    duration: "6:30",
    source: "external",
    url: "https://www.youtube.com/embed/qDHVfHiLX7w",
    category: "preparation",
    difficulty: "intermediate"
  },
  {
    id: "workplace-safety",
    title: "Earthquake Safety in the Workplace",
    description: "Special considerations for earthquake response in office buildings and work environments.",
    duration: "5:15",
    source: "external",
    url: "https://www.youtube.com/embed/FhwktRDG_aQ",
    category: "training",
    difficulty: "intermediate"
  },
  {
    id: "home-retrofit",
    title: "Securing Your Home for Earthquakes",
    description: "Learn how to earthquake-proof your home with simple retrofitting techniques.",
    duration: "8:20",
    source: "external",
    url: "https://www.youtube.com/embed/Ko7U4mQHiQA",
    category: "preparation",
    difficulty: "advanced"
  },
  {
    id: "earthquake-science",
    title: "Understanding Earthquake Science",
    description: "The science behind earthquakes: fault lines, magnitude, and prediction.",
    duration: "7:45",
    source: "external",
    url: "https://www.youtube.com/embed/e7ho6z32yyo",
    category: "awareness",
    difficulty: "intermediate"
  }
];

const categoryColors = {
  demonstration: "bg-blue-100 text-blue-800 border-blue-200",
  training: "bg-green-100 text-green-800 border-green-200", 
  preparation: "bg-orange-100 text-orange-800 border-orange-200",
  awareness: "bg-purple-100 text-purple-800 border-purple-200"
};

const difficultyColors = {
  beginner: "bg-emerald-100 text-emerald-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800"
};

export function VideoLearning({ onVideoComplete }: VideoLearningProps) {
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const categories = Array.from(new Set(videos.map(v => v.category)));
  const filteredVideos = selectedCategory 
    ? videos.filter(v => v.category === selectedCategory)
    : videos;

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
    if (!watchedVideos.has(video.id)) {
      setWatchedVideos(prev => new Set(prev).add(video.id));
      onVideoComplete?.(video.id);
      toast({
        title: "Video Started",
        description: `Now watching: ${video.title}`,
      });
    }
  };

  const handleVideoEnd = (videoId: string) => {
    toast({
      title: "Video Completed",
      description: "Great job! Keep learning about earthquake safety.",
    });
  };

  const progressStats = {
    watched: watchedVideos.size,
    total: videos.length,
    percentage: Math.round((watchedVideos.size / videos.length) * 100)
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Video Learning Center</CardTitle>
              <CardDescription>
                Master earthquake safety through comprehensive video training
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold text-primary">
                {progressStats.watched}/{progressStats.total}
              </p>
              <p className="text-sm text-muted-foreground">{progressStats.percentage}% Complete</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          size="sm"
        >
          All Videos
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            size="sm"
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Current Video Player */}
      {currentVideo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              {currentVideo.title}
            </CardTitle>
            <CardDescription>{currentVideo.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
              {currentVideo.source === "local" ? (
                <video
                  controls
                  className="w-full h-full"
                  onEnded={() => handleVideoEnd(currentVideo.id)}
                >
                  <source src={currentVideo.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  src={currentVideo.url}
                  className="w-full h-full"
                  allowFullScreen
                  title={currentVideo.title}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Library */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVideos.map((video) => (
          <Card 
            key={video.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              currentVideo?.id === video.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleVideoSelect(video)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm line-clamp-2 mb-2">
                    {video.title}
                    {watchedVideos.has(video.id) && (
                      <CheckCircle className="w-4 h-4 text-green-500 ml-2 inline" />
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={categoryColors[video.category]}>
                      {video.category}
                    </Badge>
                    <Badge variant="secondary" className={difficultyColors[video.difficulty]}>
                      {video.difficulty}
                    </Badge>
                  </div>
                </div>
                {video.source === "external" && (
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs line-clamp-3 mb-3">
                {video.description}
              </CardDescription>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </div>
                <Button size="sm" variant="ghost">
                  <Play className="w-3 h-3 mr-1" />
                  Watch
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}