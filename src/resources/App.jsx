import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Setup from "./pages/Setup/Setup";
import E404 from "./pages/Error/E404";
import { SnackbarProvider, useSnackbar } from "notistack";
import SnackbarCloseButton from "./components/Modules/SnackbarCloseButton";
import axios from "axios";
import { useEffect, useState } from "react";
import SnackbarSetupInfo from "./components/Modules/SnackbarSetupInfo";

const validateToken = () => {
    return axios
        .get(`${localStorage.getItem("hostname")}/api/files`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then(() => true)
        .catch(() => false);
};

const ProtectedRoute = ({ children }) => {
    if (!validateToken()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const checkMain = () => {
    return axios
        .get(`${localStorage.getItem("hostname-main")}/api/status`)
        .then((response) => {
            if (response.data.status === "OK") {
                localStorage.setItem(
                    "hostname",
                    localStorage.getItem("hostname-main"),
                );
                return true;
            } else {
                return checkAlternative();
            }
        })
        .catch(() => {
            return checkAlternative();
        });
};

const checkAlternative = () => {
    return axios
        .get(`${localStorage.getItem("hostname-alt")}/api/status`)
        .then((response) => {
            if (response.data.status === "OK") {
                localStorage.setItem(
                    "hostname",
                    localStorage.getItem("hostname-alt"),
                );
                return true;
            } else {
                console.error("Failed to validate hostname, try again later");
                return false;
            }
        })
        .catch((error) => {
            console.error(
                "Failed to validate hostname, try again later: ",
                error,
            );
            return false;
        });
};

function App() {
    const [snackbarState, setSnackbarState] = useState("");

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
            light: {
                main: "#fff",
                contrastText: "#000",
            },
            success: {
                main: "#388e3c",
                contrastText: "#fff",
            },
            error: {
                main: "#d32f2f",
                contrastText: "#fff",
            },
            info: {
                main: "#0288d1",
                contrastText: "#fff",
            },
            warning: {
                main: "#f57c00",
                contrastText: "#fff",
            },
        },
    });

    useEffect(() => {
        if (localStorage.getItem("hostname-main")?.length > 0) {
            if (checkMain()) {
                if (
                    localStorage.getItem("hostname-main") ===
                    localStorage.getItem("hostname")
                ) {
                    setSnackbarState("main");
                } else {
                    setSnackbarState("alt");
                }
            } else {
                localStorage.setItem("hostname", "");
                setSnackbarState("error");
            }
        }
    }, []);

    return (
        <ThemeProvider theme={darkTheme}>
            <SnackbarProvider
                maxSnack={5}
                autoHideDuration={2000}
                style={{ paddingRight: "50px" }}
                action={(snackbarKey) => (
                    <SnackbarCloseButton snackbarKey={snackbarKey} />
                )}
            >
                <CssBaseline />
                <BrowserRouter>
                    <SnackbarSetupInfo status={snackbarState} />
                    <Routes>
                        <Route
                            index
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="setup" element={<Setup />} />
                        <Route path="*" element={<E404 />} />
                    </Routes>
                </BrowserRouter>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
