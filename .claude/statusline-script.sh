#!/bin/bash

# Read JSON input
input=$(cat)

# Extract current working directory from JSON
current_dir=$(echo "$input" | jq -r '.workspace.current_dir')

# Navigate to the directory to get git information
cd "$current_dir" 2>/dev/null || cd /mnt/c/Users/user/Documents/Yippine/Program/Canvas-Verse

# Get git user name
git_user=$(git config --global user.name 2>/dev/null || echo "Unknown")

# Get relative path from project root
project_root="/mnt/c/Users/user/Documents/Yippine/Program/Canvas-Verse"
if [[ "$current_dir" == "$project_root"* ]]; then
    relative_path="${current_dir#$project_root}"
    if [[ -z "$relative_path" ]]; then
        relative_path="/"
    fi
else
    relative_path="$current_dir"
fi

# Get current git branch
git_branch=$(git branch --show-current 2>/dev/null || echo "no-branch")

# Get latest commit message full text (as requested)
commit_message=$(git log -1 --pretty=format:"%s" 2>/dev/null || echo "no-commit")

# Use printf with colors (terminal will display them dimmed)
printf "\033[95m%s\033[0m | \033[93m%s\033[0m | \033[92m%s\033[0m | \033[94m%s\033[0m" \
    "$git_user" \
    "$relative_path" \
    "$git_branch" \
    "$commit_message"
