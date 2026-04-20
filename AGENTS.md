# RCAC Documentation Website
## Project Overview
This is the MkDocs-based documentation website for the **Rosen Center for Advanced Computing (RCAC)** at Purdue University. It provides comprehensive user guides, tutorials, reference material, software catalogs, datasets, blog articles, and workshop materials for RCAC's HPC systems (Anvil and Gautschi).

**Primary URL**: https://docs.rcac.purdue.edu (served from the Geddes Kubernetes cluster)
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
├── .github/
│   ├── ISSUE_TEMPLATE/      # Bug/feature request templates
│   └── workflows/           # GitHub Actions automation
├── docs/                    # Main documentation content
│   ├── assets/              # Images, CSS, JS, fonts, data files
│   ├── blog/                # Blog posts
│   ├── datasets/            # Dataset documentation
│   ├── snippets/            # Reusable content snippets
│   ├── software/            # Software catalog pages (auto-generated)
│   ├── stylesheets/         # extra.css and theme overrides
│   ├── userguides/          # User guides (Anvil, Gautschi)
│   ├── workshops/           # Workshop materials (HPC Exchange, Matplotlib, etc.)
│   ├── contact.md           # Contact page
│   ├── faq.md               # FAQ page
│   ├── index.md             # Homepage
│   ├── tags.md              # Tag index page
│   └── templates.md         # Template examples
├── hooks/                   # MkDocs hooks (e.g., social media)
├── k8s/geddes-prod/         # Kubernetes manifests for production deployment
├── modulefiles/             # HPC module files (software installations)
├── overrides/               # Material theme customizations (main.html, partials)
├── tools/                   # Automation scripts for software catalog
├── .gitignore
├── .readthedocs.yaml        # Read the Docs configuration (legacy/secondary)
├── Dockerfile.geddes-prod   # Image built and pushed to GHCR for Geddes
├── main.py                  # MkDocs macros plugin definitions
├── mkdocs.yml               # MkDocs configuration
├── README.md
└── requirements.txt         # Python dependencies
```
## Technology Stack
### Core Technologies
- **MkDocs**: Static site generator (v1.6.1)
- **Material for MkDocs**: Theme (v9.6.16)
- **Python 3.x**: Runtime environment (Dockerfile uses `python:3.11-slim`)
- **GitHub Actions**: CI/CD automation
- **Docker / GHCR**: Production image at `ghcr.io/purduercac/rcac-docs-prod:latest` (served by `nginx:alpine`)
- **Kubernetes (Geddes)**: Production hosting in the `rcac-docs` namespace
### Key MkDocs Plugins
- `mkdocs-material`: Material Design theme
- `mkdocs-material-extensions`
- `material/blog` (built-in blog plugin): Blog functionality with categories and pagination
- `material/tags` (built-in tags plugin): Content tagging
- `mkdocs-git-revision-date-localized-plugin`: Git-based timestamps
- `mkdocs-macros-plugin`: Dynamic content macros (see `main.py`)
- `search`: Built-in search
### Markdown Extensions
- `pymdownx` (details, blocks.caption, emoji, snippets, highlight, inlinehilite, superfences, tabbed)
- `admonition`: Callout boxes
- `tables`: Table support
- `attr_list` and `md_in_html`: HTML attributes / inline HTML in markdown
- `toc`: Table of contents with permalinks
## Content Organization
### Major Sections
1. **HPC User Guides**: Comprehensive guides for Anvil and Gautschi clusters (plus external links to Bell, Negishi, Gilbreth, Scholar)
2. **Storage User Guides**: External links to Data Depot, Fortress, Scratch, Home, Box
3. **Blog**: News and updates categorized by system/topic (Anvil, Gautschi, Software, Slurm, Workflows)
4. **Software Catalog**: Auto-generated catalog of available software
5. **Datasets**: AI, Hydrological, Meteorological, Geospatial, Covariates, GeoAI, Igenomes
6. **Workshops**: HPC Exchange (weeks 1–4), Anvil Kubernetes, Scientific Visualization with Matplotlib
7. **FAQs** and **Contact** pages
### Software Catalog System
The software catalog is **automatically generated** from HPC module files:
**Process Flow**:
1. `modulefiles/` → Module files for installed software
2. `tools/update_apps_inventory.sh` → Extracts app names, versions, clusters → `rcac_apps_inventory.json`
3. `tools/generate_apps_topics.py` → Categorizes apps by topic → `apps_topics.json`
4. `tools/gen_apps_descriptions.py` and `tools/update_apps_descriptions_from_inventory.sh` → Fetches descriptions from Spack / Wikipedia / PyPI → `apps_descriptions.json`
5. `tools/generate_md.sh` → Creates individual markdown files under `docs/software/apps_md/`
6. `tools/update_apps_catalog.sh` → Updates catalog index page `docs/software/app_catalog.md`
**Topics**: MPI, Compilers, Audio/Visual, Climate, Chemistry, Fluid Dynamics, Geoscience, Library, Material Science, Math/Stat, Engineering, Programming, Utilities, Workflow, Misc.
## Automation & Workflows
### Branches
- `main`: production branch; changes here deploy to https://docs.rcac.purdue.edu
- `dev`: development/staging branch; `main` is automatically merged into `dev` (with dev-only files preserved)
- Direct PRs from `dev` into `main` are **blocked** by CI
### GitHub Actions
#### 1. `deploy_to_geddes_prod.yml` — **primary production deployment**
- **Triggers**: Push to `main` (excluding `modulefiles/**`, `tools/**`, `wcag_audit/**`); also manual `workflow_dispatch`
- **Process**:
  1. Logs into GHCR with `GITHUB_TOKEN`
  2. Builds `Dockerfile.geddes-prod` (multi-stage: `python:3.11-slim` → `mkdocs build` → `nginx:alpine`)
  3. Pushes `ghcr.io/purduercac/rcac-docs-prod:latest`
- **Rollout**: The in-cluster `rcac-docs-prod-restart` CronJob (every 5 minutes) runs `kubectl rollout restart deployment/rcac-docs-prod -n rcac-docs`, which re-pulls `:latest` (because `imagePullPolicy: Always`)
#### 2. `publish_to_s3.yml` — secondary/legacy S3 publish
- **Triggers**: Completion of the catalog rebuild workflow, push to `main`/`auto_publish` (excluding `modulefiles/**` and `tools/**`), or `workflow_dispatch`
- **Process**: Builds the site and syncs to the Ceph S3 bucket `s3://rcac-docs/` at `https://s3.rcac.purdue.edu`
- **Status**: No longer the canonical production target; retained for mirror/backup purposes
#### 3. `rebuild_on_module_tools_change.yml`
- **Triggers**: Push to `main` or `dev` when `modulefiles/**` or `tools/**` change
- **Purpose**: Automatically regenerate the software catalog
- **Process**:
  1. Runs `make` in `tools/`
  2. Stages/rebases/commits updated catalog files (`docs/software/apps_md/`, `app_catalog.md`, `index.md`)
  3. Pushes using GitHub App token (`purduercac-docs-bot`)
#### 4. `update_breadcrumbs.yml`
- **Triggers**: Push to `main` or `dev` when `mkdocs.yml` changes
- **Purpose**: Regenerate navigation breadcrumbs
- **Process**: Runs `tools/generate_breadcrumbs.py`, updates `docs/assets/data/breadcrumbs.json`, commits via App token
- **Logic**: Only includes parent titles if parent has an `index.md`; root `/` is excluded
#### 5. `sync_main_to_dev.yml`
- **Triggers**: Push to `main`; manual `workflow_dispatch`
- **Purpose**: Keep `dev` current with `main` while preserving dev-only framework files (`docs/stylesheets/`, `overrides/partials/toc.html`, `a11y.js` entry in `mkdocs.yml`)
#### 6. `block_dev_to_main.yml`
- **Triggers**: Pull requests targeting `main`
- **Purpose**: Fail CI if the PR source branch is `dev` (prevents direct dev→main merges)
### Kubernetes Deployment (Geddes)
Manifests live in `k8s/geddes-prod/` and are applied to the `rcac-docs` namespace on the Geddes cluster:
- `deployment.yaml`: `rcac-docs-prod` Deployment, 1 replica, image `ghcr.io/purduercac/rcac-docs-prod:latest`, `imagePullPolicy: Always`, `imagePullSecrets: ghcr-secret`, modest CPU/memory limits
- `service.yaml`: `ClusterIP` Service exposing port 80
- `ingress.yaml`: `ingressClassName: public`, TLS host `docs.rcac.purdue.edu` (secret `rcac-docs-prod-tls`)
- `cronjob.yaml`: `rcac-docs-prod-restart` CronJob running every 5 minutes; uses `bitnami/kubectl` (from `geddes-registry.rcac.purdue.edu/docker-hub-cache/`) with a mounted `kubeconfig-secret` to `kubectl rollout restart` the deployment so new `:latest` images are pulled
### GitHub App Bot
- **Name**: `purduercac-docs-bot`
- **Purpose**: Automated commits that push to `main`/`dev` without triggering recursive workflows
- **Configuration**: `PURDUERCAC_DOCS_BOT_APP_ID` and `PURDUERCAC_DOCS_BOT_PRIVATE_KEY` in repository secrets; commits authored as `purduercac-docs-bot@users.noreply.github.com`
### Read the Docs Integration
- `.readthedocs.yaml` is still present (Ubuntu 24.04, Python 3, `pip install -r requirements.txt`) but is **no longer the primary deployment path**. The Geddes/Kubernetes pipeline above serves `docs.rcac.purdue.edu`.
## Development Workflow
### Local Development Setup
```bash
# Clone repository
git clone git@github.com:PurdueRCAC/RCAC-Docs.git
cd RCAC-Docs

# Create Python environment (conda or venv)
conda create -n rcac-docs python
conda activate rcac-docs

# Install dependencies
python -m pip install -r requirements.txt

# Start local server
mkdocs serve                     # Default: http://localhost:8000
mkdocs serve -a localhost:8080   # Custom port
```
### Local Production-Image Build (optional)
```bash
docker build -f Dockerfile.geddes-prod -t rcac-docs-prod:local .
docker run --rm -p 8080:80 rcac-docs-prod:local
```
### Making Changes
#### Content Changes
1. Edit markdown files in `docs/`
2. Test locally with `mkdocs serve`
3. Open a PR into `main` (do **not** PR from `dev` into `main` — it is blocked by CI)
4. On merge to `main`, `deploy_to_geddes_prod.yml` builds and pushes the image; the Geddes CronJob rolls the deployment within ~5 minutes
#### Software Catalog Updates
1. Add/modify module files in `modulefiles/`
2. Push/merge to `main` (or `dev`)
3. `rebuild_on_module_tools_change.yml` runs `make` and bot-commits the regenerated catalog
#### Navigation Changes
1. Edit `nav:` in `mkdocs.yml`
2. Push/merge to `main` (or `dev`)
3. `update_breadcrumbs.yml` regenerates `docs/assets/data/breadcrumbs.json`
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
Reusable content snippets defined as Python functions (via `mkdocs-macros-plugin`):
- `login_snippet(host, cluster)`: SSH login instructions
- `account_snippet(host, cluster)`: Account creation info
- `ssh_keys_snippet(resource)`: SSH key setup guide (macOS/Linux/Windows/PuTTY)
- `ssh_x11_snippet(resource)`: X11 forwarding setup
- `thinlinc_snippet(resource)`: ThinLinc client instructions
### MkDocs Hooks
- `hooks/socialmedia.py`: Social-media share button support (currently commented out in `mkdocs.yml`)
### Theme Customizations
- **Logo/Favicon**: Purdue branding (`docs/assets/purdue.png`, `docs/assets/purdue_favicon.png`)
- **Color Schemes**: Auto / light / dark (Material palette toggles)
- **Fonts**: Roboto (text), Consolas (code)
- **Custom CSS**: `docs/stylesheets/extra.css`
- **Custom JS**: `docs/assets/js/` — `tablefilter.js`, `init-tablefilter.js`, `breadcrumbs.js`, `external-links.js` (plus `a11y.js` on `dev`)
- **Theme overrides**: `overrides/main.html` and `overrides/partials/`
### Analytics & Feedback
- Google Analytics (property: `G-3D80JBWGP0`)
- Page feedback widget (thumbs up/down) with link to a feedback issue template
## Best Practices
### Content
- Use admonitions for important notes/warnings
- Include code blocks with proper syntax highlighting
- Link to related pages within user guides
- Tag blog posts with appropriate categories (Anvil, Gautschi, Software, Slurm, Workflows)
### Version Control
- Prefer landing changes on `main` via PR; let `sync_main_to_dev.yml` forward them to `dev`
- Oz-assisted commits include trailer: `Co-Authored-By: Oz <oz-agent@warp.dev>`
- Bot commits are authored as: `purduercac-docs-bot@users.noreply.github.com`
### Testing
- Always test locally with `mkdocs serve` before pushing
- Optionally validate the production image with `docker build -f Dockerfile.geddes-prod`
- Verify breadcrumbs render correctly after `mkdocs.yml` changes
- Verify software catalog after module file changes
## Key Files Reference
- `mkdocs.yml`: Main configuration, navigation, plugins, markdown extensions
- `requirements.txt`: Python dependencies (pinned)
- `main.py`: MkDocs macros
- `hooks/socialmedia.py`: Optional social-share hook
- `tools/Makefile` and `tools/README.md`: Software catalog build automation
- `Dockerfile.geddes-prod`: Production image for Geddes (builder + nginx serve stage)
- `k8s/geddes-prod/*.yaml`: Kubernetes Deployment, Service, Ingress, CronJob
- `.github/workflows/`: CI/CD automation (deploy to Geddes, S3 mirror, catalog, breadcrumbs, branch sync/guards)
- `.readthedocs.yaml`: Read the Docs build config (secondary)
## Contact
- **Organization**: Rosen Center for Advanced Computing
- **Email**: rcac-help@purdue.edu
- **GitHub**: https://github.com/PurdueRCAC
- **Discord**: https://discord.gg/RmtKZmaQW9
