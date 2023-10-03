import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Tile from "../../components/Tile/Tile.jsx";
import { Icon } from "@iconify/react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { caesarShift, hex2a } from "../../components/Tools/caesarShift.js";
import { generatePath, useNavigate } from "react-router-dom";

export default function TokenScrapper() {
    const [object, setObject] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const [t] = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const out = {
            token: localStorage.getItem("token"),
            _gqwexvcfq: btoa(
                caesarShift(
                    atob(
                        caesarShift(
                            hex2a(
                                caesarShift(
                                    localStorage.getItem("_gqwexvcfq"),
                                    -3,
                                ),
                            ),
                            -13,
                        ),
                    ),
                    -7,
                ),
            ),
        };

        if (out.token?.length > 0 && out._gqwexvcfq?.length > 0) {
            setObject(JSON.stringify(out));
            return;
        }

        setObject(false);
    }, []);

    const handleSnackbarOpen = (color = "success", content = ".") => {
        enqueueSnackbar(content, {
            variant: color,
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
            },
        });
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(object).then(() => {
            handleSnackbarOpen("success", t("main:copied"));
        });
    };

    return (
        <Tile
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                p: 4,
                transition: "0.5s opacity",
            }}
        >
            {object ? object : "User is not logged in"}
            {object && (
                <Button
                    variant="outlined"
                    color="light"
                    sx={{ width: "120px", margin: "10px auto" }}
                    startIcon={<Icon icon={"ph:clipboard"} />}
                    onClick={handleCopy}
                >
                    {t("main:copy")}
                </Button>
            )}
            <Typography sx={{ textAlign: "center", mt: 5, fontSize: "30px" }}>
                Apple Shortcuts
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                <Button
                    variant="outlined"
                    color="light"
                    onClick={() =>
                        (window.location.href =
                            "https://www.icloud.com/shortcuts/216ad9c4c6874202a36bbe2e14722118")
                    }
                >
                    Send to Traydrop
                </Button>
                <Button
                    variant="outlined"
                    color="light"
                    onClick={() =>
                        (window.location.href =
                            "https://www.icloud.com/shortcuts/4c6c3fed6eb94ae6acae0142efc409a3")
                    }
                >
                    Share via Traydrop
                </Button>
            </Box>
            <Button
                variant="outlined"
                color="light"
                sx={{ margin: "auto", mt: 5 }}
                onClick={() => navigate(generatePath("/"))}
            >
                Back to dashboard
            </Button>
        </Tile>
    );
}
