const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Store messages (for backup)
let messages = [];
let visitorCount = 0;

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Portfolio API is running!', status: 'active' });
});

// Visitor counter
app.get('/api/visitors', (req, res) => {
    visitorCount++;
    res.json({ count: visitorCount });
});

// Contact form with EMAIL NOTIFICATION
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Valid email required' });
    }
    
    // Save message
    const newMessage = {
        id: messages.length + 1,
        name,
        email,
        message,
        date: new Date(),
        ip: req.ip
    };
    messages.push(newMessage);
    console.log('📬 New message from:', name);
    
    // Send email notification
    try {
        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: 'arsemabella@gmail.com',
            subject: `📬 New Message from ${name} - Portfolio`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #00d4ff; border-radius: 10px;">
                    <h2 style="color: #00d4ff;">✨ New Contact Form Submission ✨</h2>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>📛 Name:</strong> ${name}</p>
                        <p><strong>📧 Email:</strong> ${email}</p>
                        <p><strong>💬 Message:</strong></p>
                        <p style="background: white; padding: 10px; border-radius: 5px;">${message}</p>
                        <p><strong>📅 Date:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    <p style="color: #666;">Reply directly to ${email} to contact them back.</p>
                </div>
            `
        });
        console.log('✅ Email notification sent!');
    } catch (emailError) {
        console.log('⚠️ Email not configured:', emailError.message);
    }
    
    res.json({ 
        success: true, 
        message: 'Message received! I will contact you soon.'
    });
});

// View all messages (for you only)
app.get('/api/messages', (req, res) => {
    res.json({ 
        total: messages.length,
        messages: messages.reverse() 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`📧 Email notifications enabled`);
});