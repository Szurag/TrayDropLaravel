import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function Circle({ value, invertColor, label, unit, sx }) {
    const colors = {
        green: "#01ff77",
        yellow: "#ebd04d",
        red: "#eb5d4d",
    };

    const [body, setBody] = useState([]);

    useEffect(() => {
        let color;

        if (invertColor) {
            if (value > 45) {
                color = colors.green;
            } else if (value > 20) {
                color = colors.yellow;
            } else {
                color = colors.red;
            }
        } else {
            if (value > 85) {
                color = colors.red;
            } else if (value > 70) {
                color = colors.yellow;
            } else {
                color = colors.green;
            }
        }

        setBody(renderBody(color));
    }, [value]);

    const renderBody = (color) => {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    ...sx,
                }}
            >
                <Box sx={{ width: "100%", position: "relative" }}>
                    <CircularProgress
                        variant="determinate"
                        value={100}
                        thickness={6}
                        size={85}
                        sx={{ color: "rgba(150, 150, 150, 0.2)" }}
                    />
                    <CircularProgress
                        variant="determinate"
                        value={value}
                        thickness={6}
                        size={85}
                        sx={{ position: "absolute", left: 0, color: color }}
                    />
                    <Box
                        sx={{
                            top: -3,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            variant="caption"
                            component="div"
                            color="text.secondary"
                            sx={{ fontSize: 16, fontWeight: "bold" }}
                        >
                            {`${Math.round(value)}${unit}`}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ width: "100%" }}>
                    <Typography sx={{ fontSize: 16 }}>{label}</Typography>
                </Box>
            </Box>
        );
    };

    return body;
}
