import { Navigate, Outlet } from "react-router-dom";
import { TOKEN_KEY } from "../../constant";

const GuestRoute = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default GuestRoute;