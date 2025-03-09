"use client";
import React, { useState } from "react";
import Image from "next/image";

const DashboardTab = () => {
  const [copiedLink, setCopiedLink] = useState(null);

  // Setmore main links
  const setmoreLinks = [
    { 
      label: "Slack Messenger", 
      url: "https://nihongowithmoeno.slack.com", 
      icon: "slack",
      description: "Communicate with team members and get instant notifications"
    },
    { 
      label: "Calendar", 
      url: "https://go.setmore.com/calendar", 
      icon: "calendar",
      description: "View and manage your upcoming lessons and availability"
    },
    { 
      label: "Update Hours & Time Off", 
      url: "https://go.setmore.com/settings/your-profile", 
      icon: "clock",
      description: "Set your teaching hours and schedule time off"
    },
    { 
      label: "Customers Dashboard", 
      url: "https://go.setmore.com/contacts/profile/bc596f33-24c3-452f-aec9-b514432fab9b", 
      icon: "users",
      description: "View and manage your student information and history"
    },
    { 
      label: "Trello Board", 
      url: "https://trello.com/b/QpBzvAwF/nihongowithmoeno", 
      icon: "trello",
      description: "Track projects, tasks and curriculum development"
    },
  ];

  // Setmore services
  const setmoreServices = [
    {
      label: "Private Classes (Current Students)",
      url: "https://nihongowithmoeno.setmore.com/services/77aa0964-b26f-42f5-aff5-02ed66220a5e",
      price: "Free",
      description: "Private lessons for existing students"
    },
    {
      label: "Trial Class",
      url: "https://nihongowithmoeno.setmore.com/services/b73466fd-27ee-4e25-a636-b612790524d5",
      price: "3750 JPY",
      description: "First-time trial lesson for new students"
    }
  ];

  // Quick stats for dashboard summary (you can replace with actual data later)
  const stats = [
    { label: "Upcoming Classes", value: "0" },
    { label: "Total Students", value: "1" },
    { label: "This Week", value: "0" },
  ];

  // Function to copy link to clipboard
  const copyToClipboard = (url, label) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(label);
      setTimeout(() => setCopiedLink(null), 2000);
    });
  };

  // Icon components
  const getIcon = (iconType) => {
    switch (iconType) {
      case "slack":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
          </svg>
        );
      case "calendar":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "clock":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "users":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case "trello":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.646-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v7.62z"/>
          </svg>
        );
      case "copy":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Welcome back!</h2>
        <p className="text-gray-600">
          Manage your Japanese lessons, bookings, and teaching resources all in one place.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Management Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {setmoreLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col h-full p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-300"
            >
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  {getIcon(link.icon)}
                </div>
                <h4 className="font-medium text-gray-800">{link.label}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3 flex-grow">{link.description}</p>
              <div className="text-sm text-blue-600 flex items-center mt-auto">
                Open
                <svg className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Setmore Services Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">Services</h3>
        
        <div className="space-y-4">
          {setmoreServices.map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-800">{service.label}</h4>
                    <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => copyToClipboard(service.url, service.label)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Copy link"
                  >
                    {getIcon("copy")}
                  </button>
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Open link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
              {copiedLink === service.label && (
                <div className="mt-2 text-sm text-green-600">Link copied to clipboard!</div>
              )}
            </div>
          ))}
          
          <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
            More services coming soon...
          </div>
        </div>
      </div>

      {/* Quick Guide Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Getting Started
        </h3>
        <div className="space-y-3">
          <p className="text-gray-600">
            1. Use Slack for team communication and notifications
          </p>
          <p className="text-gray-600">
            2. Manage your schedule and appointments through the Calendar
          </p>
          <p className="text-gray-600">
            3. Track tasks and projects with the Trello board
          </p>
          <p className="text-gray-600">
            4. Share service links with students by clicking the copy icon
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;