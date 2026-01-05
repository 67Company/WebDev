import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/AdminPanel.css";
import "../styles/Cards.css";
import { Api, Employee, Company } from "../CalendarApi";

const API_BASE_URL = "http://localhost:5000";

// API Helper Functions
async function getAllCompanies() {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.companyList();
  return response;
}

async function getAllEmployees() {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.employeeList();
  return response;
}

async function createEmployee(employeeData: Employee) {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.employeeCreate(employeeData);
  return response;
}

async function updateEmployee(employeeId: number, employeeData: Employee) {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.employeeUpdate(employeeId, employeeData);
  return response;
}

async function softDeleteEmployee(employeeId: number) {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.employeeSoftDelete(employeeId);
  return response;
}

interface EmployeeFormData {
  email: string;
  passwordHash: string;
  companyId: number;
  admin: boolean;
}

const AdminEmployees: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>(() => {
    const companyParam = searchParams.get('companyId');
    return companyParam ? parseInt(companyParam) : 0;
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState<EmployeeFormData>({
    email: '',
    passwordHash: '',
    companyId: 0,
    admin: false
  });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchCompanies();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedCompanyId > 0) {
      const filtered = employees.filter(emp => emp.companyId === selectedCompanyId);
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees([]);
    }
  }, [selectedCompanyId, employees]);

  const fetchCompanies = async () => {
    try {
      const response = await getAllCompanies();
      if (response.ok && response.data) {
        setCompanies(response.data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees();
      if (response.ok && response.data) {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              (name === 'companyId') ? parseInt(value) || 0 : value
    }));
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const employeeData: Employee = {
        email: formData.email,
        passwordHash: formData.passwordHash, // Send plain text, backend will hash
        companyId: formData.companyId,
        admin: false,
        isDeleted: false
      };

      const response = await createEmployee(employeeData);
      if (response.ok) {
        showNotification('Employee created successfully!', 'success');
        setShowCreateForm(false);
        resetForm();
        fetchEmployees();
      } else {
        showNotification('Failed to create employee', 'error');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      showNotification('Error creating employee', 'error');
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    try {
      const employeeData: Employee = {
        ...editingEmployee,
        email: formData.email,
        companyId: formData.companyId
      };

      // Only update password if a new one is provided (backend will hash it)
      if (formData.passwordHash && formData.passwordHash.trim() !== '') {
        employeeData.passwordHash = formData.passwordHash;
      }

      const response = await updateEmployee(editingEmployee.id!, employeeData);
      if (response.ok) {
        showNotification('Employee updated successfully!', 'success');
        setEditingEmployee(null);
        resetForm();
        fetchEmployees();
      } else {
        showNotification('Failed to update employee', 'error');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      showNotification('Error updating employee', 'error');
    }
  };

  const handleToggleActive = async (employee: Employee) => {
    try {
      if (employee.isDeleted) {
        // If currently deleted, we need to restore (update with isDeleted = false)
        const updatedEmployee = { ...employee, isDeleted: false };
        const response = await updateEmployee(employee.id!, updatedEmployee);
        if (response.ok) {
          showNotification('Employee restored successfully!', 'success');
          // Update local state instead of refetching
          setEmployees(prevEmployees => 
            prevEmployees.map(emp => 
              emp.id === employee.id ? { ...emp, isDeleted: false } : emp
            )
          );
        }
      } else {
        // If currently active, soft delete
        const response = await softDeleteEmployee(employee.id!);
        if (response.ok) {
          showNotification('Employee deactivated successfully!', 'success');
          // Update local state instead of refetching
          setEmployees(prevEmployees => 
            prevEmployees.map(emp => 
              emp.id === employee.id ? { ...emp, isDeleted: true } : emp
            )
          );
        }
      }
    } catch (error) {
      console.error('Error toggling employee status:', error);
      showNotification('Error updating employee status', 'error');
    }
  };

  const startEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      email: employee.email || '',
      passwordHash: '', // Clear password field 
      companyId: employee.companyId || 0,
      admin: false
    });
    setShowCreateForm(false);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      passwordHash: '',
      companyId: selectedCompanyId || 0,
      admin: false
    });
  };

  const cancelEdit = () => {
    setEditingEmployee(null);
    resetForm();
  };

  const openCreateForm = () => {
    resetForm();
    setFormData(prev => ({ ...prev, companyId: selectedCompanyId }));
    setShowCreateForm(true);
    setEditingEmployee(null);
  };

  if (loading) {
    return (
      <main className="App-main">
        <div className="overview-card">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="App-main">
      <section className="overview-card admin-container">
        <div className="admin-header">
          {!showCreateForm && !editingEmployee && (
            <Link to="/admin">
              <button className="btn-secondary">← Back</button>
            </Link>
          )}
          <h2>👥 Employee Management</h2>
          {!showCreateForm && !editingEmployee && selectedCompanyId > 0 && (
            <button className="btn-primary" onClick={openCreateForm}>
              Create New Employee
            </button>
          )}
        </div>

        {/* Notification */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        {/* Company Selection */}
        {!showCreateForm && !editingEmployee && (
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="companySelect">Select Company</label>
            <select 
              id="companySelect"
              value={selectedCompanyId} 
              onChange={(e) => {
                const companyId = parseInt(e.target.value);
                setSelectedCompanyId(companyId);
                if (companyId > 0) {
                  setSearchParams({ companyId: companyId.toString() });
                } else {
                  setSearchParams({});
                }
              }}
            >
              <option value={0}>-- Select a Company --</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedCompanyId === 0 && (
          <div className="no-events">
            <p>Please select a company to view and manage employees.</p>
          </div>
        )}

        {selectedCompanyId > 0 && (
          <>
            {/* Create Employee Form */}
            {showCreateForm && (
              <div className="event-form-container">
                <div className="form-header">
                  <h2>Create New Employee</h2>
                  <button className="btn-close" onClick={() => setShowCreateForm(false)}>×</button>
                </div>
                <form onSubmit={handleCreateEmployee} className="event-form">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="passwordHash">Password</label>
                    <input
                      type="password"
                      id="passwordHash"
                      name="passwordHash"
                      value={formData.passwordHash}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="companyId">Company</label>
                    <select
                      id="companyId"
                      name="companyId"
                      value={formData.companyId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value={0}>-- Select Company --</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Create Employee
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Employee Form */}
            {editingEmployee && (
              <div className="event-form-container">
                <div className="form-header">
                  <h2>Edit Employee: {editingEmployee.email}</h2>
                  <button className="btn-close" onClick={cancelEdit}>×</button>
                </div>
                <form onSubmit={handleUpdateEmployee} className="event-form">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="passwordHash">Password (leave empty to keep current)</label>
                    <input
                      type="password"
                      id="passwordHash"
                      name="passwordHash"
                      value={formData.passwordHash}
                      onChange={handleInputChange}
                      placeholder="Enter new password or leave empty"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="companyDisplay">Company</label>
                    <input
                      type="text"
                      id="companyDisplay"
                      value={companies.find(c => c.id === editingEmployee.companyId)?.name || 'Unknown'}
                      disabled
                      style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={cancelEdit}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Update Employee
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Employees Table */}
            {!showCreateForm && !editingEmployee && (
              <div className="events-table-container">
                <h2>Employees ({filteredEmployees.length})</h2>
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Company</th>
                      <th>Admin</th>
                      <th>Meetings</th>
                      <th>Events</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="no-events">No employees found for this company</td>
                      </tr>
                    ) : (
                      filteredEmployees.map(employee => (
                        <tr key={employee.id} className={employee.isDeleted ? 'deleted-row' : ''}>
                          <td>{employee.id}</td>
                          <td>{employee.email}</td>
                          <td>{companies.find(c => c.id === employee.companyId)?.name || employee.companyId}</td>
                          <td>{employee.admin ? '✓' : '✗'}</td>
                          <td>{employee.meetingsAttended}</td>
                          <td>{employee.eventsAttended}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <label className="toggle-switch">
                                <input
                                  type="checkbox"
                                  checked={!employee.isDeleted}
                                  onChange={() => handleToggleActive(employee)}
                                />
                                <span className="slider"></span>
                              </label>
                              <span style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                                {employee.isDeleted ? 'Inactive' : 'Active'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-edit"
                                onClick={() => startEdit(employee)}
                                disabled={employee.isDeleted}
                                title="Edit Employee"
                              >
                                ✏️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default AdminEmployees;
