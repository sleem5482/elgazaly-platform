# Admin Access Blocking Documentation

This document explains where and how admin access is controlled in the application.

## Where Admin Access is Blocked

### 1. **ProtectedRoute Component** (`src/components/layout/ProtectedRoute.jsx`)

This is the **primary location** where admin access is controlled:

- **Line 10-12**: If no user is logged in, redirects to `/login`
- **Line 14-18**: If `allowedRoles` is specified and the user's role is not in the allowed roles list, redirects:
  - Admin users trying to access student-only pages → `/admin`
  - Student users trying to access admin-only pages → `/dashboard`
- **Line 21**: Admin users bypass grade checks (they can access any grade's content)

**Key Code:**
```jsx
if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
}
```

### 2. **AuthContext Component** (`src/context/AuthContext.jsx`)

This is where the user's role is **determined and set**:

- **Lines 17-22**: On initial load, if user data doesn't have a role, it's set based on `studentType`:
  - `studentType === 0` → `role = 'admin'`
  - Otherwise → `role = 'student'`

- **Lines 89-93**: During login, role is determined based on:
  - `loginType === 'Admin'` → `role = 'admin'`
  - `data.studentType === 0` → `role = 'admin'`
  - `data.role === 'admin'` → `role = 'admin'`
  - Otherwise → `role = 'student'`

**Key Code:**
```jsx
let userRole = 'student';
if (loginType === 'Admin' || data.studentType === 0 || data.role === 'admin') {
    userRole = 'admin';
}
```

### 3. **App.jsx Routes** (`src/App.jsx`)

All admin routes are wrapped with `ProtectedRoute` component with `allowedRoles={['admin']}`:

- **Lines 118-152**: All `/admin/*` routes require admin role
- If a non-admin user tries to access these routes, they are redirected by `ProtectedRoute`

**Example:**
```jsx
<Route path="/admin" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

## How to Fix Admin Access Issues

### If Admin Cannot Access Admin Pages:

1. **Check Login Type**: Ensure you're logging in with `loginType = 'Admin'` in the login form
2. **Check User Data**: Verify that after login, the user object has `role: 'admin'` or `studentType: 0`
3. **Check localStorage**: Check if `currentUser` in localStorage has the correct role
4. **Check API Response**: Verify the API returns `studentType: 0` or `role: 'admin'` for admin users

### Common Issues:

1. **Role Not Set Correctly**: If the user's role is not being set to 'admin' during login, check:
   - `src/context/AuthContext.jsx` lines 89-93
   - Ensure the API response includes `studentType: 0` or `role: 'admin'`

2. **localStorage Stale Data**: Clear localStorage and login again:
   ```javascript
   localStorage.removeItem('currentUser');
   ```

3. **ProtectedRoute Blocking**: Check `src/components/layout/ProtectedRoute.jsx` line 14 - ensure the user's role matches the `allowedRoles` array

## Testing Admin Access

To test if admin access is working:

1. Login with admin credentials (loginType = 'Admin')
2. Check browser console for user object - should have `role: 'admin'`
3. Navigate to `/admin` - should not redirect
4. Check localStorage - `currentUser` should have `role: 'admin'`
