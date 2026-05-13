const logoutService = {
    logout: async () => {
        return new Promise((resolve) => {
            localStorage.removeItem("token"); // Para destruir el token
            resolve({ success: true });
        });
    }
};

export default logoutService;