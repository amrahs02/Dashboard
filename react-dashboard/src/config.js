const API_BASE =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://dashboardapi-1xma.onrender.com";

export default API_BASE;
