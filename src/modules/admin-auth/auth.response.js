import userResponse from "../user/user.response.js";

const authResponse = (user, token) => {
	return {
		user: userResponse(user),
		token,
	};
};

export default authResponse;
