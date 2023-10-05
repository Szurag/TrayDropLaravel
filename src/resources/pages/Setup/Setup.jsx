import {
    Box,
    TextField,
    Typography,
    InputAdornment,
    CircularProgress,
    IconButton,
    useMediaQuery,
    Tooltip,
} from "@mui/material";
import Tile from "../../components/Tile/Tile";
import icon from "../../assets/img/icon.png";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { generatePath, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDebounceEffect } from "../../components/Tools/useDebounceEffect";
import { useTheme } from "@mui/material";

export default function Setup() {
    const { i18n, t } = useTranslation();
    const [serverAddressField, setServerAddressField] = useState(
        "https://traydrop.pl",
    );
    const serverAddress = useDebounceEffect(serverAddressField, 500);
    const [isServerLoading, setIsServerLoading] = useState(false);
    const [isServerResponding, setIsServerResponding] = useState(true);
    const theme = useTheme();
    const isExtraSmall = useMediaQuery(theme.breakpoints.down("md"));

    const navigate = useNavigate();

    const electron = localStorage.getItem("device_type") === "electron";

    const [animation_tile_opacity, setAnimation_tile_opacity] = useState(
        electron ? 1 : 0.0,
    );
    const [animation_title_opacity, setAnimation_title_opacity] = useState(0.0);
    const [animation_field_opacity, setAnimation_field_opacity] = useState(
        electron ? 1 : 0.0,
    );

    const [animation_title_size, setAnimation_title_size] = useState(
        electron ? 40 : 50,
    );
    const [animation_icon_size, setAnimation_icon_size] = useState(
        electron ? "30%" : "40%",
    );
    const [animation_tile_size, setAnimation_tile_size] = useState(
        electron ? 7 : 10,
    );

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        i18n.changeLanguage(navigator.language || "en");
        localStorage.setItem("locale", i18n.language);

        if (electron) return;

        if (searchParams.get("skip_intro") === "1") {
            setAnimation_tile_opacity(1);
            setAnimation_tile_size(1);
            setAnimation_title_opacity(0);
            setAnimation_field_opacity(1);
            setAnimation_title_size(40);
            setAnimation_icon_size("30%");
            setAnimation_tile_size(7);
            return;
        }

        if (isExtraSmall) {
            setAnimation_tile_size(5);
            setAnimation_tile_opacity(1.0);
            setAnimation_title_size(10);
            setTimeout(() => {
                if (localStorage.getItem("token")?.length > 0) {
                    navigate(generatePath("/"));
                }

                setAnimation_title_opacity(0.0);
            }, 300);
            setTimeout(() => {
                setAnimation_field_opacity(1.0);
            }, 1000);
            return;
        }

        // LANDING PHASE
        setAnimation_tile_opacity(1.0);
        setTimeout(() => {
            setAnimation_title_opacity(1.0);
        }, 800);

        // TRANSITION TO FORM
        setTimeout(() => {
            if (localStorage.getItem("token")?.length > 0) {
                navigate(generatePath("/"));
            }

            setAnimation_title_opacity(0.0);
            setAnimation_icon_size("30%");
            setAnimation_tile_size(7);
        }, 2300);
        setTimeout(() => {
            setAnimation_title_size(40);
        }, 2600);
        setTimeout(() => {
            setAnimation_field_opacity(1.0);
        }, 3000);
    }, [isExtraSmall]);

    useEffect(() => {
        setIsServerLoading(true);

        if (serverAddress.length > 0) {
            handleServerStatus(serverAddress);
            return;
        }

        setIsServerLoading(false);
        setIsServerResponding(false);
    }, [serverAddress]);

    const handleSetup = (event) => {
        if (event?.key && event?.key !== "Enter") {
            return;
        }

        if (isServerResponding) {
            localStorage.setItem("hostname-main", serverAddress);
            localStorage.setItem("hostname", serverAddress);

            // FORM FADE OUT
            setAnimation_tile_opacity(0);
            setTimeout(() => {
                navigate(generatePath("/login"));
            }, 700);
        }
    };

    const handleServerStatus = async (address) => {
        axios
            .get(`${address}/api/status`)
            .then((response) => {
                if (response.data.status === "OK") {
                    localStorage.setItem("P_APP_KEY", response.data.app_key);
                    localStorage.setItem("P_CLUSTER", response.data.cluster);
                    setIsServerResponding(true);
                } else {
                    setIsServerResponding(false);
                }

                setIsServerLoading(false);
            })
            .catch((error) => {
                setIsServerLoading(false);
                setIsServerResponding(false);
                console.error(error);
            });
    };

    return (
        <Tile
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                p: animation_tile_size,
                transition: `${electron ? "0s" : "0.5s"} all, ${
                    electron ? "0s" : "2s"
                } padding`,
                opacity: animation_tile_opacity,
                width: { xs: "90%", md: "auto" },
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <img
                    src={icon}
                    style={{
                        width: animation_icon_size,
                        textAlign: "center",
                        transition: `${electron ? "0s" : "2s"} width`,
                    }}
                />
            </Box>
            <Typography
                sx={{
                    fontSize: animation_title_size,
                    opacity: animation_title_opacity,
                    transition: `${electron ? "0s" : "1s"} opacity, ${
                        electron ? "0s" : "2s"
                    } font-size`,
                    textAlign: "center",
                    cursor: "default",
                }}
            >
                {t("main:setup.welcome_message")}
            </Typography>
            <TextField
                label={t("main:setup.server_address")}
                value={serverAddressField}
                onChange={(event) => setServerAddressField(event.target.value)}
                sx={{
                    opacity: animation_field_opacity,
                    transition: `${electron ? "0s" : "1s"} opacity`,
                }}
                onKeyDown={handleSetup}
                disabled={animation_title_size > 40}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {!!isServerLoading ? (
                                <CircularProgress
                                    sx={{ color: "white" }}
                                    size={15}
                                />
                            ) : !!isServerResponding ? (
                                <Tooltip title={t("main:continue")}>
                                    <IconButton onClick={handleSetup}>
                                        <Icon
                                            icon="icons8:right-round"
                                            style={{
                                                color: "#eee",
                                                fontSize: "35px",
                                            }}
                                        />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Icon
                                    icon="typcn:times"
                                    style={{
                                        fontSize: "20px",
                                        color: "#cc4444",
                                    }}
                                />
                            )}
                        </InputAdornment>
                    ),
                }}
            />
        </Tile>
    );
}
