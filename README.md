# README — Vue Project and Git/GitHub Learning Workflow

## Overview  
This repository contains my Vue application, which I used as a complete learning environment to practice real-world Git and GitHub workflows.  
Throughout this project, I applied professional version control techniques, branching strategies, conflict resolution, SSH authentication, Pull Request workflows, and CI/CD automation using GitHub Actions.

This project allowed me to strengthen both my development skills and my understanding of modern collaborative workflows used in software engineering teams.

---

## Phase 1 — Initial Setup (Git Basics)  
During the initial setup of this Vue project, I practiced:

- Creating a project directory  
- Initializing a Git repository with `git init`  
- Creating initial files such as `README.md` and Vue source files  
- Making the first commit  
- Creating a `.gitignore` file including entries such as:  
  - node_modules/  
  - dist/  
  - .env  

This phase helped me understand how to structure a clean repository from the beginning.

---

## Phase 2 — Branching, Merging, and Conflict Resolution (Intermediate Git)  
Using this project, I practiced:

- Creating feature branches with `git checkout -b`  
- Making isolated commits for each feature  
- Creating multiple branches from `main`  
- Intentionally generating merge conflicts by modifying the same lines in different branches  
- Resolving conflicts manually  
- Merging branches back into `main`  

This phase simulated real collaboration scenarios and taught me how to manage parallel work safely.

---

## Phase 3 — GitHub: Repositories, Pull Requests, Reviews, and Protection Rules  
Once the project was pushed to GitHub, I practiced:

- Creating and connecting a remote repository  
- Pushing branches with `git push -u origin`  
- Opening Pull Requests with descriptions and comments  
- Assigning reviewers  
- Reviewing and discussing changes  
- Configuring Branch Protection Rules, including:  
  - Requiring Pull Requests  
  - Requiring reviews  
  - Blocking force pushes  
  - Requiring passing checks  
- Creating a CODEOWNERS file to define responsibility for changes  

This phase helped me understand how teams collaborate and maintain code quality.

---

## Phase 4 — Professional Authentication (SSH Keys)  
To work securely with GitHub, I practiced:

- Generating an SSH key using `ssh-keygen -t ed25519`  
- Adding the public key to GitHub  
- Switching my remote URL to SSH using:  
  `git remote set-url origin git@github.com:username/repo.git`

This improved my workflow by enabling secure, password‑less authentication.

---

## Phase 5 — GitHub Actions (CI/CD Basics)  
I created a complete CI workflow inside `.github/workflows/ci.yml`, which includes:

- Triggers for push and pull_request  
- Checkout step  
- Node environment setup  
- Dependency installation  
- Tests (if present)  
- Vue build  
- Uploading build artifacts  

This allowed me to validate every commit and Pull Request automatically, similar to a real production pipeline.

---

## Vue Project Setup  
Install dependencies:

```
npm install
```

Run the development server:

```
npm run dev
```

Build for production:

```
npm run build
```

