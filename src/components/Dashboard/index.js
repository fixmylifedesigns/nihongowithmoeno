"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import VideosSection from "../video/VideosSection";
import CreateBlogNav from "./CreateBlogNav";
import DashboardTab from './DashboardTab'

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Dashboard");

  const nav = ["Dashboard","Tutorials", "GPT Tools", "Design Templates", "Create Blog"];

  // GPT tools data
  const gptTools = [
    {
      name: "Word of the day",
      description: "Japanese Vocabulary Instagram Post Generator",
      url: "https://chatgpt.com/g/g-67b45f65d6a48191bc8c168f192d5faf-nihongo-with-moeno-word-of-the-day",
      category: "Words",
    },
    {
      name: "Japanese Vocabulary Quiz",
      description:
        "When you provide me with a word, I will create a short multiple-choice quiz for you to use on Instagram.",
      url: "https://chatgpt.com/g/g-67b463d13ae88191b83f4cc7dd8be6bd-japanese-vocabulary-quiz",
      category: "Words",
    },
  ];

  const canvaTemplates = [
    {
      name: "Word of the day",
      description: "Instagram post `Japanese` word of the day",
      url: "https://www.canva.com/design/DAGfcvE_y6U/Uu0UOdn_9knWPURkZkCtBg/edit",
      category: "Social Media",
      thumbnail: "/images/japaneseword.png",
    },
    {
      name: "Kansai Word of the day",
      description: "Instagram post `Kansai dialect` Word of the day",
      url: "https://www.canva.com/design/DAGcoIDGem0/-XWWzhH_HWoepJHmMoU9FQ/edit",
      category: "Social Media",
      thumbnail: "/images/kansaiword.png",
    },
    {
      name: "Word of the day for Girls",
      description: "Instagram post word of the dat for `For Girls`",
      url: "https://www.canva.com/design/DAGdlhQL5zE/6UR1_dBerEHOySp2nwpTAg/edit",
      category: "Social Media",
      thumbnail: "/images/girlword.png",
    },
    {
      name: "Word of the day for boys",
      description: "Instagram post word of the dat for `For Boys`",
      url: "https://www.canva.com/design/DAGdvNqIedk/YfKEZh3A9U29Hs5FZ1iizg/edit",
      category: "Social Media",
      thumbnail: "/images/boyword.png",
    },
    {
      name: "Quiz Video",
      description: "Instagram Reel for quiz",
      url: "https://www.canva.com/design/DAGgkXl5Fmg/LhiYM7bEV22EeRT9HGHePQ/edit",
      category: "Social Media",
      thumbnail: "/images/quiz.png",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="overflow-x-auto scrollbar-hide">
              <nav className="flex space-x-4 sm:space-x-8 min-w-max pr-2">
                {nav.map((button) => (
                  <button
                    key={button}
                    onClick={() => setActiveTab(button)}
                    className={`pb-4 px-1 text-sm sm:text-base whitespace-nowrap ${
                      activeTab === button
                        ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {button}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-4">
              <span className="text-gray-600 text-sm sm:text-base hidden sm:inline">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white text-sm sm:text-base rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Content */}
        <div className="bg-gray-50 rounded-lg p-6">
          {activeTab === "Dashboard" && <DashboardTab />}
          {activeTab === "GPT Tools" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gptTools.map((tool, index) => (
                  <a
                    key={index}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {tool.name}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm flex-grow">
                        {tool.description}
                      </p>
                      <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                        Open GPT
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Quick Guide Section */}
              <div className="mt-8 p-6 bg-white rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How to Use GPT Tools
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    1. Click on any tool card to open the specific GPT in a new
                    tab
                  </p>
                  <p className="text-gray-600">
                    2. Each GPT is specialized for a specific teaching task
                  </p>
                  <p className="text-gray-600">
                    3. You can use these tools to help create lesson materials,
                    plan classes, and generate exercises
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Design Templates" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {canvaTemplates.map((template, index) => (
                  <a
                    key={index}
                    href={template.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="relative aspect-video bg-gray-100">
                      {template.thumbnail ? (
                        <Image
                          src={template.thumbnail}
                          alt={template.name}
                          fill
                          className="object-cover object-top group-hover:opacity-90 transition-opacity"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50">
                          Preview
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {template.name}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {template.description}
                      </p>
                      <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                        Open in Canva
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
                  </a>
                ))}
              </div>

              {/* Templates Guide Section */}
              <div className="mt-8 p-6 bg-white rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Using Design Templates
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    1. Click any template to open it directly in Canva
                  </p>
                  <p className="text-gray-600">
                    2. Customize the template with your own content and branding
                  </p>
                  <p className="text-gray-600">
                    3. Save and download your designs for use in lessons or
                    marketing
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Create Blog" && (
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <CreateBlogNav />
            </div>
          )}

          {activeTab === "Tutorials" && (
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <VideosSection />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
