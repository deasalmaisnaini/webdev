import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserService from '../services/UserService';

function CreateUserComponent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    if (id !== '_add') {
      UserService.getUserById(id).then((res) => {
        let userData = res.data;
        setUser(userData);
      });
    }
  }, [id]);

  const saveOrUpdateUser = (e) => {
    e.preventDefault();
    console.log('user => ' + JSON.stringify(user));

    if (id === '_add') {
      UserService.createUser(user).then(() => {
        navigate('/users');
      });
    } else {
      UserService.updateUser(user, id).then(() => {
        navigate('/users');
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleCancel = () => {
    navigate('/users');
  };

  const getTitle = () => {
    return id === '_add' ? <h3 className="text-center">Add User</h3> : <h3 className="text-center">Update User</h3>;
  };

  return (
    <div>
      <br></br>
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            {getTitle()}
            <div className="card-body">
              <form>
                <div className="form-group">
                  <label>First Name:</label>
                  <input
                    placeholder="First Name"
                    name="firstName"
                    className="form-control"
                    value={user.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name:</label>
                  <input
                    placeholder="Last Name"
                    name="lastName"
                    className="form-control"
                    value={user.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    placeholder="Email Address"
                    name="email"
                    className="form-control"
                    value={user.email}
                    onChange={handleChange}
                  />
                </div>
                <button className="btn btn-success" onClick={saveOrUpdateUser}>
                  Save
                </button>
                <button className="btn btn-danger" onClick={handleCancel} style={{ marginLeft: "10px" }}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateUserComponent;
