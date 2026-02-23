---
tags:
  - Anvil
authors:
  - dane
search:
  boost: 2
---

****## Start here

Before you can log in to Anvil, ensure you have:

1. Created your [ACCESS account](https://access-ci.org)
2. Applied for a project
3. Received credits in ACCESS
4. [Transferred your credits to Anvil](https://allocations.access-ci.org/how-to#manage-an-explore-discover-or-accelerate-project)

!!! warning "Anvil account creation"
    Unless you have **transferred** credits onto Anvil, you will not have a valid Anvil username. This will result in errors that may look like: `failed to map user <username@access-cli.com>`. If you are not the PI of the project, ensure the PI has added you to the project and exchanged credits to Anvil.

## Logging in

To Access Anvil, you can login through a variety of ways:

- [ssh](#ssh)
- [ondemand](#ondemand)
- [thinclinc](#thinlinc)

!!! note "Other ways to access Anvil"
    Many other ways exist to access Anvil that piggyback on SSH or other technology. If you use a method not listed here, please note we may be limited in the support we can give for accessing Anvil in such a way.

## SSH

{% set resource = "anvil" %}

{{ ssh_keys_snippet(resource) }}

## OnDemand

Navigate to [Anvil OnDemand](https://ondemand.anvil.rcac.purdue.edu/) and use your ACCESS credentials to login.

## ThinLinc

{% set resource = "anvil" %}

{{ thinlinc_snippet(resource) }}

## Checking Your Balance

Anvil uses Service Units (SUs) as a way to meter our users use of the compute resources. Below is a table to view your current service unit availability, as well as monitory how those service units have been used.

|Tool|Use|
|---|---|
|`mybalance`|Check the allocation usage of your project team.|
|`seff <jobid>`| Show the resource usage of a completed job|
|`jobsu <jobid>`| Show the total service units used for a completed job|

## My Data Locations

By default, you will have access to three different storage locations:

- **/home/<username>:** 25GB of space
- **$PROJECT:** 5TB of space (can request more)
- **$SCRATCH:** 100TB of storage with a 1 million file limit.

See [File Management](storage.md) for more information.

!!! tip "Storage etiquette"
    We advice not to add virtual environments or any big files to your $HOME directory. Virtual environments can exceed the disk quota limit of home quickly and are often better off stored at your $PROJECT space.

## Submitting your first job

To submit a job, you must use the `#SBATCH` header sections and at a minimum specify:

- `-p` or `--partition`
- `-A` or `--account`

!!! warning "--account"
    If you do not specify an account, you may get unwanted results due to a default `--account` being chosen for you.

```bash
#!/bin/bash
#SBATCH -A cda123456  # account
#SBATCH -p standard   # partition
#SBATCH --nodes=1     # total nodes
#SBATCH --ntasks=1    # total tasks
#SBATCH --cpus-per-task=2
## SBATCH --mem=1G
#SBATCH --job-name example-job-for-anvil
#SBATCH -t 00:05:00   # hh:mm:ss

echo $SLURM_CPUS_PER_TASK
echo 'hi mom! i am using Anvil!!!'
```

## Next Steps

Please see the rest of our User Guide for more comprehensive information about Anvil.

!!! important "Read our full user guide"
    We **strongly suggest** you read, or at the very least skim through, our whole user guide so you can have answers to questions you may ask in the future.
