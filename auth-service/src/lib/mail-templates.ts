export const forgetPasswordMail = ({ token, date }: { token: string; date: string }) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your Password | Forget Password | JobPilot</title>
  </head>
  <body style="background-color: #f1f2f4; font-family: Arial, Helvetica, sans-serif; margin:0; padding:0;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f2f4; padding: 20px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <tr>
              <td align="center" style="background-color: #0a65cc; padding: 16px;">
                <a href="https://jobpilot.io" style="text-decoration: none; display: inline-block;">
                  <img src="https://res.cloudinary.com/dcmjlzugw/image/upload/v1758728040/ogo-white_wmndqa.png" alt="Jobpilot Logo" width="120" style="display: block" />
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px;">
                <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 600; color: #333333;">Reset your password</h2>
                <p style="margin: 0 0 24px; font-size: 16px; color: #555555; line-height: 1.5;">Hello,<br />We received a request to reset your password. Click the link below to choose a new one. If you didn’t request this, you can safely ignore this email.</p>
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding: 12px 0;">
                      <a href="https://jobpilot.io/reset-password?token=${token}" style="background-color: #0a65cc; color: #ffffff; padding: 12px 24px; border-radius: 4px; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-block;">Reset Password</a>
                    </td>
                  </tr>
                </table>
                <p style="margin-top: 24px; font-size: 14px; color: #888888; line-height: 1.5;">If the button doesn’t work, copy and paste this link into your browser:<br /><a href="https://jobpilot.io/reset-password?token=${token}" style="color: #0a65cc; word-break: break-all;">https://jobpilot.io/reset-password?token=${token}</a></p>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color: #f9f9f9; padding: 16px; font-size: 12px; color: #999999;">&copy; ${date} Jobpilot. All rights reserved.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
