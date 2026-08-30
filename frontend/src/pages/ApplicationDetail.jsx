import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { applications } from "../services/applications";
import styles from "./ApplicationDetail.module.css";

const ApplicationDetail = () => {
    const {id} = useParams();
    const [application, setApplication] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setApplication((prev) => ({...prev, [e.target.name] : e.target.value}));
    };

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

    const buildPayload = (application) => ({
        company: application.company,
        roleTitle: application.roleTitle,
        jobId: application.jobId || null,
        status: application.status || null,
        jobUrl: application.jobUrl || null,
        source: application.source || null,
        notes: application.notes || null,
        salaryRange: application.salaryRange || null,
        location: application.location || null,
        appliedDate: application.appliedDate || null,
    });

    const handleUpdateApplication = async (e) => {
        e.preventDefault();
        try{
            setActionLoading(true);
            setError(null);
            const res = await applications.update(id, buildPayload(application));
           const data = res.data;
           setApplication(data);
           setIsEditing(false)
        }catch(e){
            setError(e.response?.data?.message || "Something went wrong. Please try again.");
            console.error('Error : ', e)
        }finally{
            setActionLoading(false);
        }
    }

    const handleCancel = () => {
        setIsEditing(false);
        fetchApplication();
    }

    const handleDelete = useCallback(async() => {
        if (!window.confirm("Delete this application? This cannot be undone.")) return;
        try{
            setActionLoading(true);
            setError(null);
            await applications.deleteById(id);
            navigate("/dashboard");
        }catch(e){
            setError(e.response?.data?.message || "Something went wrong. Please try again.");
            console.error('Error : ', e)
        }finally{
            setActionLoading(false);
        }
    }, [id])

    const handleStatusChange = async (e) => {
        const {name, value} = e.target;
        const updateData = {[name] : value};
        try{
            setActionLoading(true);
            setError(null);
            await applications.statusChange(id, updateData);
            setApplication((prev) => ({...prev, ...updateData}));
        }catch(e){
            setError(e.response?.data?.message || "Something went wrong. Please try again.");
            console.error('Error : ', e)
        }finally{
            setActionLoading(false);
        }
    }

    useEffect(()=> {
        fetchApplication();
    },[fetchApplication])

    return <>
        {loading ? <p>Loading.....</p> : error ? <p>{error}</p> :
            <div className={styles["container"]}>

                <form className={styles["field-container"]} onSubmit={handleUpdateApplication}>
                    <div className={styles["form-actions"]}>
                        {isEditing ?  
                            <div className={styles["form-actions"]}>
                                <button key="cancel"  type="button" onClick={handleCancel}>CANCEL</button>
                                <button key="submit"  type="submit" disabled={actionLoading || !isEditing}>{actionLoading ? "SAVING.." : "SAVE"}</button>
                            </div> : 
                            <button key="edit"  type="button" onClick={()=> setIsEditing(true)}>EDIT</button>
                        }
                        <button key="delete"  type="button" onClick={handleDelete} disabled={actionLoading}>{actionLoading ? "DELETING..." : "DELETE"}</button>
                    </div>
                    
                    <div className={styles["field"]}>
                        <label htmlFor="company">Company :</label>
                        <input
                            id="company"
                            name="company"
                            value={company}
                            type="text"
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>

                    <div className={styles["field"]}>
                        <label htmlFor="roleTitle">Role Title : </label>
                        <input
                            id="roleTitle"
                            name="roleTitle"
                            value={roleTitle}
                            type="text"
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>

                    <div className={styles["field"]}>
                        <label htmlFor="status">Status : </label>
                        <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={isEditing ? handleChange : handleStatusChange}
                            disabled={actionLoading}
                        >
                            <option value="APPLIED">Applied</option>
                            <option value="SCREENING">Screening</option>
                            <option value="INTERVIEW">Interview</option>
                            <option value="OFFER">Offer</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="WITHDRAWN">Withdrawn</option>
                        </select>
                    </div>

                    <div className={styles["field"]}>
                        <label htmlFor="jobId">Job ID : </label>
                        <input
                            id="jobId"
                            name="jobId"
                            value={jobId}
                            type="text"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles["field"]}>
                        <label htmlFor="appliedDate">Applied Date : </label>
                        <input
                            id="appliedDate"
                            name="appliedDate"
                            value={appliedDate}
                            type="date"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles["field"]}>
                        <label htmlFor="jobUrl">Job URL : </label>
                        <input
                            id="jobUrl"
                            name="jobUrl"
                            value={jobUrl}
                            type="text"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles["field"]}>
                        <label htmlFor="source">Source : </label>
                        <input
                            id="source"
                            name="source"
                            value={source}
                            type="text"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles["field"]}>
                        <label htmlFor="salaryRange">Salary Range : </label>
                        <input
                            id="salaryRange"
                            name="salaryRange"
                            value={salaryRange}
                            type="text"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles["field"]}>
                        <label htmlFor="location">Location : </label>
                        <input
                            id="location"
                            name="location"
                            value={location}
                            type="text"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles["field"]}>
                        <label htmlFor="notes">Notes : </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={notes}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                </form>

            </div>
        }
    </>
}

export default ApplicationDetail;