# TryHackMe | Brute It CTF Writeup

This writeup documents the steps taken to solve the **Brute It** room on TryHackMe.  
The challenge focuses on web enumeration, brute forcing credentials, cracking hashes, and performing privilege escalation on a Linux system. :contentReference[oaicite:0]{index=0}

---

## Challenge Information

- **Platform:** TryHackMe  
- **Room:** Brute It  
- **Category:** Web / Linux  
- **Difficulty:** Beginner  

---

## Recon

The first step was scanning the target machine to identify open ports and services.

```bash
nmap -sV -p- <target-ip>
```

The scan revealed two important services:

- `22/tcp` — SSH  
- `80/tcp` — HTTP  

Since a web server was running on port 80, the next step was to investigate the web application.

---

## Enumeration

Directory enumeration was performed using Gobuster to discover hidden paths on the web server.

```bash
gobuster dir -u http://<target-ip> -w /usr/share/wordlists/dirb/common.txt
```

The scan revealed a hidden directory:

```
/admin
```

Visiting this page revealed an **administrator login panel**.

Viewing the page source revealed a comment containing a hint for the username:

```
<!-- Hey john, if you do not remember, the username is admin -->
```

This confirmed that the username was **admin**.

---

## Exploitation

Since the username was known, the next step was brute forcing the password.

The tool **Hydra** was used to brute force the login form using the `rockyou` wordlist.

```bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt \
<target-ip> http-post-form \
"/admin/index.php:user=^USER^&pass=^PASS^:Username or password invalid"
```

Hydra eventually discovered the correct password, allowing authentication to the admin panel.

Within the panel, a **private SSH key (`id_rsa`)** was obtained.

---

## Cracking the SSH Key

The private key required a passphrase before it could be used.  
To crack the passphrase, the key was first converted into a hash format compatible with John the Ripper.

```bash
python /usr/share/john/ssh2john.py id_rsa > hash
```

Next, the hash was cracked using the `rockyou` wordlist.

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt hash
```

This revealed the passphrase required to unlock the SSH key.

---

## Gaining Shell Access

With the passphrase and private key, SSH access could be obtained.

```bash
ssh -i id_rsa john@<target-ip>
```

After logging in, the user flag could be retrieved.

```bash
cat user.txt
```

---

## Privilege Escalation

To identify privilege escalation opportunities, the sudo permissions were checked.

```bash
sudo -l
```

The output revealed that the user could run **`/bin/cat` with sudo privileges**.

Since `cat` could be executed as root, it could be used to read sensitive files.

The root flag was retrieved using:

```bash
sudo cat /root/root.txt
```

This confirmed full root-level access on the system.