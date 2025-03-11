import User from '../models/user.model.js';
import { hash } from '../../utils/crypto.js';

const password = await hash('123456789');
const date = new Date();

const users = [
    {
        role: 'admin',
        name: 'Admin',
        email: 'admin@example.com',
        password: password,
        phone: '1234567890',
        emailVerifiedAt: date,
    },
    {
        name: 'User',
        email: 'user@example.com',
        password: password,
        phone: '1234567891',
        emailVerifiedAt: date,
    },
    {
        name: 'Alice Smith',
        email: 'alice@example.com',
        password: password,
        phone: '1234567892',
    },
    {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: password,
        phone: '1234567893',
    },
    {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: password,
        phone: '1234567894',
    },
    {
        name: 'David Wilson',
        email: 'david@example.com',
        password: password,
        phone: '1234567895',
    },
    {
        name: 'Eva Green',
        email: 'eva@example.com',
        password: password,
        phone: '1234567896',
    },
    {
        name: 'Frank White',
        email: 'frank@example.com',
        password: password,
        phone: '1234567897',
    },
    {
        name: 'Grace Black',
        email: 'grace@example.com',
        password: password,
        phone: '1234567898',
    },
];

const userSeeder = async () => {
    try {
        await User.deleteMany({});
        await User.insertMany(users);
        
        console.log('Users seeded successfully');
    } catch (error) {
        console.error('Users seeding error:', error);
    }
};

export default userSeeder;
