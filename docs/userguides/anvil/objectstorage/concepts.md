---
tags:
  - Anvil
  - Object Storage
authors:
  - hkashgar
search:
  boost: 2
draft: false
---
[Back to Anvil Object Storage](../index.md)

# Object Storage Concepts
To effectively use Anvil Object Storage, it is essential to understand how it differs from the traditional "Project" or "Home" directories you use on the supercomputer. While traditional storage is hierarchical (folders inside folders), object storage is flat.

## Core Terminology
### Objects
An Object is the fundamental unit of storage. Unlike a simple file, an object is a "bundle" that consists of:

- **The Data:** The actual file (e.g., a .csv dataset or a .tar.gz backup).

- **Metadata:** Information describing the file (e.g., "created-by: researcher_a").

- **A Unique Key:** The unique identifier used to find the object.

Anvil supports objects up to 5 TB in size.

### Buckets
A Bucket is a top-level container for objects. You can think of a bucket as a "root directory," but with one key difference: buckets cannot be nested inside other buckets.

- **Unique Naming:** Bucket names must be globally unique across the entire Anvil storage system.

- **Flat Structure:** In the background, every object in a bucket is stored at the same level.

### Object Keys (and "Prefixes")
The Key is the full name of the object. While object storage is flat, it "mimics" folders by using slashes in the key name.

- **Example:** If you upload a file as project1/data/results.txt, the Key is the entire string project1/data/results.txt.

- **Prefix:** The string project1/data/ is called a prefix. Tools like the s3cmd or rclone use these prefixes to show you a "folder-like" view, even though the storage is technically flat.

### Metadata
Metadata is "data about your data." In Anvil, every object has System Metadata (like file size and last modified date) and can have Custom Metadata. Custom metadata allows you to tag files with experimental parameters, making it possible to search through millions of objects without opening them.




