import { Button, Dialog, DialogContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import { Trans, useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";

export default function ShareModal({
    open,
    data,
    handleClose,
    isLoading,
    onConfirm,
}) {
    const { i18n, t } = useTranslation();
    const [expirationDate, setExpirationDate] = useState("");

    const shortContent = (content) => {
        if (content?.length > 25) {
            return content.substring(0, 25) + "...";
        }

        return content;
    };

    useEffect(() => {
        setExpirationDate("");
    }, [open]);

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
                    <Trans
                        i18nKey={`main:files.share.share`}
                        values={{
                            content: shortContent(data.fileName),
                        }}
                    />
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label={t("main:files.share.date")}
                            sx={{ width: "100%" }}
                            value={expirationDate}
                            onChange={(event) => setExpirationDate(event.$d)}
                        />
                    </LocalizationProvider>
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
                        startIcon={<Icon icon="ph:share" />}
                        onClick={() =>
                            onConfirm({
                                ...data,
                                expirationDate: expirationDate,
                            })
                        }
                    >
                        {t("main:share")}
                    </LoadingButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
