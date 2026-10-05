import { useCallback, useEffect, useState } from "react";
import styles from "./ApplicationForm.module.css"
import { applications } from "../services/applications";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ContactMultiSelect from "../components/ContactMultiSelect";
import { contactService } from "@/services/contactService";
import Dropdown from "@/components/Dropdown";

const ApplicationForm = () => {
    const [formData, setFormData] = useState({
        jobId: "",
        jobUrl: "",
        company: "",
        roleTitle: "",
        status: "APPLIED",
        source: "",
        notes: "",
        salaryRange: "",
        location: "",
        appliedDate: "",
        selectedContacts: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [allContacts, setAllContacts] = useState([]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const buildPayload = (formData) => ({
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
        contactIds: formData.selectedContacts
    });

    const handleSaveApplication = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const res = await applications.create(buildPayload(formData));
            navigate(`/applications/${res.data?.id}`);
        } catch (e) {
            setError(e.response?.data?.message || "Something went wrong. Please try again.");
            console.error('Error : ', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchContacts = useCallback(async () => {
        try {
            const res = await contactService.getAll();
            const data = res.data;
            setAllContacts(data);
        } catch (e) {
            console.error("Error : ", e);
        }
    }, []);

    const onContactSelect = (contactId) => {
        setFormData((prev) => ({
            ...prev,
            selectedContacts: prev.selectedContacts.includes(contactId)
                ? prev.selectedContacts.filter((elem) => elem !== contactId)
                : [...prev.selectedContacts, contactId]
        }));
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return <>
        <form className={styles["container"]} onSubmit={handleSaveApplication}>

            <div className={styles["header"]}>
                <h4>Application Form</h4>
                {error && <p className={styles["error"]}>{error}</p>}
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "SAVE"}
                </Button>
            </div>

            <div className={styles["field-container"]}>

                <div className={styles["field"]}>
                    <Label htmlFor="company">Company :</Label>
                    <Input id="company" name="company" value={formData.company} type="text"
                        onChange={handleChange} required />
                </div>

                <div className={styles["field"]}>
                    <Label htmlFor="roleTitle">Role Title : </Label>
                    <Input id="roleTitle" name="roleTitle" value={formData.roleTitle} type="text"
                        onChange={handleChange} required />
                </div>

                <div className={styles["field"]}>
                    <Label htmlFor="status">Status : </Label>
                    <Dropdown
                        id={"status"}
                        value={formData.status}
                        placeholder={"Select status"}
                        onChange={(value) => handleChange({ target: { name: "status", value } })}
                        options={[
                            { value: "APPLIED", label: "Applied" },
                            { value: "SCREENING", label: "Screening" },
                            { value: "INTERVIEW", label: "Interview" },
                            { value: "OFFER", label: "Offer" },
                            { value: "REJECTED", label: "Rejected" },
                            { value: "WITHDRAWN", label: "Withdrawn" },
                        ]}
                    />
                </div>

                <div className={styles["field"]}>
                    <Label htmlFor="jobId">Job ID : </Label>
                    <Input id="jobId" name="jobId" value={formData.jobId} type="text"
                        onChange={handleChange} />
                </div>

                <div className={styles["field"]}>
                    <Label htmlFor="appliedDate">Applied Date : </Label>
                    <Input id="appliedDate" name="appliedDate" value={formData.appliedDate} type="date"
                        onChange={handleChange} />
                </div>

                <div className={styles["field"]}>
                    <Label htmlFor="jobUrl">Job URL : </Label>
                    <Input id="jobUrl" name="jobUrl" value={formData.jobUrl} type="text"
                        onChange={handleChange} />
                </div>

                <div className={styles["field"]}>
                    <Label>Contacts :  </Label>
                    <ContactMultiSelect
                        allContacts={allContacts}
                        selectedIds={formData.selectedContacts}
                        onChange={(onContactSelect)}
                    />
                </div>
                <div className={styles["field"]}>
                    <Label htmlFor="source">Source : </Label>
                    <Input id="source" name="source" value={formData.source} type="text"
                        onChange={handleChange} />
                </div>

                <div className={styles["field"]}>
                    <Label htmlFor="salaryRange">Salary Range : </Label>
                    <Input id="salaryRange" name="salaryRange" value={formData.salaryRange} type="text"
                        onChange={handleChange} />
                </div>

                <div className={styles["field"]}>
                    <Label htmlFor="location">Location : </Label>
                    <Input id="location" name="location" value={formData.location} type="text"
                        onChange={handleChange} />
                </div>

                <div className={styles["field"]}>
                    <Label htmlFor="notes">Notes : </Label>
                    <Textarea id="notes" name="notes" value={formData.notes}
                        onChange={handleChange} />
                </div>
            </div>
        </form>
    </>
}

export default ApplicationForm;