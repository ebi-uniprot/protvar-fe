#!/usr/bin/env bash
set -e  # Exit on error
set -x

# Parse arguments and export them as environment variables
for ARG in "$@"; do
   KEY="${ARG%%=*}"
   VALUE="${ARG#*=}"
   export "$KEY"="$VALUE"
   echo "Argument: $KEY=$VALUE"
done

# Validate ENV
case "$ENV" in
  PB|FB|DV) ;;
  *)
    echo "Invalid ENV value. Must be PB, FB, or DV."
    echo "Provided: ***${ENV}***"
    exit 1
    ;;
esac

# Validate required variables
for VAR in APP_NAME K8S_NAMESPACE; do
  if [ -z "${!VAR}" ]; then
    echo "Error: $VAR is required but not set."
    exit 1
  fi
done

# Assign K8S_GENERAL based on ENV
case "$ENV" in
  FB) K8S_GENERAL="GENERAL_K8S_HX" ;;
  PB) K8S_GENERAL="GENERAL_K8S_HL" ;;
  DV) K8S_GENERAL="GENERAL_K8S_DV" ;;
esac

echo "--- Deploying: ${APP_NAME} on ${K8S_GENERAL} cluster ---"

mkdir -p ~/.kube
cat "${!K8S_GENERAL}" > ~/.kube/config
chmod 700 ~/.kube/config

kubectl cluster-info || { echo 'Cannot reach cluster'; exit 1; }

# Ensure namespace exists
kubectl create namespace "${K8S_NAMESPACE}" || echo "Namespace ${K8S_NAMESPACE} already exists"
kubectl config set-context --current --namespace="${K8S_NAMESPACE}"

# Create Docker registry secrets
kubectl create secret docker-registry "${APP_NAME}-gitlab-registry-ci" \
  --docker-server="$CI_REGISTRY" --docker-username="$CI_REGISTRY_USER" --docker-password="$CI_REGISTRY_PASSWORD" \
  -o yaml --dry-run=client | kubectl apply -f -

kubectl create secret docker-registry "${APP_NAME}-gitlab-registry-to" \
  --docker-server="$CI_REGISTRY" --docker-username="$CI_DEPLOY_USER" --docker-password="$CI_DEPLOY_PASSWORD" \
  -o yaml --dry-run=client | kubectl apply -f -

# Main deployment
kubectl apply -f deploy/k8s_deploy.yml

# Restart and check rollout status
kubectl rollout restart "deployment.apps/$APP_NAME"
kubectl rollout status "deployment.apps/$APP_NAME" || { echo "Deployment failed!"; exit 1; }

# Display deployed services
kubectl get all
echo "--- Deployment Successful: ${APP_NAME} on ${K8S_GENERAL} cluster ---"

# Show exposed service endpoints
NODE_HOST_NAME=$(kubectl get nodes -o=jsonpath='{.items[0].status.addresses[?(@.type=="Hostname")].address}')
for SERVICE in $(kubectl get services -o=jsonpath='{.items[*].metadata.name}'); do
  NODE_PORT=$(kubectl get services "${SERVICE}" -o=jsonpath='{.spec.ports[0].nodePort}')
  if [[ -n "$NODE_PORT" ]]; then
    echo "Service '${SERVICE}' available at: http://${NODE_HOST_NAME}:${NODE_PORT}"
  fi
done