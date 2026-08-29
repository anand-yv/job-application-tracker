import { useState } from "react";
import styles from  "./ApplicationForm.module.css"
import { applications } from "../services/applications";
import { useNavigate } from "react-router-dom";

const ApplicationForm = () => {
    const [formData, setFormData] = useState({
        jobId : "",
        jobUrl : "",
        company : "",
        roleTitle : "",
        status : "APPLIED",
        source : "",
        notes : "",
        salaryRange : "",
        location : "",
        appliedDate : "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const naviagte = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.name] : e.target.value}));
    };

    const buildPayload = (formData) => ({
        ...formData,
        company: formData.company,
        roleTitle: formData.roleTitle,
        jobId: formData.jobId || null,
        status: formData.status || null, 
        jobUrl: formData.jobUrl || null,
        source: formData.source || null,
        notes: formData.notes || null,
        salaryRange: formData.salaryRange || null,
        location: formData.location || null,
        appliedDate: formData.appliedDate || null,
    });

    const handleSaveApplication = async(e) => {
        e.preventDefault();
        try{
            setLoading(true);
            setError(null);
            const req = await applications.create(buildPayload(formData))
            naviagte(`/applications/${req.data?.id}`);
        }catch(e){
            setError(e.response?.data?.message || "Something went wrong. Please try again.");
            console.error('Error : ', e);
        }finally{
            setLoading(false);
        }
    };

    return <>
        <form className={styles["container"]} onSubmit={handleSaveApplication}>

            <div className={styles["header"]}>
                <h4>Application Form</h4>
                {error && <p className={styles["error"]}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "SAVE"}
                </button>
            </div>

            <div className={styles["field-container"]}>

                <div className={styles["field"]}>
                    <label htmlFor="company">Company :</label>
                    <input id="company" name="company" value={formData.company} type="text"
                        onChange={handleChange} required/>
                </div>

                <div className={styles["field"]}>
                    <label htmlFor="roleTitle">Role Title : </label>
                    <input id="roleTitle" name="roleTitle" value={formData.roleTitle} type="text"
                        onChange={handleChange} required/>
                </div>

                <div className={styles["field"]}>
                    <label htmlFor="status">Status : </label>
                    <select id="status" name="status" value={formData.status}
                        onChange={handleChange}>
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
                    <input id="jobId" name="jobId" value={formData.jobId} type="text"
                        onChange={handleChange}/>
                </div>
                
                <div className={styles["field"]}>
                    <label htmlFor="appliedDate">Applied Date : </label>
                    <input id="appliedDate" name="appliedDate" value={formData.appliedDate} type="date"
                        onChange={handleChange}/>
                </div>

                 <div className={styles["field"]}>
                    <label htmlFor="jobUrl">Job URL : </label>
                    <input id="jobUrl" name="jobUrl" value={formData.jobUrl} type="text"
                         onChange={handleChange}/>
                </div>

                <div className={styles["field"]}>
                    <label htmlFor="source">Source : </label>
                    <input id="source" name="source" value={formData.source} type="text"
                         onChange={handleChange}/>
                </div>

                <div className={styles["field"]}>
                    <label htmlFor="salaryRange">Salary Range : </label>
                    <input id="salaryRange" name="salaryRange" value={formData.salaryRange} type="text"
                        onChange={handleChange}/>
                </div>

                <div className={styles["field"]}>
                    <label htmlFor="location">Location : </label>
                    <input id="location" name="location" value={formData.location} type="text"
                        onChange={handleChange}/>
                </div>

                <div className={styles["field"]}>
                    <label htmlFor="notes">Notes : </label>
                    <textarea id="notes" name="notes" value={formData.notes}
                        onChange={handleChange}/>
                </div>
            </div>
        </form>
    </>
}

export default ApplicationForm;