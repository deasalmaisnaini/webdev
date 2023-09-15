import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams dari react-router-dom
import UserService from '../services/UserService';

function ViewUserComponent() {
    const { id } = useParams(); // Dapatkan id dari URL
    const [user, setUser] = useState({});

    useEffect(() => {
        UserService.getUserById(id).then((res) => {
            setUser(res.data);
        });
    }, [id]);

    return (
        <div>
            <br></br>
            <div className="card col-md-6 offset-md-3">
                <h3 className="text-center">View User Details</h3>
                <div className="card-body">
                    <div className="row">
                        <label> User First Name: </label>
                        <div> {user.firstName}</div>
                    </div>
                    <div className="row">
                        <label> User Last Name: </label>
                        <div> {user.lastName}</div>
                    </div>
                    <div className="row">
                        <label> User Email : </label>
                        <div> {user.email}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewUserComponent;
