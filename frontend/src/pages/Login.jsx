import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"
import { auth } from "../services/auth";
import { TOKEN_KEY } from "../constant";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
                <Label htmlFor="email">Email:</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="someone@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Label htmlFor="password">Password:</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="***********"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            
            <Button type="submit" disabled={loading}>
                {loading ? "LOGGING IN...." : "LOGIN"}
            </Button>

            {error && <p className={styles["error"]}>{error}</p>}
        </form>
    </>);
}

export default Login;