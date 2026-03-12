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



# Getting Started
This documentation provides an introduction to Anvil Object Storage, a high-performance storage solution designed to support large-scale, data-intensive research. As part of the Anvil supercomputing ecosystem at Purdue University, this service enables researchers to manage massive unstructured datasets with the flexibility and scalability required for modern scientific workflows.


## What is Anvil Object Storage?

Anvil Object Storage is a 1-petabyte high-performance storage system integrated into the Anvil Composable Subsystem. It is built on the Ceph software-defined storage platform, which allows it to provide unified object, block, and file storage within a single resilient environment.

Unlike traditional "Scratch" or "Project" file systems that use hierarchical directory trees, Anvil Object Storage uses a flat namespace. Every piece of data is stored as a discrete "object" that contains the data itself, a unique identifier, and customizable metadata. This architecture is specifically designed to overcome the scaling limitations of traditional file systems, allowing the storage of billions of items without performance degradation.


## Why Use Object Storage?

Object storage is often the best choice for researchers dealing with the "Three Vs" of big data: Volume, Velocity, and Variety. 

You should consider using Object Storage when:

- **You have massive amounts of unstructured data:** It is purpose-built for images, video files, audio recordings, and large-scale log data that do not fit naturally into a database or a traditional folder structure.

- **You need "Online" access to archives:** Unlike "Cold" tape archives, object storage remains online and accessible via RESTful APIs, providing near-instant retrieval for long-term data sets.

- **Your data requires custom metadata:** You can attach detailed attributes (e.g., sensor type, experiment ID, or collection date) directly to each object, making it easier to search and curate large repositories without external databases.

## Key Features
The Anvil Object Storage service provides several critical features for high-performance computing (HPC) and artificial intelligence (AI) workloads:

- **S3 API Compatibility:** Anvil Object Storage features a REST-based API providing an S3-compatible endpoint. This allows you to use the vast ecosystem of standard S3 tools, such as the rclone, s3cmd, and boto3 (Python SDK) to manage your data.

- **Integrated with Anvil AI:** The storage is directly accessible from Anvil’s nodes (including NVIDIA A100 and H100 nodes), facilitating rapid data ingestion for AI training and model hosting.

## Example Use Cases
Anvil Object Storage can be utilized across a diverse range of scientific domains:

- **Machine Learning (ML) and AI Datasets:** Hosting the massive image or text corpora (such as those used for AnvilGPT) required to train and fine-tune large language models and computer vision systems. Object storage is a popular choice for hosting popular huge datasets.

- **Scientific Data Lakes:** Storing raw output from sensors, satellites, or genomic sequencers as a centralized "source of truth" for multi-step analysis pipelines.

- **Cross resource workflows:** Anvil Object Storage can be used to easily access and process data across multiple RCAC resources, including cloud based platforms like Anvil Composable.

## Sections

- [**Object Storage Concepts**](concepts.md)
- [**Getting Access and Connecting to Object Storage**](access.md)
- [**User Tools**](usertools.md)
- [**Common Workflows**](workflows.md)
<!-- - [**Best Practices**](index.md) -->
- [**Security and Access Control**](acl.md)