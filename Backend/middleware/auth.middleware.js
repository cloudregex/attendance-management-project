export const checkAuth = (req, res, next) => {
    console.log("Auth checked");
    next();
};