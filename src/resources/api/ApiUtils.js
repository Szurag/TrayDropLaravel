export const forbiddenLogout = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("_gqwexvcfq", "");
    window.location.reload();
};
