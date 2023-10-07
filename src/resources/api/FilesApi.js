import axios from "axios";
import {forbiddenLogout} from "./ApiUtils.js";

export const filesList = (data, callback) => {
    axios
        .get(`${localStorage.getItem("hostname")}/api/files`, {
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
                forbiddenLogout();
            }
            callback(null, error);
        });
};

export const filesCreate = (data, onUploadProgress, callback) => {
    axios
        .post(`${localStorage.getItem("hostname")}/api/files`, data.form, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                "Content-Encoding": "multipart/form-data",
            },
            onUploadProgress: onUploadProgress,
            cancelToken: data.cancelToken,
        })
        .then((response) => callback(response))
        .catch((error) => {
            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                forbiddenLogout();
            }
            callback(null, error);
        });
};

export const filesDelete = (data, callback) => {
    axios
        .delete(`${localStorage.getItem("hostname")}/api/files/` + data.id, {
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
                forbiddenLogout();
            }
            callback(null, error);
        });
};

export const filesDownload = (data, onDownloadProgress, callback) => {
    axios
        .get(
            `${localStorage.getItem("hostname")}/api/files/${data.id}/download`,
            {
                params: {
                    password: data.password,
                },
                cancelToken: data.cancelToken,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                responseType: "blob",
                onDownloadProgress: onDownloadProgress,
            },
        )
        .then((response) => callback(response))
        .catch((error) => {
            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                forbiddenLogout();
            }
            callback(null, error);
        });
};

export const filesDeleteAll = (callback) => {
    axios
        .delete(`${localStorage.getItem("hostname")}/api/files/all`, {
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
                forbiddenLogout();
            }
            callback(null, error);
        });
};

export const filesShare = (data, callback) => {
    axios
        .post(`${localStorage.getItem("hostname")}/api/share`, data, {
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
                forbiddenLogout();
            }
            callback(null, error);
        });
};

export const filesSharedList = (callback) => {
    axios
        .get(`${localStorage.getItem("hostname")}/api/share`, {
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
                forbiddenLogout();
            }
            callback(null, error);
        });
};

export const filesSharedDelete = (id, callback) => {
    axios
        .delete(`${localStorage.getItem("hostname")}/api/share/${id}`, {
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
                forbiddenLogout();
            }
            callback(null, error);
        });
};
