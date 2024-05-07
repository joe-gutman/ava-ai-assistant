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
    # Check if the subdirectory already exists
    subtree_name=${branch//-/_}
    if [ ! -d "$subtree_name" ]; then
        # Add a commit before adding the subtree
        git commit -am "Syncing branch $branch"

        # Add the branch as a subtree and switch to it
        git subtree add --prefix=$subtree_name origin/$branch
        cd $subtree_name
    fi

    # Pull the subtree to update it
    git pull

    # Go back to the main directory
    cd ..
done
