import { Button, Dialog, DialogContent, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import { Trans, useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function HostnameModal({
    open,
    data,
    handleClose,
    isLoading,
    onConfirm,
}) {
    const [t] = useTranslation();
    const [hostname, setHostname] = useState(
        localStorage.getItem("hostname-alt"),
    );

    return (
        <Dialog
            open={open}
            maxWidth={"sm"}
            fullWidth
            PaperProps={{
                style: {
                    background: "none",
                    backdropFilter: "blur(8px)",
                    boxShadow: "none",
                    backgroundColor: "#22222290",
                    borderRadius: "12px",
                },
            }}
        >
            <DialogContent sx={{ p: 4 }}>
                <Typography variant={"h6"} component={"h2"}>
                    <Trans i18nKey={`main:settings.hostname_alt_setup`} />
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                            {t("main:main_server")}:
                        </Typography>
                        {localStorage.getItem("hostname-main")}
                    </Typography>
                    <Typography sx={{ mt: 2, mb: 4 }}>
                        <Typography sx={{ fontWeight: "bold" }}>
                            {t("main:alt_server")}:
                        </Typography>
                        {localStorage.getItem("hostname-alt")}
                    </Typography>
                    <TextField
                        label={t("main:settings.hostname_alt")}
                        sx={{ width: "100%" }}
                        variant="outlined"
                        value={hostname}
                        onChange={(event) => setHostname(event.target.value)}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                        mt: 4,
                        gap: 1,
                    }}
                >
                    <Button
                        type={"button"}
                        color={"light"}
                        variant={"outlined"}
                        startIcon={<Icon icon="ph:minus-circle" />}
                        onClick={handleClose}
                    >
                        {t("main:cancel")}
                    </Button>
                    <LoadingButton
                        type="submit"
                        color="success"
                        variant="contained"
                        loading={isLoading}
                        startIcon={<Icon icon="ph:check-circle" />}
                        onClick={() =>
                            onConfirm({ ...data, hostname: hostname })
                        }
                    >
                        {t("main:save")}
                    </LoadingButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
