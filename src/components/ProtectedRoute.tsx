import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types/auth';

interface Props {
  allow: Role[];
  children: ReactNode;
}

export default function ProtectedRoute({ allow, children }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allow.includes(user.role)) {
    const fallback = user.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
