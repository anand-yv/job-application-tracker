import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { applications } from "../services/applications";
import styles from "./ApplicationDetail.module.css";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ApplicationDetail = () => {
    const { id } = useParams();
    const [application, setApplication] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setApplication((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        try {
            setLoading(true);
            setError(null);
            const res = await applications.getById({ id });
            const data = res.data;
            setApplication(data);
        } catch (e) {
            setError(e.response?.data?.message || "Something went wrong. Please try again.")
            console.error('Error : ', e)
        } finally {
            setLoading(false);
        }
    }, [id])

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
        try {
            setActionLoading(true);
            setError(null);
            const res = await applications.update(id, buildPayload(application));
            const data = res.data;
            setApplication(data);
            setIsEditing(false)
        } catch (e) {
            setError(e.response?.data?.message || "Something went wrong. Please try again.");
            console.error('Error : ', e)
        } finally {
            setActionLoading(false);
        }
    }

    const handleCancel = () => {
        setIsEditing(false);
        fetchApplication();
    }

    const handleDelete = useCallback(async () => {
        if (!window.confirm("Delete this application? This cannot be undone.")) return;
        try {
            setActionLoading(true);
            setError(null);
            await applications.deleteById(id);
            navigate("/dashboard");
        } catch (e) {
            setError(e.response?.data?.message || "Something went wrong. Please try again.");
            console.error('Error : ', e)
        } finally {
            setActionLoading(false);
        }
    }, [id])

    const handleStatusChange = async (e) => {
        const { name, value } = e.target;
        const updateData = { [name]: value };
        try {
            setActionLoading(true);
            setError(null);
            await applications.statusChange(id, updateData);
            setApplication((prev) => ({ ...prev, ...updateData }));
        } catch (e) {
            setError(e.response?.data?.message || "Something went wrong. Please try again.");
            console.error('Error : ', e)
        } finally {
            setActionLoading(false);
        }
    }

    useEffect(() => {
        fetchApplication();
    }, [fetchApplication])

    return <>
        {loading ? <p>Loading.....</p> : error ? <p>{error}</p> :
            <div className={styles["container"]}>

                <form className={styles["field-container"]} onSubmit={handleUpdateApplication}>
                    <div className={styles["form-actions"]}>
                        {isEditing ?
                            <div className={styles["form-actions"]}>
                                <Button key="cancel" type="button" onClick={handleCancel}>CANCEL</Button>
                                <Button key="submit" type="submit" disabled={actionLoading || !isEditing}>{actionLoading ? "SAVING.." : "SAVE"}</Button>
                            </div> :
                            <Button key="edit" type="button" onClick={() => setIsEditing(true)}>EDIT</Button>
                        }
                        <Button key="delete" type="button" onClick={handleDelete} disabled={actionLoading}>{actionLoading ? "DELETING..." : "DELETE"}</Button>
                    </div>

                    <div className={styles["field"]}>
                        <Label htmlFor="company">Company :</Label>
                        <Input
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
                        <Label htmlFor="roleTitle">Role Title : </Label>
                        <Input
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
                        <Label htmlFor="status">Status : </Label>
                        <Select
                            value={status}
                            onValueChange={(value) => {
                                const fakeEvent = { target: { name: "status", value } };
                                isEditing ? handleChange(fakeEvent) : handleStatusChange(fakeEvent);
                            }}
                            disabled={actionLoading}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="APPLIED">Applied</SelectItem>
                                <SelectItem value="SCREENING">Screening</SelectItem>
                                <SelectItem value="INTERVIEW">Interview</SelectItem>
                                <SelectItem value="OFFER">Offer</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className={styles["field"]}>
                        <Label htmlFor="jobId">Job ID : </Label>
                        <Input
                            id="jobId"
                            name="jobId"
                            value={jobId}
                            type="text"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles["field"]}>
                        <Label htmlFor="appliedDate">Applied Date : </Label>
                        <Input
                            id="appliedDate"
                            name="appliedDate"
                            value={appliedDate}
                            type="date"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles["field"]}>
                        <Label htmlFor="jobUrl">Job URL : </Label>
                        <Input
                            id="jobUrl"
                            name="jobUrl"
                            value={jobUrl}
                            type="text"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles["field"]}>
                        <Label htmlFor="source">Source : </Label>
                        <Input
                            id="source"
                            name="source"
                            value={source}
                            type="text"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles["field"]}>
                        <Label htmlFor="salaryRange">Salary Range : </Label>
                        <Input
                            id="salaryRange"
                            name="salaryRange"
                            value={salaryRange}
                            type="text"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles["field"]}>
                        <Label htmlFor="location">Location : </Label>
                        <Input
                            id="location"
                            name="location"
                            value={location}
                            type="text"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles["field"]}>
                        <Label htmlFor="notes">Notes : </Label>
                        <Textarea
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