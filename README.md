# Kubernetes Deployment — MERN Stack (DealsDray)

A step-by-step guide to deploy Frontend, Backend, and MongoDB on Minikube.

---

## Project Structure

```
MerrnStackApp-EmployeeList/
├── k8s.yaml          ← All Kubernetes manifests
├── Dockerfile        ← Frontend Dockerfile
├── backend/
│   └── Dockerfile    ← Backend Dockerfile
└── src/
    └── axios.js      ← API base URL config
```

---

## Prerequisites

Make sure these are installed:

| Tool | Check Command |
|------|--------------|
| Docker | `docker --version` |
| Minikube | `minikube version` |
| kubectl | `kubectl version --client` |

---

## One-Time Setup

### 1. Start Minikube

```bash
minikube start
```

### 2. Get Minikube IP (save this!)

```bash
minikube ip
# Example output: 192.168.49.2
```


```

> ⚠️ Vite bakes env vars at build time — hardcode the IP here directly.

---

## Deploy Steps (Every Time)

### Step 1 — Build Docker Images

```bash
# Build frontend (from root folder)
docker build -t merrnstackapp:frontend .

# Build backend
docker build -t merrnstackapp:backend ./backend
```

### Step 2 — Load Images into Minikube

```bash
minikube image load merrnstackapp:frontend
minikube image load merrnstackapp:backend
```

### Step 3 — Apply Kubernetes Manifests

```bash
kubectl apply -f k8s.yaml
```

### Step 4 — Check All Pods Running

```bash
kubectl get pods
```

Expected output:
```
NAME                        READY   STATUS    RESTARTS   AGE
mongo-xxxx                  1/1     Running   0          1m
backend-xxxx                1/1     Running   0          1m
frontend-xxxx               1/1     Running   0          1m
```

> If STATUS shows `CrashLoopBackOff` or `Error` — see Troubleshooting below.

### Step 5 — Open in Browser

| App | URL |
|-----|-----|
| Frontend | http://192.168.49.2:30004 |
| Backend API | http://192.168.49.2:30002 |

---

## Test Backend API (Register User)

```bash
curl -X POST http://192.168.49.2:30002/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@gmail.com",
    "password": "123456"
  }'
```

---

## Check Data in MongoDB

```bash
# Go inside mongo pod
kubectl exec -it $(kubectl get pod -l app=mongo -o jsonpath='{.items[0].metadata.name}') -- mongosh

# Inside mongosh shell
use dealsdray
db.employees.find().pretty()
```

---

## Useful Commands

### Check Status

```bash
kubectl get pods          # Pod status
kubectl get svc           # Services and ports
kubectl get all           # Everything
```

### View Logs

```bash
kubectl logs -l app=frontend    # Frontend logs
kubectl logs -l app=backend     # Backend logs
kubectl logs -l app=mongo       # MongoDB logs

# Follow live logs
kubectl logs -l app=backend -f
```

### Check Images in Minikube

```bash
minikube image ls | grep merrnstackapp
```

### Restart a Deployment

```bash
kubectl rollout restart deployment/frontend
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/mongo
```

### Delete Everything and Redeploy

```bash
kubectl delete -f k8s.yaml
kubectl apply -f k8s.yaml
```

---

## Rebuild and Redeploy (After Code Changes)

```bash
# 1. Rebuild image
docker build -t merrnstackapp:frontend .

# 2. Reload into Minikube
minikube image load merrnstackapp:frontend

# 3. Restart pod
kubectl rollout restart deployment/frontend

# 4. Watch pod restart
kubectl get pods -w
```

---

## Troubleshooting

### Pod showing `ImagePullBackOff`

```bash
# Images not loaded into Minikube
minikube image load merrnstackapp:frontend
minikube image load merrnstackapp:backend
```

### Pod showing `CrashLoopBackOff`

```bash
# Check logs for error
kubectl logs -l app=backend
kubectl describe pod -l app=backend
```

### Registration Failed on Frontend

```bash
# 1. Check axios.js has correct Minikube IP
cat src/axios.js

# 2. Test backend directly
curl http://192.168.49.2:30002/

# 3. Check backend logs
kubectl logs -l app=backend
```

### Frontend not opening in browser

```bash
# Use port-forward as alternative
kubectl port-forward service/frontend 5173:5173

# Then open: http://localhost:5173
```

### MongoDB not connecting

```bash
# Check MONGODB_URI in k8s.yaml backend env
# Must be: mongodb://mongo:27017/dealsdray
kubectl logs -l app=backend | grep -i mongo
```

---

## Port Reference

| Service | Internal Port | External NodePort |
|---------|--------------|-------------------|
| Frontend | 5173 | 30004 |
| Backend | 5000 | 30002 |
| MongoDB | 27017 | none (internal only) |

---

## Stop Everything

```bash
# Stop all deployments
kubectl delete -f k8s.yaml

# Stop Minikube
minikube stop
```
