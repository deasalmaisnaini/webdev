import React from 'react';
import { Link } from 'react-router-dom'; // Import Link dari react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css';

function HeaderComponent() {
    return (
        <div>
            <header>
                <nav className="navbar navbar-dark bg-primary">
                    <div>
                        <Link to="/users" className="navbar-brand">
                            User Management App
                        </Link>
                    </div>
                </nav>
            </header>
        </div>
    );
}

export default HeaderComponent;
