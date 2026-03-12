# TryHackMe | Whiterose CTF Writeup

This writeup documents the steps taken to solve the **Whiterose** room on TryHackMe.  
The challenge involves web enumeration, exploiting a **Server-Side Template Injection (SSTI)** vulnerability, and performing privilege escalation to obtain root access. :contentReference[oaicite:0]{index=0}

---

## Challenge Information

- **Platform:** TryHackMe  
- **Room:** Whiterose  
- **Category:** Web / Linux  
- **Difficulty:** Easy  

---

## Recon

The first step was performing a port and service scan on the target machine.

```bash
nmap -sC -sV <target-ip>
```

The scan revealed two open services:

- `22/tcp` — SSH  
- `80/tcp` — HTTP  

Since a web server was running on port 80, the investigation continued by visiting the website hosted on the machine. :contentReference[oaicite:1]{index=1}

The webpage initially appeared blank or under maintenance. The domain name **cyprusbank.thm** needed to be added to the `/etc/hosts` file to properly access the application.

```
<target-ip> cyprusbank.thm
```

---

## Enumeration

After configuring the host entry, the website loaded correctly and displayed a banking interface.

Further exploration revealed functionality such as:

- Account information
- Messaging system
- Search functionality

While analyzing the messaging feature, it was noticed that the URL contained a parameter similar to:

```
?c=5
```

Changing this value returned different messages from the system.

This indicated an **Insecure Direct Object Reference (IDOR)** vulnerability, allowing access to chat messages that should not normally be visible. :contentReference[oaicite:2]{index=2}

By modifying the parameter value, a password belonging to another user was discovered within the messages.

Using these credentials allowed access to a more privileged account within the application.

---

## Exploitation

After gaining access to the application with elevated permissions, further testing was performed on input fields.

One of the inputs reflected the provided value back to the page output, suggesting a potential injection vulnerability.

Testing confirmed that the application was vulnerable to **Server-Side Template Injection (SSTI)**.

By crafting a malicious template payload, it was possible to execute commands on the server.

This allowed a reverse shell to be spawned, granting command execution access on the target machine.

---

## Privilege Escalation

After obtaining a shell on the system, enumeration of local privileges was performed.

One important finding was the version of `sudo` installed on the machine.

The installed version was vulnerable to a **sudoedit privilege escalation bypass**, which allows modification of protected files.

Using this vulnerability, the `/etc/passwd` file could be modified to create or elevate a user account.

After updating the file and switching users, root access was obtained.

The final flag was then retrieved from the root directory.