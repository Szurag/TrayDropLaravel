import { closeSnackbar, useSnackbar } from "notistack";
import { IconButton, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

function SnackbarCloseButton({ snackbarKey }) {
    const [t] = useTranslation();
    const { closeSnackbar } = useSnackbar();

    return (
        <Tooltip title={t("main:close")}>
            <IconButton
                onClick={() => closeSnackbar(snackbarKey)}
                size="small"
                sx={{ position: "absolute", top: 10 }}
            >
                <Icon icon="ph:x" />
            </IconButton>
        </Tooltip>
    );
}

export default SnackbarCloseButton;
