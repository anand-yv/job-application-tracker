import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css"
import { auth } from "../services/auth";
import { TOKEN_KEY } from "../constant";

const Register = () => {
    const [email, setEmail] =useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword]  =useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async () => {
        try{

            setError(null);
            if(password !== confirmPassword){
                setError("Password and confirm password should be same.");
                return;
            }
            const req = await auth.register({email, password});
            const data = req.data;
            localStorage.setItem(TOKEN_KEY, data.token);
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
                 <label>Confirm Password : </label>
                <input type="password" value={confirmPassword} placeholder="***********" onChange={(e) => setConfirmPassword(e.target.value)}/>                
            </div>
            <button onClick={handleRegister}>REGISTER</button>
            {error && <p className={styles["error"]}>{error}</p>}
        </div>
    </>);
}

export default Register;