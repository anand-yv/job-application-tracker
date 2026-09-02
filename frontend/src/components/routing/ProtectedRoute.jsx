import { Navigate, Outlet } from "react-router-dom";
import { TOKEN_KEY } from "../../constant";

const ProtectedRoute = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;