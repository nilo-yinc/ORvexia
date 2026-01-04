# Postman API Testing Guide

## Base URL
```
http://localhost:3000
```

## API Endpoints

### 1. Register User
**Endpoint:** `POST /api/v1/users/register`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (201):**
```json
{
  "status": true,
  "message": "User registered successfully, please verify your email address",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": false
  }
}
```

**Notes:**
- Password must be at least 6 characters
- Email must be unique
- A verification email will be sent (if email is configured)

---

### 2. Verify Email
**Endpoint:** `GET /api/v1/users/verify/:token`

**Example:**
```
GET http://localhost:3000/api/v1/users/verify/abc123def456...
```

**Expected Response (200):**
```json
{
  "status": true,
  "message": "Email verified successfully"
}
```

**Notes:**
- Token is sent via email after registration
- Token expires in 10 minutes
- You can get the token from the database or email

---

### 3. Login
**Endpoint:** `POST /api/v1/users/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "status": true,
  "message": "User logged in successfully"
}
```

**Notes:**
- Sets `accessToken` and `refreshToken` as HTTP-only cookies
- User must be verified before login
- Cookies are automatically sent with subsequent requests

---

### 4. Get Profile (Protected)
**Endpoint:** `GET /api/v1/users/get-profile`

**Headers:**
```
Content-Type: application/json
```

**Cookies:**
- `accessToken` and `refreshToken` (automatically sent by Postman if cookies are enabled)

**Expected Response (200):**
```json
{
  "status": true,
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true,
    "role": "user"
  }
}
```

**Notes:**
- Requires authentication (cookies with tokens)
- Tokens are automatically refreshed if needed

---

### 5. Logout (Protected)
**Endpoint:** `POST /api/v1/users/logout`

**Headers:**
```
Content-Type: application/json
```

**Cookies:**
- `accessToken` and `refreshToken` (automatically sent by Postman if cookies are enabled)

**Expected Response (200):**
```json
{
  "status": true,
  "message": "User logged out successfully"
}
```

**Notes:**
- Requires authentication
- Clears refresh token from database
- Clears cookies

---

## Postman Setup Instructions

### Step 1: Enable Cookie Management
1. Open Postman Settings (gear icon)
2. Go to "General" tab
3. Enable "Automatically follow redirects"
4. Go to "Cookies" tab
5. Enable "Manage cookies automatically"

### Step 2: Create a Collection
1. Create a new Collection named "Orvexia Auth API"
2. Add all the requests above to the collection

### Step 3: Testing Flow

**Complete Flow:**
1. **Register** → Get verification token from response or database
2. **Verify Email** → Use token from step 1
3. **Login** → Cookies will be automatically saved
4. **Get Profile** → Should work with saved cookies
5. **Logout** → Clears cookies

### Step 4: Manual Cookie Testing (if needed)

If cookies aren't working automatically:

1. After **Login**, check the response headers for `Set-Cookie`
2. Copy the cookie values
3. For protected routes, add a header:
   ```
   Cookie: accessToken=<token_value>; refreshToken=<token_value>
   ```

---

## Common Issues

### Issue: "Unauthorized access"
- **Solution:** Make sure you've logged in first and cookies are being sent

### Issue: "User already exists"
- **Solution:** Use a different email or delete the user from database

### Issue: "Please verify your email address"
- **Solution:** Complete the email verification step first

### Issue: Cookies not working
- **Solution:** 
  1. Check Postman cookie settings
  2. Use Postman's "Cookies" button to manually manage cookies
  3. Or use the Cookie header method mentioned above

---

## Testing Checklist

- [ ] Server is running on port 3000
- [ ] MongoDB is connected
- [ ] Register a new user
- [ ] Verify email (get token from DB or email)
- [ ] Login with verified user
- [ ] Get profile (should work with cookies)
- [ ] Logout (should clear cookies)
- [ ] Try accessing protected route after logout (should fail)

