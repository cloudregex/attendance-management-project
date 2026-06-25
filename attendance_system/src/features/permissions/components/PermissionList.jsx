import React, { useEffect, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const PermissionList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permDefs, setPermDefs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, rRes, pRes] = await Promise.all([
        axiosInstance.get('/users/get'),
        axiosInstance.get('/roles/get'),
        axiosInstance.get('/permissions/definitions/get'),
      ]);
      setUsers(uRes.data || []);
      setRoles(rRes.data || []);
      setPermDefs(pRes.data || []);
    } catch (err) {
      console.error('Error fetching permission list data', err);
    } finally {
      setLoading(false);
    }
  }; 

  useEffect(() => {
    fetchData();
  }, []);

  const getRoleForUser = (roleId) => roles.find(r => r.id === roleId) || null;

  const effectivePermissions = (user) => {
    // Prefer explicit user.permissions if provided; otherwise use role defaults
    if (user.permissions && Object.keys(user.permissions).length > 0) return user.permissions;
    const role = getRoleForUser(user.roleId);
    if (!role) return {};
    // role.permissions could be array of Permission objects or object map depending on API
    if (Array.isArray(role.permissions)) {
      const map = {};
      role.permissions.forEach(p => { map[p.id || p.name] = true; });
      return map;
    }
    return role.permissions || {};
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
      <Typography sx={{ fontWeight: 800, mb: 2 }}>User Permissions</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>SR No.</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Permissions</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => {
            const eff = effectivePermissions(user);
            return (
              <TableRow key={user.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>{(roles.find(r => r.id === user.roleId)?.name) || user.roleId}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {permDefs.map(def => (
                      <Tooltip key={def.id} title={def.name}>
                        <Chip
                          label={def.name}
                          size="small"
                          color={eff[def.id] || eff[def.name] ? 'primary' : 'default'}
                          variant={eff[def.id] || eff[def.name] ? 'filled' : 'outlined'}
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/permissions/edit/${user.id}`)}
                    sx={{ textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default PermissionList;
