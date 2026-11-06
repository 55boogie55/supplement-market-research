# Security Policy

## Supported Versions

Supplement Market Research is currently in its early development stage.

Security updates and fixes are provided for the latest version of the project.

| Version | Supported |
| ------- | --------- |
| Latest (`main` branch) | :white_check_mark: |
| Older versions and commits | :x: |

As the project evolves, this section will be updated to reflect official releases and their security support status.

## Reporting a Vulnerability

We take security seriously and appreciate responsible disclosure of potential vulnerabilities.

If you discover a security vulnerability, please report it privately rather than opening a public GitHub issue.

### How to Report

1. Visit the [GitHub repository](https://github.com/55boogie55/supplement-market-research).
2. Navigate to **Security → Advisories**.
3. Select **Report a vulnerability**, if private vulnerability reporting is enabled.
4. Provide a detailed description of the issue.

If private reporting is unavailable, please contact the repository maintainer privately before sharing vulnerability details.

### What to Include

Please provide as much of the following information as possible:

- A description of the vulnerability.
- The affected files or components.
- Steps to reproduce the issue.
- The potential security impact.
- Suggested fixes, if available.

Please do not disclose credentials, personal information, or sensitive user data in your report.

### Response Timeline

We aim to:

- Acknowledge vulnerability reports within **5 business days**.
- Provide updates approximately every **14 days** while an issue is being investigated.
- Prioritize fixes according to severity and potential impact.
- Notify the reporter when the issue has been resolved or declined.

These timelines are best-effort targets and may vary depending on the complexity of the issue.

## Security Considerations

This project uses:

- **GitHub Pages** for static website hosting.
- **Supabase** for database services and survey response storage.
- **JavaScript** for frontend interactions.

Security practices include:

- Using Supabase publishable keys instead of secret keys in frontend code.
- Enabling Row Level Security (RLS) on database tables.
- Restricting unauthorized access to survey responses.
- Avoiding the exposure of credentials and sensitive information.
- Reviewing and addressing reported vulnerabilities.

Security controls should be reviewed whenever new features or services are introduced.

## Responsible Disclosure

We kindly ask security researchers to:

- Avoid accessing, modifying, or deleting other users' data.
- Avoid disrupting the availability of the website or its services.
- Report security issues privately.
- Allow reasonable time for investigation and remediation before public disclosure.

Thank you for helping keep Supplement Market Research and its users safe.
