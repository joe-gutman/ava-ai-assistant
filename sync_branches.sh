# Get the current working directory
cwd=$(pwd)

# Get the list of specific branches
specific_branches=(server-web client-web client-windows)

# Iterate through each specific branch
for branch in "${specific_branches[@]}"
do
    # Add the branch as a subtree and switch to it
    subtree_name=${branch//-/_}
    git subtree add --prefix=$subtree_name origin/$branch
    cd $subtree_name

    # Pull the subtree to update it
    git pull

    # Go back to the main directory
    cd ..
done