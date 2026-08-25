import { useState } from "react";
import styles from "./Login.module.css"
import { auth } from "../../services/auth";

const Login = () => {
    const [email, setEmail] =useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const data = await auth.login({email, password});
        console.log(data);
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
        </div>
    </>);
}

export default Login;