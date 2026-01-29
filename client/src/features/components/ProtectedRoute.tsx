import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";


interface ProtectecRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectecRouteProps> = ({children}) => {
    
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if(!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    
    return (
        <div>
            {children}
        </div>
    );
};

export default ProtectedRoute;