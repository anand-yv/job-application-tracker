import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Headers.module.css"
import { Button } from "@/components/ui/button";

const Headers = () => {
    const {user, logout} = useAuth();
    const {theme, toogleTheme} = useTheme();
    const navigate = useNavigate();

    const getInitials = (email) => email?.[0]?.toUpperCase() || "?";

    return  <>
        <header className={styles["header"]}>
            <div onClick={() => navigate("/dashboard")} className={styles.logo}>
                JSJSJ
            </div>

            <div className={styles.actions}>
                <Button variant="ghost" onClick={toogleTheme}>
                    {theme === "light" ? "🌙" : "☀️"}
                </Button>

                {user ? (
                    <div className={styles.avatar}>{getInitials(user.email)}</div>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </header>
    </>
}

export default Headers;