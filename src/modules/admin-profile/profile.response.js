const profileResponse = (user) => {
  return {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      image: user.image?.url,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
  };
};

export default profileResponse;
