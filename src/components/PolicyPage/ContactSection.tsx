import React from 'react';

interface ContactInfo {
    label: string;
    value: string;
}

interface ContactSectionProps {
    title: string;
    description: string;
    contacts: ContactInfo[];
    children?: React.ReactNode;
}

const ContactSection: React.FC<ContactSectionProps> = ({
    title,
    description,
    contacts,
    children,
}) => {
    return (
        <div className="terms-text terms-list">
            <h6>{title}</h6>
            <p>{description}</p>
            <ul>
                {contacts.map((contact) => (
                    <li key={`${contact.label}-${contact.value}`}>
                        <strong>{contact.label}:</strong> {contact.value}
                    </li>
                ))}
            </ul>
            {children}
        </div>
    );
};

export default ContactSection;
