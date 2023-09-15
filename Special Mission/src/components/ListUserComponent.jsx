import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';

function ListUserComponent() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate(); // Hook navigate untuk navigasi

    useEffect(() => {
        UserService.getUsers()
            .then((res) => {
                if (res.data == null) {
                    navigate('/add-user/_add');
                }
                setUsers(res.data);
            });
    }, [navigate]);

    const deleteUser = (id) => {
        UserService.deleteUser(id).then(() => {
            setUsers(users.filter((user) => user.id !== id));
        });
    };

    const viewUser = (id) => {
        navigate(`/view-user/${id}`);
    };

    const editUser = (id) => {
        navigate(`/add-user/${id}`);
    };

    const addUser = () => {
        navigate('/add-user/_add');
    };

    return (
        <div>
            <h2 className="text-center">Users List</h2>
            <div className="row">
                <button className="btn btn-primary" onClick={addUser}>
                    Add User
                </button>
            </div>
            <br></br>
            <div className="row">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th> User First Name</th>
                            <th> User Last Name</th>
                            <th> User Email </th>
                            <th> Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td> {user.firstName} </td>
                                <td> {user.lastName}</td>
                                <td> {user.email}</td>
                                <td>
                                    <button
                                        onClick={() => editUser(user.id)}
                                        className="btn btn-info"
                                    >
                                        Update
                                    </button>
                                    <button
                                        style={{ marginLeft: "10px" }}
                                        onClick={() => deleteUser(user.id)}
                                        className="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        style={{ marginLeft: "10px" }}
                                        onClick={() => viewUser(user.id)}
                                        className="btn btn-info"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListUserComponent;
