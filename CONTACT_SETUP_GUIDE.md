# 🚀 Portfolio Contact Form Setup Guide

Your portfolio now has a fully functional contact form that will send emails directly to **ashishs8927@gmail.com**. Here's how to set it up:

## 📋 What's Been Done

✅ **EmailJS Integration**: Added @emailjs/browser library  
✅ **Contact Form**: Updated with proper email sending functionality  
✅ **Error Handling**: Added validation and user feedback  
✅ **Success Messages**: Beautiful success notification with animations  
✅ **Environment Variables**: Secure configuration system  

## 🔧 Setup Instructions

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a **free account** (200 emails/month)

### Step 2: Connect Gmail Service
1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail"**
4. Follow instructions to connect your Gmail account
5. **Copy the Service ID** (you'll need this)

### Step 3: Create Email Template
1. Go to **"Email Templates"** in dashboard
2. Click **"Create New Template"**
3. Use this template content:

```
Subject: Portfolio Contact: {{subject}}

New message from your portfolio website!

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
Sent from Portfolio Contact Form
```

4. **Copy the Template ID**

### Step 4: Get Public Key
1. Go to **"Account"** → **"General"**
2. Find your **Public Key** in the API Keys section
3. **Copy the Public Key**

### Step 5: Configure Your Portfolio
1. Open the `.env` file in your portfolio folder
2. Replace the placeholder values with your actual EmailJS credentials:

```env
VITE_EMAILJS_SERVICE_ID=your_actual_service_id
VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

### Step 6: Restart Development Server
```bash
npm run dev
```

## 🎉 Testing Your Contact Form

1. Open your portfolio at `http://localhost:5174`
2. Scroll to the **Contact** section
3. Fill out the form with test data
4. Click **"Send Message"**
5. Check your email at **ashishs8927@gmail.com**

## 🔒 Security Features

- ✅ Environment variables keep credentials secure
- ✅ Form validation prevents empty submissions
- ✅ Error handling for network issues
- ✅ Rate limiting through EmailJS (free tier: 200 emails/month)

## 🎨 What Users Will See

- **Loading State**: Animated spinner while sending
- **Success Message**: Green checkmark with confirmation
- **Error Handling**: User-friendly error messages
- **Form Reset**: Automatic form clearing after successful send

## 📞 Contact Information

The form will automatically send emails to **ashishs8927@gmail.com** with:
- Sender's name and email
- Subject line from form
- Complete message content
- Professional formatting

## 🚨 Important Notes

- Keep your `.env` file private (it's in `.gitignore`)
- Test the form after setup
- EmailJS free plan: 200 emails/month
- Emails may take 1-2 minutes to arrive

## 🔄 Alternative if EmailJS Setup is Complex

If you prefer a simpler solution, the form will show a fallback message directing users to contact you directly at **ashishs8927@gmail.com**.

---

**Your portfolio contact form is now ready! 🎯**