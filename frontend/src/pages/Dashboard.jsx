import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { applications } from "../services/applications";
import styles from "./Dashboard.module.css"
import { useTheme } from "../context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "../constant";

const Dashboard = () => {
    const [userApplications, setUserApplications] = useState([]);
    const [loading, setLoading] = useState(true);   
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const {theme, toogleTheme} = useTheme();

    const fetchApplications = useCallback(async () => {
        try{
            setLoading(true);
            setError(null);
            const res = await applications.getAll();
            const data = res.data;
            setUserApplications(data);
        }catch(e){
            setError(e.response?.data?.message || "Something went wrong. Please try again.");
            console.error('Error : ', e)
        }finally{
            setLoading(false);
        }
    }, []);
    
    useEffect(() => {
        fetchApplications();
    }, [])
    

    return (<>
        <div className={styles["container"]}>
            <div className={styles["header"]}>
                <h4>Applications </h4>
                <button onClick={fetchApplications}>REFERESH</button>
                <button onClick={() => {navigate("/applications/new")}}>CREATE APPLICATION</button>
                <button onClick={toogleTheme}>{theme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME}</button>
            </div>
            
            {loading ? <p>Loading....</p> : 
                error ? <p>{error}</p>:
                <div className={styles["application-list"]}>
                    {userApplications.length > 0 ? userApplications.map((userApplication, idx) => (
                            <div className={styles["application-link"]}>
                                <p className={styles["application-link-index"]} >{idx + 1}</p>
                                <Link key={userApplication.id} to={`/applications/${userApplication.id}`} className={styles["application-field"]}>
                                    <p>Role : {userApplication.roleTitle}</p>
                                    <p>Company : {userApplication.company}</p>
                                    <p>Status : {userApplication.status}</p>
                                </Link>
                            </div>
                        )): 
                    <h4>No Applications. Add Application</h4>}
                 </div>
            }
        </div>
    </>)
}

export default Dashboard;