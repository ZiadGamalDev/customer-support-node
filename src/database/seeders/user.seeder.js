import User from '../models/user.model.js';
import { hash } from '../../utils/crypto.js';
import { roles, statuses } from '../enums/user.enum.js';

const password = await hash('123456789zZ');
const date = new Date();

const users = [
    {
        role: roles.ADMIN,
        name: 'Admin',
        email: 'admin@customer-support.com',
        password: password,
        emailVerifiedAt: date,
    },
    {
        role: roles.USER,
        name: 'User',
        email: 'user@example.com',
        password: password,
        emailVerifiedAt: date,
    },
    {
        role: roles.AGENT,
        status: statuses.AVAILABLE,
        name: 'Ziad Gamal',
        email: 'ziadgamal@example.com',
        password: password,
        emailVerifiedAt: date,
    },
    {
        role: roles.AGENT,
        status: statuses.AVAILABLE,
        name: 'Sara Khaled',
        email: 'sarakhaled@example.com',
        password: password,
        emailVerifiedAt: date,
    },
    {
        role: roles.AGENT,
        name: 'Ahmed Frag',
        email: 'ahmedfrag@example.com',
        password: password,
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
