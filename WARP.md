# RCAC Documentation Website

## Project Overview
This is the MkDocs-based documentation website for the **Rosen Center for Advanced Computing (RCAC)** at Purdue University. It provides comprehensive user guides, tutorials, reference material, software catalogs, datasets, blog articles, and workshop materials for RCAC's HPC systems (Anvil and Gautschi).

**Primary URL**: https://rcac-docs.s3-hosted.rcac.purdue.edu
**Source Repository**: https://github.com/PurdueRCAC/RCAC-Docs

### Reference Sites
The following HPC documentation sites use a similar MkDocs Material framework and serve as design/content references:
- https://docs.tacc.utexas.edu/
- https://docs.alcf.anl.gov/
- https://docs.ncsa.illinois.edu/en/latest/
- https://docs.jetstream-cloud.org/
- https://docs.hpc.ucdavis.edu/

## Repository Structure

```
RCAC-Docs/
├── .github/workflows/        # GitHub Actions automation
├── docs/                     # Main documentation content
│   ├── assets/              # Images, CSS, JS, data files
│   ├── blog/                # Blog posts
│   ├── datasets/            # Dataset documentation
│   ├── software/            # Software catalog pages
│   ├── userguides/          # User guides (Anvil, Gautschi)
│   ├── workshops/           # Workshop materials (HPC Exchange)
│   ├── snippets/            # Reusable content snippets
│   ├── contact.md           # Contact page
│   ├── index.md             # Homepage
│   └── templates.md         # Template examples
├── hooks/                    # MkDocs hooks (e.g., social media)
├── modulefiles/             # HPC module files (software installations)
├── overrides/               # Material theme customizations
├── tools/                   # Automation scripts for software catalog
├── main.py                  # MkDocs macros plugin definitions
├── mkdocs.yml               # MkDocs configuration
├── requirements.txt         # Python dependencies
└── .readthedocs.yaml        # Read the Docs configuration
```

## Technology Stack

### Core Technologies
- **MkDocs**: Static site generator (v1.6.1)
- **Material for MkDocs**: Theme (v9.6.16)
- **Python 3.x**: Runtime environment
- **GitHub Actions**: CI/CD automation

### Key MkDocs Plugins
- `mkdocs-material`: Material Design theme
- `mkdocs-blog-plugin`: Blog functionality
- `mkdocs-git-revision-date-localized-plugin`: Git-based timestamps
- `mkdocs-macros-plugin`: Dynamic content macros
- `search`: Built-in search
- `tags`: Content tagging

### Markdown Extensions
- `pymdownx`: Enhanced markdown features (code highlighting, tabs, details, emoji)
- `admonition`: Callout boxes
- `tables`: Table support
- `attr_list`: HTML attributes in markdown
- `toc`: Table of contents with permalinks

## Content Organization

### Major Sections
1. **HPC User Guides**: Comprehensive guides for Anvil and Gautschi clusters
2. **Blog**: News and updates categorized by system/topic
3. **Software Catalog**: Auto-generated catalog of available software
4. **Datasets**: Available datasets (AI, hydrological, meteorological, geospatial)
5. **Workshops**: Training materials (HPC Exchange series)

### Software Catalog System
The software catalog is **automatically generated** from HPC module files:

**Process Flow**:
1. `modulefiles/` → Module files for installed software
2. `tools/update_apps_inventory.sh` → Extracts app names, versions, clusters
3. `tools/generate_apps_topics.py` → Categorizes apps by topic
4. `tools/gen_apps_descriptions.py` → Fetches descriptions from Spack/Wikipedia/PyPI
5. `tools/generate_md.sh` → Creates individual markdown files
6. `tools/update_apps_catalog.sh` → Updates catalog index page

**Topics**: MPI, Compilers, Chemistry, Fluid Dynamics, Geoscience, Math/Stats, Engineering, Utilities, Workflow, etc.

## Automation & Workflows

### GitHub Actions

#### 1. **rebuild_on_module_tools_change.yml**
- **Triggers**: Push to `main` branch when `modulefiles/**` or `tools/**` change
- **Purpose**: Automatically regenerate software catalog
- **Process**:
  1. Runs `make` in `tools/` directory
  2. Commits updated catalog files to repository
  3. Uses GitHub App authentication (`purduercac-docs-bot`)
- **Updates**: `docs/software/apps_md/`, `app_catalog.md`, `index.md`

#### 2. **update_breadcrumbs.yml**
- **Triggers**: Push to `main` branch when `mkdocs.yml` changes
- **Purpose**: Regenerate navigation breadcrumbs
- **Process**:
  1. Runs `tools/generate_breadcrumbs.py`
  2. Updates `docs/assets/data/breadcrumbs.json`
  3. Commits changes automatically
- **Logic**: Only includes parent titles if parent has an `index.md`

### GitHub App Bot
- **Name**: `purduercac-docs-bot`
- **Purpose**: Automated commits to avoid triggering recursive workflows
- **Configuration**: Uses app ID and private key from repository secrets

### Read the Docs Integration
- Configured via `.readthedocs.yaml`
- Automatically builds and deploys on push to `main`
- Uses Ubuntu 24.04 with Python 3

## Development Workflow

### Local Development Setup
```bash
# Clone repository
git clone git@github.com:PurdueRCAC/RCAC-Docs.git
cd RCAC-Docs

# Create conda environment
conda create -n rcac-docs python
conda activate rcac-docs

# Install dependencies
python -m pip install -r requirements.txt

# Start local server
mkdocs serve              # Default: localhost:8000
mkdocs serve -a localhost:8080  # Custom port
```

### Making Changes

#### Content Changes
1. Edit markdown files in `docs/`
2. Test locally with `mkdocs serve`
3. Commit and push to `main`
4. Automatic deployment to Read the Docs

#### Software Catalog Updates
1. Add/modify module files in `modulefiles/`
2. Push to `main` branch
3. GitHub Action automatically runs `make` to regenerate catalog
4. Bot commits updated catalog files

#### Navigation Changes
1. Edit `nav:` section in `mkdocs.yml`
2. Push to `main` branch
3. GitHub Action automatically regenerates breadcrumbs

### Manual Catalog Generation
```bash
cd tools
make  # Runs all steps in correct order

# Or run individually:
./update_apps_inventory.sh -v
./generate_apps_topics.py
./update_apps_descriptions_from_inventory.sh
./generate_md.sh
./update_apps_catalog.sh
```

## Special Features

### MkDocs Macros (`main.py`)
Reusable content snippets defined as Python functions:
- `login_snippet()`: SSH login instructions
- `account_snippet()`: Account creation info
- `ssh_keys_snippet()`: SSH key setup guide
- `ssh_x11_snippet()`: X11 forwarding setup
- `thinlinc_snippet()`: ThinLinc client instructions

### Theme Customizations
- **Logo**: Purdue branding (`assets/purdue.png`)
- **Color Schemes**: Light/dark/auto with Material Design
- **Fonts**: Roboto (text), Consolas (code)
- **Custom CSS**: `stylesheets/extra.css`
- **Custom JS**: Table filtering, breadcrumbs

### Analytics
- Google Analytics (property: G-3D80JBWGP0)
- Page feedback widget (thumbs up/down)

## Best Practices

### Content
- Use admonitions for important notes/warnings
- Include code blocks with proper syntax highlighting
- Link to related pages within user guides
- Tag blog posts with appropriate categories (Anvil, Gautschi, Software, Slurm, Workflows)

### Version Control
- All automated commits include co-author: `Co-Authored-By: Warp <agent@warp.dev>`
- Bot commits use: `purduercac-docs-bot@users.noreply.github.com`

### Testing
- Always test locally before pushing to `main`
- Check that breadcrumbs render correctly after `mkdocs.yml` changes
- Verify software catalog after module file changes

## Future Enhancements
- **S3 Deployment**: Planned workflow to deploy to S3 bucket on `main` branch merge
- Additional automation opportunities as needed

## Key Files Reference
- `mkdocs.yml`: Main configuration, navigation, plugins
- `requirements.txt`: Python dependencies
- `main.py`: MkDocs macros
- `tools/Makefile`: Software catalog build automation
- `.github/workflows/`: CI/CD automation
- `.readthedocs.yaml`: Read the Docs build config

## Contact
- **Organization**: Rosen Center for Advanced Computing
- **Email**: rcac-help@purdue.edu
- **GitHub**: https://github.com/PurdueRCAC
- **Discord**: https://discord.gg/RmtKZmaQW9
