const profileResponse = (user) => {
  return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      image: user.image?.url,
      emailVerifiedAt: user.emailVerifiedAt || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
  };
};

export default profileResponse;
