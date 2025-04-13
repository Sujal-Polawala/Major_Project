import { useEffect } from "react";
import { useNavigate } from "react-router";

const AuthRedirect = () => {
    const navigate = useNavigate();
    const sellerRole = parseInt(localStorage.getItem('sellerRole'), 10);
    useEffect(() => {
        if( sellerRole === 1){
            navigate("/seller/dashboard");
        }else if ( sellerRole === 0){
            navigate("admin/dashboard");
        }else {
            navigate("/login");
        }
    }, [sellerRole , navigate]);
    return null
}

export default AuthRedirect;