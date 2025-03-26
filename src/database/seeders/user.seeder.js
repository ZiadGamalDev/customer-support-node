import User from '../models/user.model.js';
import { hash } from '../../utils/crypto.js';
import { roles } from '../enums/user.enum.js';

const password = await hash('123456789');
const date = new Date();

const users = [
    {
        role: roles.ADMIN,
        name: 'Admin',
        email: 'admin@example.com',
        password: password,
        phone: '1234567890',
        emailVerifiedAt: date,
    },
    {
        role: roles.USER,
        name: 'User',
        email: 'user@example.com',
        password: password,
        phone: '1234567891',
        emailVerifiedAt: date,
    },
    {
        role: roles.AGENT,
        name: 'Alice Smith',
        email: 'alice@example.com',
        password: password,
        phone: '1234567892',
        emailVerifiedAt: date,
    },
    {
        role: roles.AGENT,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: password,
        phone: '1234567893',
        emailVerifiedAt: date,
    },
    {
        role: roles.AGENT,
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: password,
        phone: '1234567894',
        emailVerifiedAt: date,
    },
    {
        role: roles.AGENT,
        name: 'David Wilson',
        email: 'david@example.com',
        password: password,
        phone: '1234567895',
        emailVerifiedAt: date,
    },
    {
        role: roles.AGENT,
        name: 'Eva Green',
        email: 'eva@example.com',
        password: password,
        phone: '1234567896',
        emailVerifiedAt: date,
    },
    {
        role: roles.AGENT,
        name: 'Frank White',
        email: 'frank@example.com',
        password: password,
        phone: '1234567897',
        emailVerifiedAt: date,
    },
    {
        role: roles.AGENT,
        name: 'Grace Black',
        email: 'grace@example.com',
        password: password,
        phone: '1234567898',
        emailVerifiedAt: date,
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
