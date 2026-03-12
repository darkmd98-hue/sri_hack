# SkillSwap

SkillSwap is a mobile skill-exchange platform with a React Native frontend and a PHP + MySQL backend.

See [backend/README.md](backend/README.md) for backend setup details and [frontend/README.md](frontend/README.md) for React Native runtime notes.

## Local Password Reset Flow

### Overview

This project implements a local password reset system made up of:

- `POST /auth/forgot`
- `POST /auth/reset-password`
- `password_reset_tokens` database table
- React Native `ForgotPasswordScreen`
- React Native `ResetPasswordScreen`

### How the Reset Request Works

- The user enters their email in the Forgot Password screen.
- The backend generates a secure reset token.
- The token is stored as a SHA-256 hash in the `password_reset_tokens` table.
- The raw token is logged to the PHP error log for development use.

### How to Test the Flow Locally

#### Step 1 — Request Reset

Open the app, go to **Forgot Password**, and enter the user email address.

#### Step 2 — Find Reset Token

Open the PHP error log and look for a line like:

```text
[SkillSwap] Password reset token for user@email.com: TOKEN_VALUE
```

#### Step 3 — Reset Password

Open the **Reset Password** screen and enter:

- token
- new password
- confirm password

#### Step 4 — Verify

Log in with the new password.

### Security Behavior

The password reset system:

- does not reveal whether the email exists
- hashes reset tokens before storage
- expires tokens automatically
- deletes tokens after successful reset
- revokes active auth tokens

### Production Note

This implementation logs reset tokens for development only.

In production:

- `SKILLSWAP_LOG_RESET_TOKENS` should be disabled
- a real email delivery service should send reset links
