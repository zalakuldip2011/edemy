# 📱 Mobile Network Access Setup Guide

## Problem
Unable to access the Edemy website from phone when both laptop and phone are on the same WiFi network.

## Solution Applied

### Changes Made:

#### 1. **Backend Server (backend/server.js)**
- Changed server to listen on `0.0.0.0` (all network interfaces) instead of just `localhost`
- Updated CORS to allow connections from local network IPs
- Added automatic network IP detection and display on server start

#### 2. **Frontend Configuration (frontend/package.json & .env)**
- Updated start script to accept connections from network
- Created `.env` file with network access settings

---

## 🚀 How to Use

### Step 1: Find Your Laptop's IP Address

**Windows (PowerShell/CMD):**
```cmd
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (e.g., `192.168.1.100`)

**macOS/Linux:**
```bash
ifconfig
# or
ip addr show
```

### Step 2: Start Your Servers

**Terminal 1 - Backend:**
```cmd
cd backend
npm start
```
The server will now display URLs like:
```
🚀 Server running on http://0.0.0.0:5000
📱 Access from other devices on your network:
   http://192.168.1.100:5000
```

**Terminal 2 - Frontend:**
```cmd
cd frontend
npm start
```
The frontend will display:
```
On Your Network:  http://192.168.1.100:3000
```

### Step 3: Access from Phone

On your phone's browser, go to:
```
http://192.168.1.100:3000
```
(Replace `192.168.1.100` with YOUR laptop's actual IP address)

---

## ⚠️ Troubleshooting

### Issue: Can't connect from phone

**Solution 1: Check Windows Firewall**
```cmd
# Run as Administrator
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=5000
netsh advfirewall firewall add rule name="React Dev Server" dir=in action=allow protocol=TCP localport=3000
```

**Solution 2: Temporarily disable Windows Firewall**
- Open Windows Security
- Go to "Firewall & network protection"
- Turn off for "Private networks" (your home WiFi)
- **Remember to turn it back on later!**

**Solution 3: Check if servers are listening**
```cmd
netstat -an | findstr "3000"
netstat -an | findstr "5000"
```
You should see `0.0.0.0:3000` and `0.0.0.0:5000`

### Issue: CORS errors in phone browser

**Check:**
1. Make sure both laptop and phone are on the SAME WiFi network
2. Use `http://` not `https://`
3. Use the exact IP address shown by the servers
4. Clear browser cache on phone

### Issue: Connection refused

**Check:**
1. Backend server is running (`npm start` in backend folder)
2. Frontend server is running (`npm start` in frontend folder)
3. No VPN is active on laptop
4. Router is not blocking local network traffic (unlikely but possible)

---

## 🔒 Security Notes

### Development Mode (Current Setup)
- ✅ Allows all local network access
- ✅ CORS allows connections from 192.168.x.x addresses
- ⚠️ Only use on trusted networks (your home WiFi)

### Production Mode (When Deploying)
- ❌ Never deploy with `DANGEROUSLY_DISABLE_HOST_CHECK=true`
- ❌ Never deploy with `HOST=0.0.0.0` in frontend
- ✅ Use proper domain names and SSL certificates
- ✅ Restrict CORS to your production domain

---

## 📝 Configuration Files Modified

### 1. `backend/server.js`
- Server listens on `0.0.0.0` (all interfaces)
- CORS allows local network IPs (192.168.x.x pattern)
- Displays network IPs on startup

### 2. `frontend/package.json`
- Start script includes `HOST=0.0.0.0`

### 3. `frontend/.env` (New File)
```env
HOST=0.0.0.0
HTTPS=false
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

---

## 🎯 Quick Reference

| Device | URL to Use |
|--------|------------|
| Laptop Browser | `http://localhost:3000` |
| Phone Browser | `http://192.168.1.100:3000` (use YOUR IP) |
| Backend API | `http://192.168.1.100:5000` (use YOUR IP) |

---

## 🔄 Reverting Changes (For Production)

If you need to revert to localhost-only access:

1. **backend/server.js**: Change `HOST` back to `'localhost'`
2. **frontend/package.json**: Remove `set HOST=0.0.0.0&&` from start script
3. **frontend/.env**: Delete this file or set `HOST=localhost`

---

## ✅ Verification Steps

1. Start backend server - should show network IP
2. Start frontend server - should show "On Your Network" URL
3. Open laptop browser: `http://localhost:3000` ✓
4. Open phone browser: `http://192.168.1.100:3000` ✓
5. Try logging in from phone ✓

---

## 🆘 Still Having Issues?

1. **Restart both servers** after making changes
2. **Clear phone browser cache** (Settings > Browser > Clear Data)
3. **Try a different browser** on phone (Chrome, Firefox, Safari)
4. **Check both devices show same WiFi network name**
5. **Restart your router** (as a last resort)

---

## Example: Complete Setup Process

```cmd
# Terminal 1: Backend
cd K:\DEV\Projects\Edemy\backend
npm start
# Note the IP shown: http://192.168.1.100:5000

# Terminal 2: Frontend
cd K:\DEV\Projects\Edemy\frontend
npm start
# Note the IP shown: http://192.168.1.100:3000

# On Phone:
# Open browser and go to: http://192.168.1.100:3000
# (Replace with your actual IP)
```

---

**Last Updated:** November 13, 2025
**Status:** ✅ Configured for local network access
