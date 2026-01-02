# GitHub Repository Setup

## Step 1: Create Repository on GitHub
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `nixty` (or your preferred name)
3. Description: "Galaxy-themed e-commerce platform for digital products"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 2: Push Your Code
After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/nixty.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

## Step 3: Authentication
When prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your password)
  - Create one at: https://github.com/settings/tokens
  - Select scopes: `repo` (full control of private repositories)

## Alternative: Using GitHub CLI
If you have GitHub CLI installed:
```bash
gh repo create nixty --public --source=. --remote=origin --push
```
