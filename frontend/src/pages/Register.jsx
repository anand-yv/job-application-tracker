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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            setLoading(true);
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
        } finally{
            setLoading(false);
        }
    }

    return (<>
        <form className={styles["container"]} onSubmit={handleRegister}>
            <div className={styles["input-container"]}>
                <label htmlFor="email">Email : </label>
                <input id="email" type="email" value={email} placeholder="someone@gmail.com" onChange={(e) => setEmail(e.target.value)}/>
                <label htmlFor="password">Password : </label>
                <input id="password" type="password" value={password} placeholder="***********" onChange={(e) => setPassword(e.target.value)}/>
                 <label htmlFor="confirm-password" >Confirm Password : </label>
                <input id="confirm-password" type="password" value={confirmPassword} placeholder="***********" onChange={(e) => setConfirmPassword(e.target.value)}/>                
            </div>
            <button type="submit" disabled={loading}>{loading ? "CREATING..." : "CREATE"}</button>
            {error && <p className={styles["error"]}>{error}</p>}
        </form>
    </>);
}

export default Register;