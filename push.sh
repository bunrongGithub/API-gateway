#!/bin/bash

# Function to add changes, commit, and push
commit_and_push() {
  # Prompt for commit message
  read -p "Enter commit message: " commit_message
  # Add all changes to staging
  echo "Adding all changes..."
  git add .
  # Commit the changes
  echo "Committing changes..."
  git commit -m "$commit_message"
  # Get the current branch name
  current_branch=$(git branch --show-current)
  # Push the changes
  echo "Pushing changes to the remote repository on branch $current_branch..."
  git push origin "$current_branch"
  echo "Changes have been successfully committed and pushed!"
}
# Run commit and push process
commit_and_push
