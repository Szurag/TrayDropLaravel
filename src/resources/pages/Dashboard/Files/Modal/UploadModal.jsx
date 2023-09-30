import { Button, Dialog, DialogContent, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import { Trans, useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";

export default function UploadModal({
    open,
    data,
    handleClose,
    isLoading,
    onConfirm,
}) {
    const [t] = useTranslation();
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        setFileName("");
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
                    {t("main:files.clipboard_upload")}
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label={t("main:files.filename")}
                        sx={{ width: "100%" }}
                        variant="outlined"
                        value={fileName}
                        onChange={(event) => setFileName(event.target.value)}
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
                        startIcon={<Icon icon="ph:share" />}
                        onClick={() =>
                            onConfirm(fileName, data.blob, data.type)
                        }
                    >
                        {t("main:share")}
                    </LoadingButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
