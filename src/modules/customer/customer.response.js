const customerResponse = (customer) => {
    return {
        id: customer._id,
        username: customer.username,
        email: customer.email,
        phoneNumbers: customer.phoneNumbers,
        addresses: customer.addresses,
        role: customer.role,
        age: customer.age,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,  
    };
};

export default customerResponse;
