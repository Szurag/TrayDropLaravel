import {
    LinearProgress,
    linearProgressClasses,
    Box,
    Typography,
    Skeleton,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Bar({ barValue, icon, label, value, description, sx }) {
    const [body, setBody] = useState([]);

    useEffect(() => {
        let color;
        if (barValue > 90) {
            color = "#f05c4f";
        } else if (barValue > 70) {
            color = "#c3b377";
        } else {
            color = "#349b73";
        }

        setBody(renderBar(color));
    }, [barValue]);

    const renderBar = (color) => {
        return (
            <Box sx={{ width: "100%", ...sx }}>
                <Box sx={{ display: "flex", mx: 0.75, mb: 0.5 }}>
                    <img src={icon} style={{ width: "22.5%" }} />
                    <Box
                        sx={{
                            ml: 1.5,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            justifyContent: "space-between",
                            height: "75%",
                        }}
                    >
                        <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                            {label}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }}>{value}</Typography>
                    </Box>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="caption"
                        sx={{ fontSize: 13.7, mx: 0.75 }}
                    >
                        {description}
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={barValue}
                    sx={{
                        height: 20,
                        borderRadius: 6,
                        mx: 0.5,
                        [`&.${linearProgressClasses.colorPrimary}`]: {
                            backgroundColor: "#aaa",
                        },
                        [`& .${linearProgressClasses.bar}`]: {
                            borderRadius: 5,
                            backgroundColor: color,
                        },
                    }}
                />
            </Box>
        );
    };

    return body;
}
