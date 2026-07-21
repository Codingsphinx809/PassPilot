# Security

This document defines the security standards for PassPilot.

Security is not a feature added later—it is a core requirement of the platform.

---

# Security Principles

PassPilot is responsible for protecting:

- User accounts
- Learning progress
- Personal information
- Subscription data
- Certification history

Every engineering decision should prioritize protecting user trust.

---

# Authentication

Authentication will be handled through Supabase Authentication.

Supported authentication methods:

- Email and Password
- Google Sign-In
- Apple Sign-In
- Microsoft Sign-In (future)

Passwords will never be stored directly by PassPilot.

---

# Authorization

Access to data must follow the Principle of Least Privilege.

Users may only access:

- Their own profile
- Their own progress
- Their own subscriptions
- Their own study plans

Administrative functionality must require elevated permissions.

---

# Row Level Security (RLS)

All database tables containing user data must use PostgreSQL Row Level Security (RLS).

Every query should assume:

> Deny access unless explicitly allowed.

---

# Data Encryption

## In Transit

All communication must use HTTPS with TLS encryption.

## At Rest

Sensitive data must remain encrypted using Supabase's managed infrastructure.

---

# Secrets Management

Never store:

- API keys
- Service role keys
- Database passwords
- JWT secrets

inside the repository.

Secrets should be stored using:

- Environment variables
- Secret management services
- CI/CD secrets

---

# Input Validation

Every input received from users must be validated.

Examples include:

- Email addresses
- Usernames
- Quiz submissions
- Profile updates
- Search fields

Never trust client-side validation alone.

---

# SQL Injection

Database access must use parameterized queries and Supabase APIs.

Never concatenate SQL strings with user input.

---

# Rate Limiting

Protect against abuse by limiting:

- Login attempts
- Password reset requests
- API requests
- AI usage
- Search requests

---

# Logging

Application logs should never contain:

- Passwords
- Authentication tokens
- Credit card information
- Personally identifiable information (PII)

Logs should contain only the information necessary for debugging and monitoring.

---

# Backups

The database should be backed up automatically.

Recovery procedures should be tested regularly to ensure data can be restored when needed.

---

# Privacy

PassPilot will collect only the data required to provide its services.

We will:

- Never sell user data
- Minimize data collection
- Clearly explain what data is collected
- Allow users to delete their accounts and associated data where applicable

---

# Third-Party Services

Before integrating any third-party service, evaluate:

- Security practices
- Privacy policy
- Data residency
- Reliability
- Long-term support

Only trusted providers should have access to user-related data.

---

# Secure Development Practices

Developers should:

- Keep dependencies up to date
- Regularly review vulnerabilities
- Avoid committing secrets
- Use code reviews
- Follow secure coding practices

Security should be considered during design—not only before release.

---

# Incident Response

If a security incident occurs:

1. Identify the issue.
2. Contain the impact.
3. Investigate the cause.
4. Notify affected users if required.
5. Deploy a fix.
6. Document lessons learned.

---

# Security Checklist

Before each release, verify:

- Authentication works correctly.
- Authorization rules are enforced.
- RLS policies are tested.
- No secrets exist in the repository.
- Dependencies are updated.
- HTTPS is enforced.
- Error messages do not expose sensitive information.
- Backup procedures have been verified.

---

# Guiding Principle

Trust is easier to lose than to earn.

Every security decision should reinforce the confidence users place in PassPilot to protect their information.
