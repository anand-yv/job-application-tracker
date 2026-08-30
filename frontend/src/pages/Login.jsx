import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"
import { auth } from "../services/auth";
import { TOKEN_KEY } from "../constant";

const Login = () => {
    const [email, setEmail] =useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const req = await auth.login({ email, password });
            const data = req.data;

            localStorage.setItem(TOKEN_KEY, data.token);
            navigate("/dashboard");
        } catch (e) {
            setError(
                e.response?.data?.message ||
                "Something went wrong. Please try again."
            );
            console.error("Error:", e);
        }finally{
            setLoading(false);
        }
    };

    return (<>
        <form
            className={styles["container"]}
            onSubmit={handleLogin}
        >
            <div className={styles["input-container"]}>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="someone@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="***********"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "LOGGING IN...." : "LOGIN"}
            </button>

            {error && <p className={styles["error"]}>{error}</p>}
        </form>
    </>);
}

export default Login;