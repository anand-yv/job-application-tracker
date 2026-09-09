import { contactService } from "@/services/contactService";
import { useCallback, useEffect, useState } from "react";
import styles from "./Contact.module.css"
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Contact = () => {
    const [contactList, setContactList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchContacts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await contactService.getAll();
            const data = res.data;
            setContactList(data);
        } catch (e) {
            setError(e.response?.data?.message || "Something went wrong. Please try again.");
            console.error('Error : ', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContacts();
    }, [])

    return <>
        <div className={styles["container"]}>
            <div className={styles["header"]}>
                <h5>Contacts </h5>
                <Button onClick={fetchContacts}>REFERESH</Button>
                <Button onClick={() => { navigate("/contacts/new") }}>CREATE CONTACT</Button>
            </div>

            {loading ? <p>Loading....</p> :
                error ? <p>{error}</p> :
                    <div className={styles["contact-list"]}>
                        {contactList.length > 0 ? contactList.map((contact, idx) => (
                            <div key={contact.id} className={styles["contact-link"]}>
                                <p className={styles["contact-link-index"]} >{idx + 1}</p>
                                <Link to={`/contacts/${contact.id}`} className={styles["contact-field"]}>
                                    <p>Name : {contact.name}</p>
                                    <p>Company : {contact.company}</p>
                                    <p>Email : {contact.email}</p>
                                    <p>Position : {contact.position}</p>
                                </Link>
                            </div>
                        )) :
                            <h4>No Contact. Add Application</h4>}
                    </div>
            }
        </div>
    </>
}

export default Contact;