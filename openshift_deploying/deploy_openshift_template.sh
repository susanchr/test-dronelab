project_name=$(cat secrets.json | jq -r .project_name)
app_name=$(cat secrets.json | jq -r .app_name)
route_name=$(cat secrets.json | jq -r .route_name)

git_uri=$(cat secrets.json | jq -r .git_uri)
git_ref=$(cat secrets.json | jq -r .git_ref)
git_secret_name=$(cat secrets.json | jq -r .git_secret_name)
git_username=$(cat secrets.json | jq -r .git_username)
git_token=$(cat secrets.json | jq -r .git_token)

data_server=$(cat secrets.json | jq -r .data_server)
nginx_port=$(cat secrets.json | jq -r .nginx_port)

openshift_login=$(cat secrets.json | jq -r .openshift_login)

echo 'Project name is '$project_name' ignore the project name after the login command'

# OpenShift login... make sure it s the correct cluster 
echo "$OPENSHIFT_LOGIN_COMMAND" | bash

# echo $nginx_port; exit

# create the app
oc process -f openshift_template.yaml \
    -p project_name=$project_name \
    -p app_name=$app_name \
    -p route_name=$route_name \
    -p git_uri=$git_uri \
    -p git_ref=$git_ref \
    -p git_secret_name=$git_secret_name \
    -p git_username=$git_username \
    -p git_token=$git_token \
    -p data_server=$data_server \
    -p nginx_port=$nginx_port \
    -o yaml | oc create -f -

