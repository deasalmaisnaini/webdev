import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListUserComponent from './components/ListUserComponent';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import CreateUserComponent from './components/CreateUserComponent';
import ViewUserComponent from './components/ViewUserComponent';

function App() {
  return (
    <div>
      <Router>
        <HeaderComponent />
        <div className="container">
          <Routes>
            <Route path="/" element={<ListUserComponent />} />
            <Route path="/users" element={<ListUserComponent />} />
            <Route path="/add-user/:id" element={<CreateUserComponent />} />
            <Route path="/view-user/:id" element={<ViewUserComponent />} />
          </Routes>
        </div>
        <FooterComponent />
      </Router>
    </div>
  );
}

export default App;
