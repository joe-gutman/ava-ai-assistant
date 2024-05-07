# Define the branches to sync
branches=("server-web" "client-web" "client-windows")

# Loop through each branch
for branch_name in "${branches[@]}"; do
    # Sync Branch Files
    branch_folder_name=$(echo $branch_name | sed 's/-/_/g')
    mkdir -p $branch_folder_name
    cd $branch_folder_name
    git checkout $branch_name -- "*/"

    # List copied files
    echo "Copied files for branch: $branch_name"
    ls -l $branch_folder_name
    echo ""
    cd ..
done