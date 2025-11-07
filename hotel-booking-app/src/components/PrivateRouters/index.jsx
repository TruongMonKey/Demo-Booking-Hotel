import { Navigate, Outlet } from "react-router";

function PrivateRouters() {
    let isLogin = false;
    if(localStorage.getItem("accessToken")){
        isLogin = true;
    } else {
        isLogin = false;
    }

    return(
        <>
            {isLogin ? (<Outlet />) : (<Navigate to="/auth" />)}
        </>
    )
}

export default PrivateRouters;