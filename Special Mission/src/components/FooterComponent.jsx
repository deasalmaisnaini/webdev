import React from 'react';

function FooterComponent() {
    return (
        <div>
            <footer className="footer bg-primary text-white text-center p-2">
                <div className="container">
                    <span className="text-white">
                        Tugas Eksplorasi Pengembangan Web {new Date().getFullYear()} @dea.com
                    </span>
                </div>
            </footer>
        </div>
    );
}

export default FooterComponent;
