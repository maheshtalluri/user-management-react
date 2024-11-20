import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Box, Grid, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const baseURL = 'http://localhost:8080/users';

function UserManagement() {
    const [id, setId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [users, setUsers] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(baseURL);
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAddUser = async () => {
        if (!id || !firstName || !lastName || !email || !department) {
            alert('All fields are required');
            return;
        }
        try {
            const response = await axios.post(baseURL, { id, firstName, lastName, email, department });
            setUsers([...users, response.data]);
            resetForm();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleUpdateUser = async () => {
        if (!id || !firstName || !lastName || !email || !department) {
            alert('All fields are required');
            return;
        }
        try {
            const userId = users[editIndex].id;
            const response = await axios.put(`${baseURL}/${userId}`, { id, firstName, lastName, email, department });
            const newUsers = [...users];
            newUsers[editIndex] = response.data;
            setUsers(newUsers);
            resetForm();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = async (index) => {
        try {
            const userId = users[index].id;
            await axios.delete(`${baseURL}/${userId}`);
            const newUsers = [...users];
            newUsers.splice(index, 1);
            setUsers(newUsers);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditUser = (index) => {
        const user = users[index];
        setId(user.id);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setDepartment(user.department);
        setEditIndex(index);
    };

    const resetForm = () => {
        setId('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setDepartment('');
        setEditIndex(null);
    };

    const handleIdChange = (e) => {
        if (isNaN(e.target.value)) {
            alert('ID should be a number');
            return;
        }
        setId(e.target.value);
    };

    return (
        <Card style={{ maxWidth: 1200, margin: 'auto', padding: '20px', marginTop: '50px' }}>
            <CardContent>
                <Typography variant="h4" color="primary" fontWeight="bold" textAlign="center" component="h2" gutterBottom style={{ marginBottom: '50px' }}>
                    User Management
                </Typography>
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                    <Box flex={1} marginRight={4}>
                        <Typography variant="h5" color="primary" fontWeight="bold" component="h2" gutterBottom>
                            User Details
                        </Typography>
                        <Box component="form" noValidate autoComplete="off">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ID"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={id}
                                        onChange={handleIdChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="First Name"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Last Name"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Email"
                                        type="email"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Department"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Button variant="contained" color="primary" onClick={editIndex === null ? handleAddUser : handleUpdateUser}>
                                        {editIndex === null ? 'Add User' : 'Update User'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Box flex={1} maxHeight={400} overflow="auto">
                        <Typography variant="h5" color="primary" fontWeight="bold" component="h2" gutterBottom>
                            Users List
                        </Typography>
                        <List>
                            {users.map((user, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={`Name: ${user.firstName} ${user.lastName}`}
                                        secondary={`ID: ${user.id}, Email: ${user.email}, Department: ${user.department}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <Box display="flex" alignItems="center">
                                            <IconButton edge="end" aria-label="edit" onClick={() => handleEditUser(index)} color="primary" ml={4}>
                                                <EditIcon />
                                            </IconButton>
                                            <Box mx={1} />
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteUser(index)} style={{ color: '#FF0000' }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default UserManagement;