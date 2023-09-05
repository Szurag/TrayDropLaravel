import Tile from "../../components/Tile/Tile";
import { Box, Typography, Button } from "@mui/material";
import icon from "../../img/icon.png";
import { generatePath, useNavigate } from "react-router-dom";

export default function E404() {
    const navigate = useNavigate();

    return (
        <Tile
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                p: 10,
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
                        width: "50%",
                        textAlign: "center",
                    }}
                />
            </Box>
            <Typography
                sx={{
                    fontSize: 50,
                    textAlign: "center",
                    mt: 5,
                }}
            >
                404 Not Found
            </Typography>
            <Button
                variant="outlined"
                sx={{ flex: 1 }}
                color="light"
                onClick={() => navigate(generatePath("/"))}
            >
                Back to dashboard
            </Button>
        </Tile>
    );
}
