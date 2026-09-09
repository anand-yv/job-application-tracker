import { useState } from "react";
import styles from "./ContactForm.module.css";
import { contactService } from "../services/contactService";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        notes: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const buildPayload = (formData) => ({
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        company: formData.company || null,
        position: formData.position || null,
        notes: formData.notes || null,
    });

    const handleSaveContact = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const res = await contactService.createContact(
                buildPayload(formData)
            );

            navigate(`/contacts/${res.data?.id}`);
        } catch (e) {
            setError(
                e.response?.data?.message ||
                "Something went wrong. Please try again."
            );

            console.error("Error : ", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className={styles["container"]}
            onSubmit={handleSaveContact}
        >
            <div className={styles["header"]}>
                <h4>Contact Form</h4>

                {error && (
                    <p className={styles["error"]}>
                        {error}
                    </p>
                )}

                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "SAVE"}
                </Button>
            </div>

            <div className={styles["field-container"]}>

                <div className={styles["field"]}>
                    <Label htmlFor="name">
                        Name :
                    </Label>

                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        type="text"
                        onChange={handleChange}
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
                        value={formData.email}
                        type="email"
                        onChange={handleChange}
                    />
                </div>

                <div className={styles["field"]}>
                    <Label htmlFor="phone">
                        Phone :
                    </Label>

                    <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        type="text"
                        onChange={handleChange}
                    />
                </div>

                <div className={styles["field"]}>
                    <Label htmlFor="company">
                        Company :
                    </Label>

                    <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        type="text"
                        onChange={handleChange}
                    />
                </div>

                <div className={styles["field"]}>
                    <Label htmlFor="position">
                        Position :
                    </Label>

                    <Input
                        id="position"
                        name="position"
                        value={formData.position}
                        type="text"
                        onChange={handleChange}
                    />
                </div>

                <div className={styles["field"]}>
                    <Label htmlFor="notes">
                        Notes :
                    </Label>

                    <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                    />
                </div>

            </div>
        </form>
    );
};

export default ContactForm;