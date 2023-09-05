import { FormProvider, useForm } from "react-hook-form";
import Tile from "../../components/Tile/Tile";
import { Button, TextField, Box, Typography, Switch } from "@mui/material";
import { useTranslation } from "react-i18next";
import { generatePath, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import hashPassword from "../../components/Tools/hashAlgorithm";
import axios from "axios";
import { useSnackbar } from "notistack";

export default function Register() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!localStorage.getItem("hostname")?.length > 0) {
            navigate(generatePath("/setup"));
        }

        if (localStorage.getItem("token")?.length > 0) {
            navigate(generatePath("/"));
        }
    }, []);

    const methods = useForm();
    const onSubmit = (formValues) => {
        if (formValues.password != formValues.password_confirmation) {
            handleSnackbarOpen(
                "error",
                t("main:errors.passwords_not_the_same"),
            );
            return;
        }

        formValues.encrypt_files = !!formValues.encrypt_files ? "1" : "0";

        axios
            .post(
                `${localStorage.getItem("hostname")}/api/auth/register`,
                formValues,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                },
            )
            .then((response) => {
                if (!response.data.token) {
                    handleSnackbarOpen(
                        "error",
                        t("main:errors.failed_to_register"),
                    );
                } else {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user_id", response.data.user.id);
                    localStorage.setItem(
                        "_gqwexvcfq",
                        hashPassword(formValues.password),
                    );

                    navigate(generatePath("/"));
                }
            })
            .catch((error) => {
                handleSnackbarOpen("error", `Error: ${error}`);
                console.error(error);
            });
    };

    const handleLogin = () => {
        navigate(generatePath("/login"));
    };

    const handleSetup = () => {
        navigate(generatePath("/setup"));
    };

    const handleSnackbarOpen = (color = "success", content = ".") => {
        enqueueSnackbar(content, {
            variant: color,
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
            },
        });
    };

    return (
        <>
            <Tile
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    p: 4,
                    width: {
                        xs: "95%",
                        sm: "85%",
                        md: "60%",
                        lg: "45%",
                        xl: "35%",
                    },
                }}
            >
                <Typography variant="h4" sx={{ mb: 2 }}>
                    {t("main:setup.register")}
                </Typography>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flexWrap: "wrap",
                                width: "100%",
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    {...methods.register("name")}
                                    label={t("main:name")}
                                    sx={{ width: "100%" }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    {...methods.register("email")}
                                    label={t("main:email")}
                                    sx={{ width: "100%" }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    {...methods.register("password")}
                                    label={t("main:password")}
                                    type="password"
                                    sx={{ width: "100%" }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    {...methods.register(
                                        "password_confirmation",
                                    )}
                                    label={t("main:password_confirmation")}
                                    type="password"
                                    sx={{ width: "100%" }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Switch
                                    {...methods.register("encrypt_files")}
                                />
                                <Typography
                                    variant="caption"
                                    sx={{ fontSize: 14 }}
                                >
                                    {t("main:setup.encrypt_files")}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    mt: 3,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    type="submit"
                                    sx={{ flex: 1 }}
                                    color="light"
                                >
                                    {t("main:register")}
                                </Button>
                                <Button
                                    variant="outlined"
                                    sx={{ flex: 1 }}
                                    color="light"
                                    onClick={handleLogin}
                                >
                                    {t("main:login")}
                                </Button>
                            </Box>
                            <Button
                                variant="outlined"
                                sx={{ flex: 1 }}
                                color="light"
                                onClick={handleSetup}
                            >
                                {t("main:setup.change_server")}
                            </Button>
                        </Box>
                    </form>
                </FormProvider>
            </Tile>
        </>
    );
}
