import { Icon } from "@iconify/react";
import {
    Box,
    Button,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Card({
    type,
    icon,
    data,
    handleOpenDeleteModal,
    buttonContent,
    onConfirm,
    optionalButtons,
    sx,
}) {
    const [t] = useTranslation();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box
            sx={{
                width: "100%",
                p: 2,
                borderRadius: 4,
                border: "1px solid #eeeeee40",
                display: "flex",
                gap: 1,
                flexDirection: "column",
                justifyContent: "space-between",
                ...sx,
            }}
        >
            <Box sx={{ display: "flex", gap: 1 }}>
                <Box>{icon}</Box>
                <Typography
                    variant="h5"
                    sx={{
                        fontSize: "18px",
                        textWrap: "wrap",
                        wordBreak: "break-all",
                    }}
                >
                    {data.content}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "start",
                    flex: 1,
                    mt: 2,
                }}
            >
                <Typography
                    variant="span"
                    sx={{
                        textWrap: "wrap",
                        wordBreak: "break-all",
                        color: "#aaa",
                        fontSize: 14,
                    }}
                >
                    {data.date}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        justifyContent: "end",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "end",
                        flex: 1,
                        mt: 3,
                    }}
                >
                    {optionalButtons?.length > 0 &&
                        optionalButtons.map((item, itemIndex) => (
                            <Box
                                sx={{ width: { xs: "100%", sm: "auto" } }}
                                key={itemIndex}
                            >
                                <Button
                                    color={item.color || "light"}
                                    variant={item.variant || "outlined"}
                                    startIcon={item.startIcon}
                                    onClick={item.action}
                                    sx={{ width: { xs: "100%", sm: "auto" } }}
                                >
                                    {item.label}
                                </Button>
                            </Box>
                        ))}
                    <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                        {type === "clipboard" ? (
                            <Button
                                color="light"
                                variant="outlined"
                                startIcon={<Icon icon={"ph:clipboard"} />}
                                onClick={() =>
                                    onConfirm(data.content, data.index)
                                }
                                sx={{ width: { xs: "100%", sm: "auto" } }}
                            >
                                {buttonContent === "completed"
                                    ? t("main:copied")
                                    : t("main:copy")}
                            </Button>
                        ) : (
                            <Button
                                color="light"
                                variant="outlined"
                                startIcon={<Icon icon={"ph:download"} />}
                                onClick={() => onConfirm(data, data.index)}
                                sx={{ width: { xs: "100%", sm: "auto" } }}
                            >
                                {buttonContent === "downloaded"
                                    ? t("main:downloaded")
                                    : buttonContent === "downloading"
                                    ? t("main:downloading")
                                    : buttonContent === "queued"
                                    ? t("main:queued")
                                    : t("main:download")}
                            </Button>
                        )}
                    </Box>
                    <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                        <Button
                            color="error"
                            variant="contained"
                            startIcon={<Icon icon={"ph:minus-circle"} />}
                            onClick={() =>
                                handleOpenDeleteModal({ content: data.content })
                            }
                            sx={{ width: { xs: "100%", sm: "auto" } }}
                        >
                            {t("main:remove")}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
