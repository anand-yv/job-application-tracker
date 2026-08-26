import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"
import { auth } from "../services/auth";
import { TOKEN_KEY } from "../constant";

const Login = () => {
    const [email, setEmail] =useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try{
            setError(null);
            const req = await auth.login({email, password});
            const data = req.data;
            localStorage.setItem(TOKEN_KEY, data.token)
            navigate("/dashboard");
        }catch(e){
            setError(e.response?.data?.message || "Something went wrong. Please try again.");
            console.error("Error : ", e.response);
        }
    }

    return (<>
        <div className={styles["container"]}>
            <div className={styles["input-container"]}>
                <label>Email : </label>
                <input type="email" value={email} placeholder="someone@gmail.com" onChange={(e) => setEmail(e.target.value)}/>
                <label>Password : </label>
                <input type="password" value={password} placeholder="***********" onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button onClick={handleLogin}>LOGIN</button>
            {error && <p className={styles["error"]}>{error}</p>}
        </div>
    </>);
}

export default Login;