import { useEffect, useRef, useState } from "react";
import styles from "./ContactMultiSelect.module.css"
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactMultiSelect = ({ allContacts = [], slectedIds = [], onChange = () => { } }) => {
    const [isOpen, setIsOpen] = useState(false);
    const multiSelectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                multiSelectRef.current &&
                !multiSelectRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div 
            ref={multiSelectRef}
            className={styles["multi-select"]}
        >
            <div className={styles["trigger-container"]}>
                <Button
                    className={styles["trigger"]}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    {slectedIds.map((id) => (
                        <div
                            key={id}
                            className={styles["selected-item"]}
                        >
                            {allContacts.find(
                                (contact) => contact.id === id
                            )?.name}
                        </div>
                    ))}
                </Button>
            </div>

            {isOpen && (
                <div className={styles["popover"]}>
                    {allContacts.map((contact) => {
                        const isSelected = slectedIds.includes(contact.id);

                        return (
                            <div
                                key={contact.id}
                                className={styles["option"]}
                                onClick={() => console.log(contact.id)}
                            >
                                <div className={styles["check-icon"]}>
                                    {isSelected && (
                                    <Check/>
                                    )}
                                </div>

                                <div className={styles["option-content"]}>
                                    <div className={styles["option-company"]}>
                                        {contact.company}
                                    </div>
                                    <div className={styles["divider"]}></div>
                                    <div className={styles["option-name"]}>
                                        {contact.name}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
};

export default ContactMultiSelect;