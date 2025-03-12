 
import React, { useState } from 'react';
const employ = () => {
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [employees, setEmployees] = useState([]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const newEmployee = { name, position };
        setEmployees([...employees, newEmployee]);
        setName('');
        setPosition('');
    };
    return (
        <div>
            <h1>Create Employee</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Position:</label>
                    <input 
                        type="text" 
                        value={position} 
                        onChange={(e) => setPosition(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Add Employee</button>
            </form>
            <h2>Employee List</h2>
            <ul>
                {employees.map((employee, index) => (
                    <li key={index}>
                        {employee.name} - {employee.position}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default employ;