import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ContactDetail.module.css";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactService } from "@/services/contactService";

const ContactDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [contact, setContact] = useState({});
    const [restoreContact, setRestoreContact] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        setContact((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const {
        name,
        email,
        phone,
        company,
        position,
        notes,
        createdAt,
        updatedAt
    } = contact;

    const fetchContact = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await contactService.getById(id);
            const data = res.data;

            setContact(data);
            setRestoreContact(data);
        } catch (e) {
            setError(
                e.response?.data?.message ||
                "Something went wrong. Please try again."
            );
            console.error("Error : ", e);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const buildPayload = (contact) => ({
        name: contact.name,
        email: contact.email || null,
        phone: contact.phone || null,
        company: contact.company || null,
        position: contact.position || null,
        notes: contact.notes || null
    });

    const handleUpdateContact = async (e) => {
        e.preventDefault();

        try {
            setActionLoading(true);
            setError(null);

            const res = await contactService.updateContactById(
                id,
                buildPayload(contact)
            );

            const data = res.data;

            setContact(data);
            setRestoreContact(data);
            setIsEditing(false);
        } catch (e) {
            setError(
                e.response?.data?.message ||
                "Something went wrong. Please try again."
            );
            console.error("Error : ", e);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setContact(restoreContact);
    };

    const handleDelete = useCallback(async () => {
        if (
            !window.confirm(
                "Delete this contact? This cannot be undone."
            )
        ) {
            return;
        }

        try {
            setActionLoading(true);
            setError(null);

            await contactService.deleteContactById(id);

            navigate("/contacts");
        } catch (e) {
            setError(
                e.response?.data?.message ||
                "Something went wrong. Please try again."
            );
            console.error("Error : ", e);
        } finally {
            setActionLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchContact();
    }, [fetchContact]);

    return (
        <>
            {loading ? (
                <p>Loading.....</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className={styles["container"]}>
                    <form
                        className={styles["field-container"]}
                        onSubmit={handleUpdateContact}
                    >
                        <div className={styles["form-actions"]}>
                            {isEditing ? (
                                <div className={styles["form-actions"]}>
                                    <Button
                                        type="button"
                                        onClick={handleCancel}
                                    >
                                        CANCEL
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={actionLoading}
                                    >
                                        {actionLoading
                                            ? "SAVING.."
                                            : "SAVE"}
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                >
                                    EDIT
                                </Button>
                            )}

                            <Button
                                type="button"
                                onClick={handleDelete}
                                disabled={actionLoading}
                            >
                                {actionLoading
                                    ? "DELETING..."
                                    : "DELETE"}
                            </Button>
                        </div>

                        <div className={styles["field"]}>
                            <Label htmlFor="name">
                                Name :
                            </Label>

                            <Input
                                id="name"
                                name="name"
                                value={name || ""}
                                type="text"
                                onChange={handleChange}
                                disabled={!isEditing}
                                required
                            />
                        </div>

                        <div className={styles["field"]}>
                            <Label htmlFor="email">
                                Email :
                            </Label>

                            <Input
                                id="email"
                                name="email"
                                value={email || ""}
                                type="email"
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className={styles["field"]}>
                            <Label htmlFor="phone">
                                Phone :
                            </Label>

                            <Input
                                id="phone"
                                name="phone"
                                value={phone || ""}
                                type="text"
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className={styles["field"]}>
                            <Label htmlFor="company">
                                Company :
                            </Label>

                            <Input
                                id="company"
                                name="company"
                                value={company || ""}
                                type="text"
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className={styles["field"]}>
                            <Label htmlFor="position">
                                Position :
                            </Label>

                            <Input
                                id="position"
                                name="position"
                                value={position || ""}
                                type="text"
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className={styles["field"]}>
                            <Label htmlFor="notes">
                                Notes :
                            </Label>

                            <Textarea
                                id="notes"
                                name="notes"
                                value={notes || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default ContactDetails;
