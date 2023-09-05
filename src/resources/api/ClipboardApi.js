import axios from "axios";

export const clipboardList = (data, callback) => {
    axios
        .get(`${localStorage.getItem("hostname")}/api/clipboard`, {
            params: data,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => callback(response))
        .catch((error) => {
            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                localStorage.setItem("token", "");
                localStorage.setItem("_gqwexvcfq", "");
                window.location.reload();
            }
            callback(null, error);
        });
};

export const clipboardCreate = (data, callback) => {
    axios
        .post(`${localStorage.getItem("hostname")}/api/clipboard`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                Accept: "application/json",
            },
        })
        .then((response) => callback(response))
        .catch((error) => {
            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                localStorage.setItem("token", "");
                localStorage.setItem("_gqwexvcfq", "");
                window.location.reload();
            }
            callback(null, error);
        });
};

export const clipboardDelete = (data, callback) => {
    axios
        .delete(
            `${localStorage.getItem("hostname")}/api/clipboard/` + data.id,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            },
        )
        .then((response) => callback(response))
        .catch((error) => {
            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                localStorage.setItem("token", "");
                localStorage.setItem("_gqwexvcfq", "");
                window.location.reload();
            }
            callback(null, error);
        });
};

export const clipboardDeleteAll = (callback) => {
    axios
        .delete(`${localStorage.getItem("hostname")}/api/clipboard/all`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                Accept: "application/json",
            },
        })
        .then((response) => callback(response))
        .catch((error) => {
            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                localStorage.setItem("token", "");
                localStorage.setItem("_gqwexvcfq", "");
                window.location.reload();
            }
            callback(null, error);
        });
};
