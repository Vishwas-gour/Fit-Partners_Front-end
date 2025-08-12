import "./css/footer.css"

function Footer() {
    return (

        <footer className="footer">
        <div className="footer-container">
            <div className="footer-section about">
                <h2>About Us</h2>
                <p>We provide the best quality products at unbeatable prices. Shop with confidence!</p>
            </div>
    
            <div className="footer-section customer-service">
                <h2>Customer Service</h2>
                <ul>
                    <li><a href="#">Shipping Policy</a></li>
                    <li><a href="#">Returns & Refunds</a></li>
                    <li><a href="#">Track Order</a></li>
                    <li><a href="#">Support</a></li>
                </ul>
            </div>
    
            <div className="footer-section contact">
                <h2>Contact Us</h2>
                <p>Have any questions? Feel free to reach out.</p>
                <p>Email: support@yourecommercesite.com</p>
                <p>Phone: (123) 456-7890</p>
            </div>
        </div>
    
        <div className="footer-bottom">
            <p>&copy; 2025 YourEcommerceSite. All Rights Reserved.</p>
        </div>
    </footer>
    
    )
}

export default Footer