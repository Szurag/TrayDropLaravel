import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

export default function TileHeader({
    title,
    icon,
    handleOpen,
    sx,
    action,
    ...props
}) {
    const [t] = useTranslation();

    return (
        <Box
            sx={{ display: "flex", justifyContent: "space-between" }}
            {...props}
        >
            <Typography
                variant="h5"
                sx={{ fontSize: 24, fontWeight: "500", mt: 0.2, ml: 1, ...sx }}
            >
                {title}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Tooltip title={action?.title}>
                    {!!action?.file ? (
                        <IconButton {...action?.getRootProps()} size="small">
                            <Icon
                                icon={action?.icon}
                                fontSize={26}
                                cursor={"pointer"}
                            />
                            <input {...action?.getInputProps()} />
                        </IconButton>
                    ) : (
                        <IconButton onClick={action?.action} size="small">
                            <Icon
                                icon={action?.icon}
                                fontSize={26}
                                cursor={"pointer"}
                            />
                        </IconButton>
                    )}
                </Tooltip>
                <Tooltip title={t("main:menu")}>
                    <IconButton onClick={handleOpen} size="small">
                        <Icon icon={icon} fontSize={30} cursor={"pointer"} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}
