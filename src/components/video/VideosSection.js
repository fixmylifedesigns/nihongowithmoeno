import { useState } from "react";
import {
  VideoCard,
  VideoModal,
  LanguageToggle,
  getYouTubeVideoId,
  getYouTubeThumbnail,
} from "./VideoComponents";

export const tutorials = [
  {
    title: "NihongowithMoeno Dashboard intro",
    description: "These videos will teach you how to use your new dashboard",
    japanese: {
      url: "https://youtu.be/s3uHwXG1yQw",
    },
    english: {
      url: "https://youtu.be/Zphc0h-zTD8",
    },
    category: "Start",
  },
  {
    title: "Word of the day post",
    description: "Word of the day Instagram Post with Chatgpt and Canva",
    japanese: {
      url: "https://youtu.be/LE1lDIeclmU",
    },
    english: {
      url: "https://youtu.be/q5trk7N7Irg",
    },
    category: "Instagram Post",
  },
  {
    title: "Waitlist Emails",
    description: "How to find all the apply that signed up for the waitlist to be a student",
    japanese: {
      url: "https://www.youtube.com/watch?v=ZTWJYbuAxew",
    },
    english: {
      url: "https://www.youtube.com/watch?v=ZTWJYbuAxew",
    },
    category: "Students",
  },
];

export default function VideosSection() {
  const [preferredLanguage, setPreferredLanguage] = useState("japanese");
  const [activeVideo, setActiveVideo] = useState(null);

  // Process videos to include thumbnail URLs
  const processedTutorials = tutorials.map((tutorial) => ({
    ...tutorial,
    japanese: {
      ...tutorial.japanese,
      videoId: getYouTubeVideoId(tutorial.japanese.url),
      thumbnail: getYouTubeThumbnail(getYouTubeVideoId(tutorial.japanese.url)),
    },
    english: {
      ...tutorial.english,
      videoId: getYouTubeVideoId(tutorial.english.url),
      thumbnail: getYouTubeThumbnail(getYouTubeVideoId(tutorial.english.url)),
    },
  }));

  return (
    <div className="space-y-6">
      {/* Language Toggle */}
      <div className="flex justify-end mb-6">
        <LanguageToggle
          preferredLanguage={preferredLanguage}
          setPreferredLanguage={setPreferredLanguage}
        />
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {processedTutorials.map((tutorial, index) => (
          <VideoCard
            key={index}
            tutorial={tutorial}
            preferredLanguage={preferredLanguage}
            onVideoClick={setActiveVideo}
          />
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal
          videoId={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  );
}
