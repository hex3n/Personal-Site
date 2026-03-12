# TryHackMe | RootMe CTF Writeup

This writeup documents the steps taken to solve the **RootMe** room on TryHackMe.  
The challenge focuses on web enumeration, exploiting a file upload vulnerability to gain a reverse shell, and performing privilege escalation on a Linux system. :contentReference[oaicite:0]{index=0}

---

## Challenge Information

- **Platform:** TryHackMe  
- **Room:** RootMe  
- **Category:** Web / Linux  
- **Difficulty:** Beginner  

---

## Recon

The first step was performing a port scan on the target machine to identify exposed services.

```bash
nmap -sV <target-ip>
```

The scan revealed two open ports:

- `22/tcp` — SSH  
- `80/tcp` — HTTP (Apache web server) :contentReference[oaicite:1]{index=1}  

Since a web server was running on port 80, further investigation focused on the web application.

---

## Enumeration

Directory enumeration was performed using Gobuster to discover hidden directories on the web server.

```bash
gobuster dir -u http://<target-ip> -w <wordlist>
```

The scan revealed the following hidden directory:

```
/panel/
```

Visiting this directory exposed a **file upload form**, suggesting a potential method for gaining access to the system. :contentReference[oaicite:2]{index=2}

---

## Exploitation

The upload form restricted certain file types, preventing direct uploads of `.php` files.

To bypass this restriction, a **PHP reverse shell** was renamed using an alternative extension such as `.phtml`, which is still interpreted by the server as PHP.

After preparing the payload, a listener was started to catch the reverse shell connection.

```bash
nc -lvnp 4444
```

The payload was then uploaded and executed through the web interface, successfully providing a shell as the `www-data` user.

Once access was obtained, the user flag could be retrieved from the system.

---

## Privilege Escalation

With a shell established, the next step was searching for files with **SUID permissions**, which can allow privilege escalation.

```bash
find / -perm -4000 2>/dev/null
```

Among the results, one binary stood out as unusual:

```
/usr/bin/python
```

Since Python had the SUID bit set, it could be used to spawn a shell with elevated privileges.

```bash
python -c 'import os; os.system("/bin/bash")'
```

This command executed a root shell, granting full system access.

Once root access was achieved, the final flag was located and retrieved from the root directory.