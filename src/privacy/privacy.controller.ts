import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('privacy-policy')
@Controller('privacy-policy')
export class PrivacyController {
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  @ApiOperation({
    summary: 'Public Privacy Policy HTML web page for Google Play Store & App Store compliance',
  })
  getPrivacyPolicy(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - VibeLink</title>
    <style>
        :root {
            --bg-color: #0f1020;
            --card-bg: #16172b;
            --text-color: #e7e7f0;
            --muted-text: #a0a0c0;
            --accent-color: #6C5CE7;
            --border-color: #2a2a44;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
        }
        .container {
            max-width: 800px;
            width: 100%;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 {
            color: #ffffff;
            font-size: 2.2rem;
            margin-top: 0;
            border-bottom: 2px solid var(--accent-color);
            padding-bottom: 12px;
        }
        h2 {
            color: #ffffff;
            font-size: 1.4rem;
            margin-top: 28px;
        }
        p, li {
            color: var(--muted-text);
            font-size: 1rem;
        }
        ul {
            padding-left: 20px;
        }
        li {
            margin-bottom: 8px;
        }
        .last-updated {
            font-style: italic;
            color: var(--muted-text);
            font-size: 0.9rem;
            margin-bottom: 24px;
        }
        a {
            color: var(--accent-color);
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .contact-box {
            background: rgba(108, 92, 231, 0.1);
            border: 1px solid var(--accent-color);
            border-radius: 8px;
            padding: 16px 20px;
            margin-top: 24px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Privacy Policy</h1>
        <div class="last-updated">Last updated: August 8, 2026</div>
        
        <p>Welcome to <strong>VibeLink</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, store, and safeguard your information when you use our mobile application and services.</p>

        <h2>1. Information We Collect</h2>
        <p>When you register and interact with VibeLink, we may collect the following types of information:</p>
        <ul>
            <li><strong>Account Information:</strong> Full name, email address, password, profile picture, gender, and bio.</li>
            <li><strong>User Content:</strong> Challenges created or joined, completion proof (photos/videos uploaded as memories), ratings, and reviews.</li>
            <li><strong>Device & Usage Data:</strong> Device hardware model, operating system version, unique device identifiers, and crash reporting logs.</li>
            <li><strong>Location Data:</strong> Optional coarse or fine geolocation when finding local real-world challenges or matches (only with explicit user permission).</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul>
            <li>To create and manage your VibeLink account.</li>
            <li>To match you with compatible challenge partners and local social activities.</li>
            <li>To display user profiles, completed challenge memories, and community feedback.</li>
            <li>To send notifications regarding friend matches, challenge updates, and system alerts.</li>
            <li>To maintain, secure, and improve app functionality and user experience.</li>
        </ul>

        <h2>3. Data Sharing & Disclosure</h2>
        <p>We do NOT sell, rent, or trade your personal information to third parties. We may share information under the following limited circumstances:</p>
        <ul>
            <li><strong>Public Profile & Memories:</strong> Information you choose to post publicly (e.g., public profile details, challenge memories) is visible to other VibeLink users.</li>
            <li><strong>Service Providers:</strong> Trusted third-party vendors (such as database hosting and cloud storage providers) that assist in operating our app under strict confidentiality agreements.</li>
            <li><strong>Legal Requirements:</strong> If required by law, subpoena, or government order to protect user safety or rights.</li>
        </ul>

        <h2>4. Data Retention & Account Deletion</h2>
        <p>We retain your personal data for as long as your account remains active. You have the right to request the deletion of your account and all associated data at any time by contacting us or using the in-app account deletion settings.</p>

        <h2>5. Security of Your Information</h2>
        <p>We implement industry-standard technical and organizational security measures (including password hashing and HTTPS encryption) to protect your data from unauthorized access, disclosure, or destruction.</p>

        <h2>6. Children's Privacy</h2>
        <p>VibeLink is intended for individuals aged 13 and older. We do not knowingly collect personal information from children under 13.</p>

        <h2>7. Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy periodically. Any changes will be posted on this page with an updated revision date.</p>

        <h2>8. Contact Us</h2>
        <div class="contact-box">
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our support team at:</p>
            <p><strong>Email:</strong> <a href="mailto:support@vibelink.app">support@vibelink.app</a></p>
        </div>
    </div>
</body>
</html>`;
  }
}
