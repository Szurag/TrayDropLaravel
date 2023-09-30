import { Box, Skeleton } from "@mui/material";

export default function Loading() {
    return (
        <Box>
            <Box sx={{ display: "flex", mx: 0.75, mb: 0.5 }}>
                <Skeleton sx={{ width: "22.5%", height: "100px" }} />
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
                    <Skeleton
                        sx={{
                            height: "24px",
                            width: "120px",
                            ml: "20px",
                            mt: "20px",
                        }}
                    />
                    <Skeleton
                        sx={{ height: "24px", width: "120px", ml: "20px" }}
                    />
                </Box>
            </Box>
            <Box>
                <Skeleton sx={{ height: "24px", width: "100%" }} />
            </Box>
            <Skeleton
                sx={{ height: "40px", width: "100%", borderRadius: "10px" }}
            />
        </Box>
    );
}
