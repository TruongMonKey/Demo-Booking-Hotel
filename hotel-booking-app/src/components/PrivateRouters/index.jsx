import { Navigate, Outlet, useLocation } from "react-router";

function hasAdminRole() {
    const rolesStr = localStorage.getItem("roles");
    if(!rolesStr) return false;
    try {
        const roles = JSON.parse(rolesStr);
        return Array.isArray(roles) && roles.some(r => r.name === "ROLE_ADMIN");
    } catch {
        return false;
    }
}

function PrivateRouters() {
    const location = useLocation();
    const isLogin = !!localStorage.getItem("accessToken");
    if (location.pathname.startsWith("/admin")) {
        if (!isLogin || !hasAdminRole()) {
            return <Navigate to="/auth" />;
        }
    } else {
        if (!isLogin) {
            return <Navigate to="/auth" />;
        }
    }
    return <Outlet />;
}

export default PrivateRouters;