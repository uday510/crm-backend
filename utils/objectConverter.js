/**
 * ! I will have the logic to transform the object 
 */

exports.userResponse = (users) => {
   const usersResponse = [];

    users.forEach(user => {
        usersResponse.push({
            name: user.name,
            userId: user.userId,
            email: user.email,
            userType: user.userType,
            userStatus: user.userStatus
        });
    });
    return usersResponse;
}