import React, { useState , useEffect } from 'react';
import '../../Pages/Coordinator/CoordinatorCompanies.css';
import { GetWithAuth } from "../../Services/HttpService.js";
import { PutWithAuth } from "../../Services/HttpService.js";

/*
Coordinator grades yerine konuldu
Corrdinator gradesi hala silmedim belki ilerde ihtiyaç olabilir diye
*/
export default function CoordinatorCompaniesV2() {
  const [companies, setCompanies] = useState([]);
  const [visibleCompany, setVisibleCompany] = useState(null);

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
            console.log(result);
            setCompanies(result);
            companies.map((company) => {
                console.log(company.companyName);
            });
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
      <div className="" style={{width: "100%", padding: "20px 40px"}}>
        <h2> Pending Company Accounts</h2>
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
  );
}