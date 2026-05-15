import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
    try {
        console.log('Testing Permissions Get...');
        const permGet = await axios.get(`${BASE_URL}/permissions/definitions/get`);
        console.log('Permissions Get Success:', permGet.data.length, 'records');

        console.log('Testing Roles Get...');
        const rolesGet = await axios.get(`${BASE_URL}/roles/get`);
        console.log('Roles Get Success:', rolesGet.data.length, 'records');

        console.log('Testing Users Get...');
        const usersGet = await axios.get(`${BASE_URL}/users/get`);
        console.log('Users Get Success:', usersGet.data.length, 'records');

    } catch (error) {
        console.error('Test Failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

testEndpoints();
