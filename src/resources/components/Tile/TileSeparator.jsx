import { Box } from "@mui/material";

export default function TileSeparator({ sx, ...props }) {
    return (
        <Box
            sx={{
                width: "100%",
                borderBottom: "1px solid rgba(255, 255, 255,0.6)",
                my: 1,
                ...sx,
            }}
            {...props}
        />
    );
}
