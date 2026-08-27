import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { applications } from "../services/applications";
import styles from "./ApplicationDetail.module.css";

const ApplicationDetail = () => {
    const {id} = useParams();
    const [application, setApplication] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        jobId,
        jobUrl,
        company,
        roleTitle,
        status,
        source,
        notes,
        salaryRange,
        location,
        appliedDate,
        createdAt,
        updatedAt
    } = application

    const fetchApplication = useCallback(async () => {
        try{
           setLoading(true);
           setError(null);
           const res = await applications.getById({id});
           const data = res.data;
           setApplication(data);
        }catch(e){
            setError(e.response?.data?.message || "Something went wrong. Please try again.")
            console.error('Error : ', e)
        }finally{
            setLoading(false);
        }
    },[id])

    useEffect(()=> {
        fetchApplication();
    },[fetchApplication])

    return <>
        {loading ? <p>Loading.....</p> : error ? <p>{error}</p> :
            <div className={styles["container"]}>
                <div className={styles["field-container"]}>
                    <h5>Job ID :</h5>
                    <h5>{jobId}</h5>
                </div>
                <div className={styles["field-container"]}>
                    <h5>Job Url :</h5>
                    <h5>{jobUrl}</h5>
                </div>
                <div className={styles["field-container"]}>
                    <h5>Company :</h5>
                    <h5>{company}</h5>
                </div>
                <div className={styles["field-container"]}>
                    <h5>Role Title :</h5>
                    <h5>{roleTitle}</h5>
                </div>
                <div className={styles["field-container"]}>
                    <h5>Status :</h5>
                    <h5>{status}</h5>
                </div>
                <div className={styles["field-container"]}>
                    <h5>Source :</h5>
                    <h5>{source}</h5>
                </div>
                <div className={styles["field-container"]}>
                    <h5>Notes :</h5>
                    <h5>{notes}</h5>
                </div>
                <div className={styles["field-container"]}>
                    <h5>Salary Range :</h5>
                    <h5>{salaryRange}</h5>
                </div>
                <div className={styles["field-container"]}>
                    <h5>Location  :</h5>
                    <h5>{location}</h5>
                </div>
                <div className={styles["field-container"]}>
                    <h5>Applied Date :</h5>
                    <h5>{appliedDate}</h5>
                </div>
                <div className={styles["field-container"]}>
                    <h5>Created At :</h5>
                    <h5>{createdAt}</h5>
                </div>
                <div className={styles["field-container"]}>
                    <h5>Updated At :</h5>
                    <h5>{updatedAt}</h5>
                </div>
            </div>
        }
    </>
}

export default ApplicationDetail;