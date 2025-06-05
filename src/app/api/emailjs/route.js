// File: src/app/api/emailjs/route.js
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

// Define available email templates
const EMAIL_TEMPLATES = {
  welcome: {
    id: process.env.EMAILJS_TEMPLATE_WELCOME || 'template_welcome',
    name: 'Welcome Email',
    description: 'Welcome new students to the program',
    requiredFields: ['to_email', 'to_name', 'from_name'],
    optionalFields: ['custom_message', 'next_steps']
  },
  trial_confirmation: {
    id: process.env.EMAILJS_TEMPLATE_TRIAL || 'template_trial',
    name: 'Trial Lesson Confirmation',
    description: 'Confirm trial lesson booking',
    requiredFields: ['to_email', 'to_name', 'lesson_date', 'lesson_time', 'meeting_link'],
    optionalFields: ['preparation_notes', 'contact_info']
  },
  follow_up: {
    id: process.env.EMAILJS_TEMPLATE_FOLLOWUP || 'template_followup',
    name: 'Follow-up Email',
    description: 'Follow up with potential students',
    requiredFields: ['to_email', 'to_name', 'from_name'],
    optionalFields: ['last_contact_date', 'next_action', 'custom_message']
  },
  lesson_reminder: {
    id: process.env.EMAILJS_TEMPLATE_REMINDER || 'template_reminder',
    name: 'Lesson Reminder',
    description: 'Remind students of upcoming lessons',
    requiredFields: ['to_email', 'to_name', 'lesson_date', 'lesson_time', 'meeting_link'],
    optionalFields: ['lesson_topic', 'homework_reminder']
  },
  waitlist_contact: {
    id: process.env.EMAILJS_TEMPLATE_WAITLIST,
    name: 'Waitlist Contact',
    description: 'Initial contact for waitlist members',
    requiredFields: ['to_email', 'to_name', 'from_name'],
    optionalFields: ['interest_level', 'availability', 'custom_message']
  }
};

// Helper function to send email via EmailJS with browser headers
async function sendEmailViaEmailJS(templateId, templateParams) {
  const emailData = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: templateId,
    user_id: EMAILJS_PUBLIC_KEY,
    accessToken: EMAILJS_PRIVATE_KEY,
    template_params: templateParams
  };

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Referer': 'https://nihongowithmoeno.com',
      'Origin': 'https://nihongowithmoeno.com'
    },
    body: JSON.stringify(emailData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS API Error: ${response.status} - ${errorText}`);
  }

  return response.text();
}

// GET - List available email templates
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const templateType = searchParams.get('template');

    if (templateType) {
      // Return specific template info
      const template = EMAIL_TEMPLATES[templateType];
      if (!template) {
        return NextResponse.json({
          success: false,
          error: `Template "${templateType}" not found`
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        template: {
          type: templateType,
          ...template
        }
      });
    }

    // Return all available templates
    const templates = Object.entries(EMAIL_TEMPLATES).map(([type, template]) => ({
      type,
      ...template
    }));

    return NextResponse.json({
      success: true,
      templates,
      message: 'Available email templates retrieved successfully'
    });

  } catch (error) {
    console.error('GET EmailJS Templates Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST - Send email using specified template
export async function POST(request) {
  try {
    const body = await request.json();
    const { template, templateParams, recipientEmail, recipientName } = body;

    // Validate required fields
    if (!template) {
      return NextResponse.json({
        success: false,
        error: 'Template type is required'
      }, { status: 400 });
    }

    if (!templateParams) {
      return NextResponse.json({
        success: false,
        error: 'Template parameters are required'
      }, { status: 400 });
    }

    // Check if template exists
    const templateConfig = EMAIL_TEMPLATES[template];
    if (!templateConfig) {
      return NextResponse.json({
        success: false,
        error: `Template "${template}" not found`,
        availableTemplates: Object.keys(EMAIL_TEMPLATES)
      }, { status: 404 });
    }

    // Validate required fields for the template
    const missingFields = templateConfig.requiredFields.filter(
      field => !templateParams[field] && field !== 'to_email' && field !== 'to_name'
    );

    // Handle recipient email and name
    if (!templateParams.to_email && !recipientEmail) {
      missingFields.push('to_email (or recipientEmail)');
    }
    if (!templateParams.to_name && !recipientName) {
      missingFields.push('to_name (or recipientName)');
    }

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        requiredFields: templateConfig.requiredFields,
        optionalFields: templateConfig.optionalFields
      }, { status: 400 });
    }

    // Prepare final template parameters
    const finalParams = {
      ...templateParams,
      to_email: templateParams.to_email || recipientEmail,
      to_name: templateParams.to_name || recipientName,
      // Add default values
      from_name: templateParams.from_name || 'Moeno',
      reply_to: templateParams.reply_to || process.env.REPLY_TO_EMAIL || 'moeno@nihongowithmoeno.com'
    };

    // Send email
    const result = await sendEmailViaEmailJS(templateConfig.id, finalParams);

    // Log email for tracking (optional)
    console.log(`Email sent successfully:`, {
      template,
      to: finalParams.to_email,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: `${templateConfig.name} sent successfully`,
      template: templateConfig.name,
      recipient: finalParams.to_email,
      emailjsResponse: result
    });

  } catch (error) {
    console.error('POST EmailJS Send Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// PUT - Update template configuration (for testing different template IDs)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { template, testTemplateId, testParams } = body;

    if (!template || !testTemplateId) {
      return NextResponse.json({
        success: false,
        error: 'Template type and testTemplateId are required'
      }, { status: 400 });
    }

    // This is for testing purposes - send with custom template ID
    const result = await sendEmailViaEmailJS(testTemplateId, testParams);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      templateId: testTemplateId,
      emailjsResponse: result
    });

  } catch (error) {
    console.error('PUT EmailJS Test Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}