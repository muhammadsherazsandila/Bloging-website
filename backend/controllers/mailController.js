import { transporter } from "../config/mailConfig.js";

export const sendEmail = async (email, url) => {
  const mailOptions = {
    from: '"Blogora" <noreplyBlogora@gmail.com>',
    to: email,
    subject: "Your Reset Password Link",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reset Your Password - Blogora</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --color-primary: #07275f;
      --color-primary-light: #3a54a0;
      --color-bg-gradient-start: #e0e7ff;
      --color-bg-gradient-end: #8bbed6;
      --color-text-primary: #1f2937;
      --color-text-secondary: #4b5563;
      --color-button-bg: linear-gradient(135deg, #3759a9, #3a54a0);
      --color-button-hover-bg: linear-gradient(135deg, #2d4a8a, #314274);
      --radius-card: 16px;
      --radius-btn: 12px;
      --spacing-base: 32px;
      --font-family: 'Inter', sans-serif;
      --shadow-card: rgba(7, 39, 95, 0.15);
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: var(--spacing-base);
      background: linear-gradient(135deg, var(--color-bg-gradient-start), var(--color-bg-gradient-end));
      font-family: var(--font-family);
      color: var(--color-text-primary);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      line-height: 1.6;
    }
    .email-container {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: saturate(180%) blur(12px);
      max-width: 600px;
      width: 100%;
      border-radius: var(--radius-card);
      box-shadow: 0 12px 32px var(--shadow-card);
      padding: calc(var(--spacing-base) * 1.25);
      box-sizing: border-box;
      border: 1px solid rgba(7, 39, 95, 0.1);
    }
    .logo {
      text-align: center;
      margin-bottom: 24px;
    }
    .logo img {
      max-width: 160px;
      height: auto;
    }
    h2 {
      font-size: 48px;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 var(--spacing-base) 0;
      line-height: 1.1;
    }
    p {
      margin: 0 0 var(--spacing-base) 0;
      font-size: 18px;
      color: var(--color-text-secondary);
    }
    p.footer {
      margin-top: calc(var(--spacing-base) * 1.5);
      font-size: 16px;
      color: var(--color-text-secondary);
    }
    strong {
      color: var(--color-primary-light);
      font-weight: 600;
    }
    a.button {
      display: inline-block;
      background: var(--color-button-bg);
      color: #fff;
      text-decoration: none;
      padding: 16px 36px;
      font-weight: 700;
      border-radius: var(--radius-btn);
      box-shadow: 0 6px 16px rgba(55, 89, 169, 0.48);
      font-size: 20px;
      transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
      letter-spacing: 0.02em;
    }
    a.button:hover,
    a.button:focus {
      background: var(--color-button-hover-bg);
      box-shadow: 0 8px 20px rgba(45, 74, 138, 0.64);
      transform: translateY(-2px);
    }
    .website-link {
      margin-top: 24px;
      font-size: 16px;
      text-align: center;
    }
    .website-link a {
      color: var(--color-primary);
      text-decoration: underline;
    }
    @media (max-width: 480px) {
      .email-container {
        padding: 24px;
        border-radius: 12px;
      }
      h2 {
        font-size: 36px;
      }
      p, .website-link {
        font-size: 16px;
      }
      a.button {
        font-size: 18px;
        padding: 14px 28px;
      }
    }
  </style>
</head>
<body>
  <main class="email-container" role="main" aria-label="Password reset email">
    <div class="logo">
      <img src="https://collection.cloudinary.com/djsj10dmo/3c351febb03ab48c0c01b9afa0d52594" alt="Blogora Logo" />
    </div>
    <h2>Reset Your Password</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password for your <strong>Blogora</strong> account.</p>
    <p>Click the button below to reset your password:</p>
    <p>
      <a href="${url}" class="button" role="button" aria-label="Reset your Blogora password">Reset Password</a>
    </p>
    <p>If you didn’t request a password reset, you can safely ignore this email.</p>
    <p class="footer">Thanks,<br />The Blogora Team</p>
    <div class="website-link">
      <p>Visit us at <a href="https://blogorablogs.vercel.app" target="_blank">blogorablogs.vercel.app</a></p>
    </div>
  </main>
</body>
</html>
`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
  } catch (error) {
    console.log(error);
  }
};
