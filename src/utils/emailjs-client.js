// File: src/utils/emailjs-client.js
"use client";

// Client-side EmailJS handler
export class EmailJSClient {
  constructor() {
    this.publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    this.serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Dynamically import EmailJS only on client side
      const emailjs = await import("@emailjs/browser");
      this.emailjs = emailjs.default;

      // Initialize EmailJS
      this.emailjs.init({
        publicKey: this.publicKey,
      });

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize EmailJS:", error);
      throw new Error("EmailJS initialization failed");
    }
  }

  async sendEmail(templateId, templateParams) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const result = await this.emailjs.send(
        this.serviceId,
        templateId,
        templateParams
      );

      return {
        success: true,
        status: result.status,
        text: result.text,
      };
    } catch (error) {
      console.error("EmailJS send error:", error);
      throw new Error(
        `Failed to send email: ${
          error.message || error.text || "Unknown error"
        }`
      );
    }
  }
}

// Email template configurations
export const EMAIL_TEMPLATES = {
  welcome: {
    id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_WELCOME || "template_welcome",
    name: "Welcome Email",
    description: "Welcome new students to the program",
    requiredFields: ["to_email", "to_name", "from_name"],
    optionalFields: ["custom_message", "next_steps"],
  },
//   trial_confirmation: {
//     id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_TRIAL || "template_trial",
//     name: "Trial Lesson Confirmation",
//     description: "Confirm trial lesson booking",
//     requiredFields: [
//       "to_email",
//       "to_name",
//       "lesson_date",
//       "lesson_time",
//       "meeting_link",
//     ],
//     optionalFields: ["preparation_notes", "contact_info"],
//   },
//   follow_up: {
//     id:
//       process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_FOLLOWUP || "template_followup",
//     name: "Follow-up Email",
//     description: "Follow up with potential students",
//     requiredFields: ["to_email", "to_name", "from_name"],
//     optionalFields: ["last_contact_date", "next_action", "custom_message"],
//   },
//   lesson_reminder: {
//     id:
//       process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REMINDER || "template_reminder",
//     name: "Lesson Reminder",
//     description: "Remind students of upcoming lessons",
//     requiredFields: [
//       "to_email",
//       "to_name",
//       "lesson_date",
//       "lesson_time",
//       "meeting_link",
//     ],
//     optionalFields: ["lesson_topic", "homework_reminder"],
//   },
  waitlist_contact: {
    id:
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_WAITLIST,
    name: "Waitlist Contact",
    description: "Initial contact for waitlist members",
    requiredFields: ["to_email", "to_name", "from_name"],
    optionalFields: ["interest_level", "availability", "custom_message"],
  },
};

// Helper functions
export function getTemplateList() {
  return Object.entries(EMAIL_TEMPLATES).map(([type, template]) => ({
    type,
    ...template,
  }));
}

export function getTemplate(templateType) {
  return EMAIL_TEMPLATES[templateType];
}

export function validateTemplateParams(templateType, params) {
  const template = EMAIL_TEMPLATES[templateType];
  if (!template) {
    throw new Error(`Template "${templateType}" not found`);
  }

  const missingFields = template.requiredFields.filter(
    (field) => !params[field]
  );

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  return true;
}
