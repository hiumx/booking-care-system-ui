interface FooterProps {
    // Define any props if needed in the future
    copyrightYear: number;
}

const Footer: React.FC<FooterProps> = ({ copyrightYear }) => {
    return (
        <div>
            <footer>© {copyrightYear} BookingCare</footer>
        </div>
    );
};

export default Footer;
