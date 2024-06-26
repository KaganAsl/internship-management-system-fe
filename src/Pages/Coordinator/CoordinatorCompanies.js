import React, { useState , useEffect } from 'react';
import './CoordinatorCompanies.css';
import CoordinatorHome from './CoordinatorHome';
import { GetWithAuth } from "../../Services/HttpService.js";
import { PutWithAuth } from "../../Services/HttpService";


function CoordinatorCompanies() {
  const [companies, setCompanies] = useState([]);
  const [visibleCompany, setVisibleCompany] = useState(null);
  const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
      console.log(currentUser.id); // currentUser her güncellendiğinde bu çalışır
    }, [currentUser]);
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await GetWithAuth("/coordinator/token/" + localStorage.getItem("tokenKey"));
          const result = await response.json();
          console.log(result);
          setCurrentUser(result);
        } catch (error) {
          console.log(error);
          console.log("User not found");
        }
      };
      const timeout = setTimeout(() => {
        fetchData();
      }, 10); 
      return () => clearTimeout(timeout); 
      
    }, []);

  const toggleCompanyDetails = (index) => {
    setVisibleCompany(visibleCompany === index ? null : index);
  };

  const handleApprove = async (company , index) => {
    await PutWithAuth(`/coordinator/approveCompanyAccount?companyId=${company.companyid}`);
    alert(`Approved ${company.name}`);
    setCompanies(companies.filter((_, i) => i !== index));
    window.location.reload();
  };

  const handleReject = async (company, index) => {
    await PutWithAuth(`/coordinator/rejectCompanyAccount?companyId=${company.companyid}`);
    alert(`Rejected ${companies[index].name}`);
    setCompanies(companies.filter((_, i) => i !== index));
    window.location.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await GetWithAuth("/company/pending");
            const result = await response.json();
            //console.log(result);
            setCompanies(result);
        } catch (error) {
            console.log(error);
            console.log("comp not found");
        }
    };

    const timeout = setTimeout(() => {
        fetchData();
    }, 1);

    return () => clearTimeout(timeout);

}, []);

  return (
    <CoordinatorHome>
      <div className="company-list">
        <h1> Pending Company Accounts</h1>
        {companies.map((company, index) => (
          <div key={index} className="company-item">
            <h3>{company.companyName}</h3>
            <button onClick={() => toggleCompanyDetails(index)}>
              {visibleCompany === index ? 'Hide' : 'View'}
            </button>
            {visibleCompany === index && (
              <div className="company-details">
                <p><strong>Address:</strong> {company.companyAddress}</p>
                <p><strong>Foundation Year:</strong> {company.foundationYear}</p>
                <p><strong>Employee Size:</strong> {company.employeeSize}</p>
                <p><strong>Representative Name:</strong> {company.name}</p>
                <p><strong>Email:</strong> {company.email}</p>
                <div className="action-buttons">
                  <button className="approve-button" onClick={() => handleApprove(company, index)}>Approve Company</button>
                  <button className="reject-button" onClick={() => handleReject(company, index)}>Reject</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </CoordinatorHome>
  );
}

export default CoordinatorCompanies;
