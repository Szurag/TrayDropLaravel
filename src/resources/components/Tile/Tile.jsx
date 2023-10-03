import { Box } from "@mui/material";

export default function Tile({ sx, children, ...props }) {
    return (
        <Box
            sx={{
                backgroundColor: "rgba(20,35,60,0.51)",
                borderRadius: "9px",
                py: 1.8,
                px: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                backdropFilter: "blur(8px)",
                ...sx,
            }}
            {...props}
        >
            {children}
        </Box>
    );
}
