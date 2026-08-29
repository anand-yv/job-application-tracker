import { useCallback, useEffect, useState } from "react";
import { applications } from "../services/applications";
import styles from "./Dashboard.module.css"
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [userApplications, setUserApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const navigate = useNavigate();

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
            </div>
            
            {loading ? <p>Loading....</p> : 
                error ? <p>{error}</p>:
                <div className={styles["application-list"]}>
                    {userApplications.length > 0 ? userApplications.map((userApplication) => (
                            <Link key={userApplication.id} to={`/applications/${userApplication.id}`}>
                                <p>Role : {userApplication.roleTitle}</p>
                                <p>Company : {userApplication.company}</p>
                                <p>Status : {userApplication.status}</p>
                            </Link>
                        )): 
                    <h4>No Applications. Add Application</h4>}
                 </div>
            }
        </div>
    </>)
}

export default Dashboard;