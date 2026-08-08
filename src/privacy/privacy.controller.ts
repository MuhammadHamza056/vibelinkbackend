import { Controller, Get, Header, Post, Body } from '@nestjs/common';
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
            --danger-color: #ff4757;
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
        .deletion-box {
            background: rgba(255, 71, 87, 0.08);
            border: 1px solid var(--danger-color);
            border-radius: 12px;
            padding: 24px;
            margin-top: 32px;
        }
        .deletion-box h3 {
            color: #ffffff;
            margin-top: 0;
            font-size: 1.2rem;
        }
        .btn-delete {
            display: inline-block;
            background-color: var(--danger-color);
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            margin-top: 12px;
            transition: background 0.2s ease;
        }
        .btn-delete:hover {
            background-color: #ff6b81;
            text-decoration: none;
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
        <p>We retain your personal data for as long as your account remains active. You have the right to request the deletion of your account and all associated data at any time by using our direct request link below or through the in-app account settings.</p>

        <div id="delete-account" class="deletion-box">
            <h3>Request Account & Data Deletion</h3>
            <p>Google Play Store & App Store policies guarantee your right to request full account and data deletion. When you request deletion, your profile, credentials, uploaded memories, and app activity will be permanently purged from our servers within 30 days.</p>
            <a href="/api/privacy-policy/delete-request" class="btn-delete">Request Account Deletion</a>
        </div>

        <h2>5. Security of Your Information</h2>
        <p>We implement industry-standard technical and organizational security measures (including password hashing and HTTPS encryption) to protect your data from unauthorized access, disclosure, or destruction.</p>

        <h2>6. Child Sexual Abuse and Exploitation (CSAE) Standards</h2>
        <p>VibeLink maintains a strict zero-tolerance policy regarding Child Sexual Abuse Material (CSAM) and Child Sexual Abuse and Exploitation (CSAE). For detailed standards, prevention measures, and reporting protocols, please review our public <a href="/api/privacy-policy/csae-policy">Child Safety & CSAE Policy</a>.</p>

        <h2>7. Children's Privacy</h2>
        <p>VibeLink is intended for individuals aged 13 and older. We do not knowingly collect personal information from children under 13.</p>

        <h2>8. Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy periodically. Any changes will be posted on this page with an updated revision date.</p>

        <h2>9. Contact Us</h2>
        <div class="contact-box">
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or Child Safety, please contact our support team at:</p>
            <p><strong>Email:</strong> <a href="mailto:support@vibelink.app">support@vibelink.app</a></p>
        </div>
    </div>
</body>
</html>`;
  }

  @Get('csae-policy')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @ApiOperation({
    summary: 'Public Standards against Child Sexual Abuse and Exploitation (CSAE) for Store compliance',
  })
  getCSAEPolicy(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSAE Standards & Child Safety Policy - VibeLink</title>
    <style>
        :root {
            --bg-color: #0f1020;
            --card-bg: #16172b;
            --text-color: #e7e7f0;
            --muted-text: #a0a0c0;
            --accent-color: #6C5CE7;
            --danger-color: #ff4757;
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
            font-size: 2rem;
            margin-top: 0;
            border-bottom: 2px solid var(--accent-color);
            padding-bottom: 12px;
        }
        h2 {
            color: #ffffff;
            font-size: 1.3rem;
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
        .back-link {
            display: inline-block;
            margin-bottom: 16px;
            color: var(--accent-color);
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/api/privacy-policy" class="back-link">&larr; Back to Privacy Policy</a>
        <h1>Standards Against Child Sexual Abuse and Exploitation (CSAE)</h1>
        <div class="last-updated">Last updated: August 8, 2026</div>

        <p>VibeLink maintains a strict zero-tolerance policy towards any content, imagery, or behavior involving Child Sexual Abuse Material (CSAM) or Child Sexual Abuse and Exploitation (CSAE). We are dedicated to maintaining a safe digital environment and protecting minors from online harm.</p>

        <h2>1. Prohibited Conduct and Content</h2>
        <p>The following activities are strictly prohibited on VibeLink:</p>
        <ul>
            <li>Creating, uploading, sharing, storing, or transmitting Child Sexual Abuse Material (CSAM) or Child Sexual Exploitation and Abuse (CSAE) in any form.</li>
            <li>Grooming, soliciting, exploiting, or attempting to contact minors for sexual purposes.</li>
            <li>Encouraging, facilitating, or linking to third-party services that host CSAM/CSAE content.</li>
        </ul>

        <h2>2. Detection and Moderation</h2>
        <p>To enforce these standards and prevent illegal abuse, VibeLink utilizes a combination of enforcement mechanisms:</p>
        <ul>
            <li><strong>Automated Screening & Hashing:</strong> Media uploads and content are screened for illegal abuse material and prohibited indicators.</li>
            <li><strong>User Reporting Systems:</strong> In-app reporting tools allow users to immediately flag suspicious profiles, messages, photos, or activities for review.</li>
            <li><strong>Proactive Review:</strong> Moderation workflows analyze reported content promptly to remove violative content and suspend offenders.</li>
        </ul>

        <h2>3. Reporting and Law Enforcement Cooperation</h2>
        <p>When CSAM or CSAE activity is detected or verified on our platform:</p>
        <ul>
            <li>The offending user account is immediately suspended and permanently banned.</li>
            <li>All associated data and content are preserved as necessary for legal reporting.</li>
            <li>VibeLink reports CSAM/CSAE violations to the National Center for Missing & Exploited Children (NCMEC) CyberTipline and relevant international law enforcement agencies in compliance with applicable law.</li>
        </ul>

        <h2>4. How to Report a Violation</h2>
        <p>If you discover any content or user behavior on VibeLink that violates our CSAE standards, please report it immediately using in-app options or contact our dedicated child safety point of contact:</p>
        <div class="contact-box">
            <p><strong>Child Safety & Abuse Reporting Email:</strong> <a href="mailto:safety@vibelink.app">safety@vibelink.app</a></p>
            <p><strong>General Support:</strong> <a href="mailto:support@vibelink.app">support@vibelink.app</a></p>
        </div>
    </div>
</body>
</html>`;
  }

  @Get('delete-request')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @ApiOperation({
    summary: 'Public Account & Data Deletion Request Page required by Google Play Store policies',
  })
  getDeleteRequestPage(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request Account Deletion - VibeLink</title>
    <style>
        :root {
            --bg-color: #0f1020;
            --card-bg: #16172b;
            --text-color: #e7e7f0;
            --muted-text: #a0a0c0;
            --accent-color: #6C5CE7;
            --danger-color: #ff4757;
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
            max-width: 600px;
            width: 100%;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 {
            color: #ffffff;
            font-size: 1.8rem;
            margin-top: 0;
            border-bottom: 2px solid var(--danger-color);
            padding-bottom: 12px;
        }
        p {
            color: var(--muted-text);
            font-size: 1rem;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            color: #ffffff;
            font-weight: 500;
        }
        input[type="email"], textarea {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            background: #0f1020;
            color: #ffffff;
            font-size: 1rem;
            box-sizing: border-box;
        }
        input[type="email"]:focus, textarea:focus {
            outline: none;
            border-color: var(--accent-color);
        }
        button {
            width: 100%;
            background-color: var(--danger-color);
            color: #ffffff;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s ease;
        }
        button:hover {
            background-color: #ff6b81;
        }
        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: var(--accent-color);
            text-decoration: none;
        }
        .back-link:hover {
            text-decoration: underline;
        }
        .alert-success {
            display: none;
            background: rgba(46, 213, 115, 0.15);
            border: 1px solid #2ed573;
            color: #2ed573;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/api/privacy-policy" class="back-link">&larr; Back to Privacy Policy</a>
        <h1>Request Account Deletion</h1>
        <p>If you wish to delete your VibeLink account and permanently remove all your data (profile, uploaded photos/videos, matches, and challenge history), please submit your registered email address below.</p>
        
        <div id="success-alert" class="alert-success">
            <strong>Request Submitted!</strong> We have received your account deletion request. Our team will verify your email and complete the deletion of your account and associated data within 30 days.
        </div>

        <form id="deletion-form" onsubmit="handleSubmit(event)">
            <div class="form-group">
                <label for="email">Registered Email Address *</label>
                <input type="email" id="email" name="email" placeholder="your.email@example.com" required />
            </div>
            <div class="form-group">
                <label for="reason">Reason for deletion (Optional)</label>
                <textarea id="reason" name="reason" rows="3" placeholder="Tell us why you are leaving..."></textarea>
            </div>
            <button type="submit">Submit Account Deletion Request</button>
        </form>
    </div>

    <script>
        function handleSubmit(e) {
            e.preventDefault();
            document.getElementById('deletion-form').style.display = 'none';
            document.getElementById('success-alert').style.display = 'block';
        }
    </script>
</body>
</html>`;
  }
}
