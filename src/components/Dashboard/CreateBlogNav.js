"use client";

import React, { useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { OnChangePlugin } from "./plugins/OnChangePlugin";

const CreateBlogNav = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "Grammar",
    description: "",
    content: "",
    datePublished: new Date().toISOString().split("T")[0],
    author: "Moeno",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  // Lexical editor configuration
  const editorConfig = {
    namespace: "blog-editor",
    theme: {
      paragraph: "mb-2",
      heading: {
        h1: "text-3xl font-bold mb-4",
        h2: "text-2xl font-bold mb-3",
        h3: "text-xl font-bold mb-2",
      },
      list: {
        ul: "list-disc ml-4 mb-2",
        ol: "list-decimal ml-4 mb-2",
      },
      link: "text-blue-500 underline",
    },
    onError: (error) => {
      console.error("Editor error:", error);
    },
    editorState: null, // Initialize with no content
    nodes: [HeadingNode, ListNode, ListItemNode, LinkNode],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (editorState) => {
    editorState.read(() => {
      try {
        const serializedState = editorState.toJSON();
        setFormData((prev) => ({
          ...prev,
          content: JSON.stringify(serializedState),
        }));
      } catch (error) {
        console.error("Error serializing editor state:", error);
      }
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create blog post");
      }

      setStatus({ loading: false, error: null, success: true });
      setFormData({
        title: "",
        category: "Grammar",
        description: "",
        content: "",
        datePublished: new Date().toISOString().split("T")[0],
        author: "Moeno",
      });
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message,
        success: false,
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow text-black">
      <h2 className="text-2xl font-semibold mb-6">Create New Blog Post</h2>

      {status.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-700 text-sm">{status.error}</p>
        </div>
      )}

      {status.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">Success</p>
          <p className="text-green-700 text-sm">
            Blog post created successfully!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category select */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Grammar">Grammar</option>
            <option value="Vocabulary">Vocabulary</option>
            <option value="Japan Travel">Japan Travel</option>
          </select>
        </div>

        {/* Description textarea */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Lexical Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <div className="border border-gray-300 rounded-md">
            <LexicalComposer initialConfig={editorConfig}>
              <div className="relative bg-white">
                <ToolbarPlugin />
                <div className="relative min-h-[400px] p-4">
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable className="outline-none min-h-[350px]" />
                    }
                    placeholder={
                      <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                        Start writing your blog post...
                      </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                </div>
                <HistoryPlugin />
                <AutoFocusPlugin />
                <ListPlugin />
                <LinkPlugin />
                {/* Add an OnChangePlugin to handle changes */}
                <OnChangePlugin onChange={handleEditorChange} />
              </div>
            </LexicalComposer>
          </div>
        </div>

        {/* Date input */}
        <div>
          <label
            htmlFor="datePublished"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Publication Date
          </label>
          <input
            type="date"
            id="datePublished"
            name="datePublished"
            value={formData.datePublished}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={status.loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            status.loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 transition-colors"
          }`}
        >
          {status.loading ? "Creating..." : "Create Blog Post"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlogNav;
