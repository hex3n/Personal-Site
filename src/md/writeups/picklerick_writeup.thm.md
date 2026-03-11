# TryHackMe | Pickle Rick CTF Writeup

This writeup documents the steps taken to solve the **Pickle Rick** room on TryHackMe.  
The challenge focuses on basic web reconnaissance, enumeration, command execution, and privilege escalation.

---

## Challenge Information

- **Platform:** TryHackMe  
- **Room:** Pickle Rick  
- **Category:** Web / Linux  
- **Difficulty:** Beginner  

---

## Recon

The first step was inspecting the web page source. Inside the HTML comments, a username was revealed which would later be required for authentication.

Next, an Nmap scan was performed to identify open services on the target.

```bash
nmap -sV -vv <target-ip>
```

The scan revealed two open ports:

- `22/tcp` — SSH  
- `80/tcp` — HTTP  

Since a web service was available, further enumeration focused on the HTTP service.

---

## Enumeration

Nikto was used to scan the web server for common misconfigurations and discoverable files.

```bash
nikto -h http://<target-ip>
```

This scan identified a `login.php` page, which appeared to be a potential entry point for authentication.

Directory enumeration was then performed using Gobuster.

```bash
gobuster dir -u http://<target-ip> -w <wordlist>
```

This revealed several interesting files and directories:

- `/assets`
- `/server-status`

Running Gobuster again with file extensions provided more useful results.

```bash
gobuster dir -u http://<target-ip> -w <wordlist> -x txt,php
```

Additional files discovered:

- `robots.txt`
- `clue.txt`
- `login.php`
- `denied.php`

The `robots.txt` file contained text that served as the password for the login portal.

---

## Exploitation

Using the discovered username and password, authentication through `login.php` granted access to a command execution panel.

This panel allowed execution of system commands on the server.

Running the `ls` command revealed a file containing the first flag.

```bash
ls
```

The file contents were retrieved using the `strings` command.

```bash
strings <filename>
```

Next, the `/home` directory was inspected.

```bash
ls /home/
```

Inside the `rick` directory, the second flag file was found and read using the same method.

```bash
strings /home/rick/"second ingredients"
```

---

## Privilege Escalation

To locate the final flag, the root directory was inspected.

```bash
sudo ls -la /root/
```

This revealed the final flag file within the root user's directory.

Reading the file produced the third and final ingredient.

```bash
strings /root/<final-flag-file>
```