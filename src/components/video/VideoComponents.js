import { useState } from "react";
import Image from "next/image";

// Utility functions
export const getYouTubeVideoId = (url) => {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const getYouTubeThumbnail = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// VideoCard Component
export const VideoCard = ({ tutorial, preferredLanguage, onVideoClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer group"
      onClick={() => onVideoClick(tutorial[preferredLanguage].videoId)}
    >
      <div className="relative aspect-video bg-gray-100">
        <Image
          src={tutorial[preferredLanguage].thumbnail}
          alt={tutorial.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-colors duration-300 flex items-center justify-center">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            {tutorial.title}
          </h3>
          <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded">
            {tutorial.category}
          </span>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm">
          {tutorial.description}
        </p>
        <div className="mt-3 sm:mt-4 flex items-center text-blue-600 text-sm font-medium">
          Watch Video
          <svg
            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

// VideoModal Component
export const VideoModal = ({ videoId, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 p-4 sm:p-6 md:p-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="flex min-h-full items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-white rounded-lg w-full max-w-4xl mx-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white hover:text-gray-300 p-2 sm:p-0"
          >
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Video container with 16:9 aspect ratio */}
          <div className="relative pt-[56.25%]">
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

// LanguageToggle Component
export const LanguageToggle = ({ preferredLanguage, setPreferredLanguage }) => {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
      <button
        onClick={() => setPreferredLanguage("japanese")}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium rounded-md transition-colors ${
          preferredLanguage === "japanese"
            ? "bg-blue-600 text-white"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Japanese
      </button>
      <button
        onClick={() => setPreferredLanguage("english")}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium rounded-md transition-colors ${
          preferredLanguage === "english"
            ? "bg-blue-600 text-white"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        English
      </button>
    </div>
  );
};
