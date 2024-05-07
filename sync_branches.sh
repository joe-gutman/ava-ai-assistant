# Get the current working directory
cwd=$(pwd)

# Add and commit any existing changes
git add .
git commit -m "Saving before syncing"

# Get the list of specific branches
specific_branches=(server-web client-web client-windows)

# Iterate through each specific branch
for branch in "${specific_branches[@]}"
do
    git checkout main

    # Check if the subdirectory already exists
    subtree_folder_name=${branch//-/_}
    if [ ! -d "$subtree_folder_name" ]; then
        # Add the branch as a subtree and switch to it
        git subtree add --prefix=$subtree_folder_name origin/$branch --squash
    fi

    # Pull the subtree to update it
    git pull

    # Add a commit before adding the subtree
    git add .
    git commit -am "Syncing branch $branch"

done
