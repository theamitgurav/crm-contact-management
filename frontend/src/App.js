import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function App() {
    const [contacts, setContacts] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        company: '',
        jobTitle: ''
    });
    const [editingContactId, setEditingContactId] = useState(null); // State for editing contact

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const response = await axios.get('http://localhost:5000/contacts');
        setContacts(response.data);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      if (editingContactId) {
        // Update existing contact
        await axios.put(`http://localhost:5000/contacts/${editingContactId}`, formData);
        setEditingContactId(null); // Reset editing contact ID
    } else {
        // Add new contact
        await axios.post('http://localhost:5000/contacts', formData);
    }
    fetchContacts(); // Refresh the contact list
    setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', company: '', jobTitle: '' }); // Reset form
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/contacts/${id}`);
        fetchContacts(); // Refresh the contact list
    };

    const handleEdit = (contact) => {
      setEditingContactId(contact.id); // Set the ID of the contact to edit
      setFormData(contact); // Populate form with selected contact's data
  };

    return (
        <Container>
            <h1>Contact Management</h1>
            <form onSubmit={handleSubmit}>
                <TextField name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} required />
                <TextField name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} required />
                <TextField name="email" label="Email" value={formData.email} onChange={handleChange} required />
                <TextField name="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
                <TextField name="company" label="Company" value={formData.company} onChange={handleChange} />
                <TextField name="jobTitle" label="Job Title" value={formData.jobTitle} onChange={handleChange} />
                <Button type="submit" variant="contained">Add Contact</Button>
            </form>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Job Title</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow key={contact.id}>
                                <TableCell>{contact.firstName}</TableCell>
                                <TableCell>{contact.lastName}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.phoneNumber}</TableCell>
                                <TableCell>{contact.company}</TableCell>
                                <TableCell>{contact.jobTitle}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEdit(contact)} variant="contained" color="primary">Edit</Button>
                                    <Button onClick={() => handleDelete(contact.id)} variant="contained" color="secondary">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default App;