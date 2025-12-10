import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles, allowedGrade }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If student tries to access admin, or vice versa (though admin usually has all access)
        // For now, just redirect to home or dashboard
        return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    }

    // Admin bypasses grade check
    if (user.role === 'admin') return children;

    if (allowedGrade && user.grade !== allowedGrade) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
