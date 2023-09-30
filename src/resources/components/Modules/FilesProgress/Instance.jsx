import { Icon } from "@iconify/react";
import {
    Box,
    IconButton,
    LinearProgress,
    Typography,
    linearProgressClasses,
    Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Instance({ data, type, handleCancelTransfer }) {
    const [t] = useTranslation();

    const calculateValue = (value) => {
        if (value > 1073741824) {
            return (value / 1073741824).toFixed(2) + "GB";
        } else if (value > 1048576) {
            return (value / 1048576).toFixed(2) + "MB";
        } else if (value > 1024) {
            return (value / 1024).toFixed(2) + "KB";
        } else {
            return value + "B";
        }
    };

    return (
        <Box sx={{ flex: 1 }}>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h5" sx={{ fontSize: 14, mb: 1 }}>
                    {type === "upload"
                        ? t("main:files.uploading")
                        : t("main:files.downloading")}
                </Typography>
                <Typography variant="h5" sx={{ fontSize: 14, mb: 1 }}>
                    {calculateValue(data.value)}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ flex: 1, alignSelf: "center" }}>
                    <LinearProgress
                        color={type === "upload" ? "warning" : "info"}
                        value={data.percent}
                        variant={
                            data.percent > 100 ? "indeterminate" : "determinate"
                        }
                        sx={{
                            [`& .${linearProgressClasses.bar}`]: {
                                borderRadius: 5,
                            },
                            height: 10,
                            alignSelf: "center",
                        }}
                    />
                </Box>
                <Tooltip title={t("main:cancel")}>
                    <IconButton
                        onClick={() => handleCancelTransfer(type)}
                        size="small"
                        sx={{ alignSelf: "center", p: 0 }}
                    >
                        <Icon icon="ph:x" style={{ color: "white" }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}
