import { Button, Dialog, DialogContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Trans, useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export default function InfoModal({ open, data, handleClose }) {
    const [t] = useTranslation();

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
                    <Trans i18nKey={data.i18nKey} />
                </Typography>
                <Box sx={{ mt: 4 }}>{data.content}</Box>
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
                </Box>
            </DialogContent>
        </Dialog>
    );
}
