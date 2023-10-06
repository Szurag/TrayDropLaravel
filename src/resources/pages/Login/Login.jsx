import { FormProvider, useForm } from "react-hook-form";
import Tile from "../../components/Tile/Tile";
import { Button, TextField, Box, Typography, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { generatePath, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import hashPassword from "../../components/Tools/hashAlgorithm";
import axios from "axios";
import { useSnackbar } from "notistack";
import LoadingButton from "@mui/lab/LoadingButton";
import PairdropEmbed from "../Dashboard/Pairdrop/PairdropEmbed.jsx";
import pairdrop from "../../assets/img/pairdrop.png";

export default function Login() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [animation_tile_opacity, setAnimation_tile_opacity] = useState(0.0);
    const [loginLoading, setLoginLoading] = useState(false);
    const [pairdropPositionOffset, setPairdropPositionOffset] = useState(0);
    const [pairdropState, setPairdropState] = useState(false);

    const handleTogglePairdrop = () => {
        setPairdropPositionOffset(pairdropState ? 0 : 48);
        setPairdropState(!pairdropState);
    };

    useEffect(() => {
        if (!localStorage.getItem("hostname")?.length > 0) {
            navigate(generatePath("/setup"));
        }

        if (localStorage.getItem("token")?.length > 0) {
            navigate(generatePath("/"));
        }

        setAnimation_tile_opacity(1);
    }, []);

    const methods = useForm();
    const onSubmit = (formValues) => {
        setLoginLoading(true);
        axios
            .post(
                `${localStorage.getItem("hostname")}/api/auth/login`,
                formValues,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                },
            )
            .then((response) => response.data)
            .then((data) => {
                setLoginLoading(false);
                if (typeof data.token !== "undefined") {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user_id", data.user.id);
                    localStorage.setItem(
                        "_gqwexvcfq",
                        hashPassword(formValues.password),
                    );

                    navigate(generatePath("/"));
                }
            })
            .catch((error) => {
                setLoginLoading(false);
                if (
                    error.response.status === 401 ||
                    error.response.status === 403
                ) {
                    handleSnackbarOpen(
                        "error",
                        t("main:errors.failed_to_authenticate"),
                    );
                    return;
                }

                handleSnackbarOpen("error", `Error: ${error}`);
            });
    };

    const handleRegister = () => {
        navigate(generatePath("/register"));
    };

    const handleSetup = () => {
        navigate(generatePath("/setup?skip_intro=1"));
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
                    opacity: animation_tile_opacity,
                    transition: "0.5s opacity",
                }}
            >
                <Typography variant="h4" sx={{ mb: 2 }}>
                    {t("main:setup.login")}
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
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    mt: 3,
                                }}
                            >
                                <LoadingButton
                                    variant="contained"
                                    type="submit"
                                    sx={{ flex: 1 }}
                                    color="light"
                                    loading={loginLoading}
                                >
                                    {t("main:login")}
                                </LoadingButton>
                                <Button
                                    variant="outlined"
                                    sx={{ flex: 1 }}
                                    color="light"
                                    onClick={handleRegister}
                                >
                                    {t("main:register")}
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
            <PairdropEmbed state={pairdropState} />
            <Box
                sx={{
                    position: "absolute",
                    right: pairdropPositionOffset + -48 + "px",
                    bottom: pairdropPositionOffset + -48 + "px",
                    transition: "0.2s",
                    "&:hover": {
                        right: pairdropState
                            ? pairdropPositionOffset + -48 + "px"
                            : "-24px",
                        bottom: pairdropState
                            ? pairdropPositionOffset + -48 + "px"
                            : "-24px",
                        pr: "5px",
                        pb: "5px",
                    },
                }}
            >
                <IconButton onClick={handleTogglePairdrop}>
                    <img src={pairdrop} height="48px" width="48px" />
                </IconButton>
            </Box>
        </>
    );
}
