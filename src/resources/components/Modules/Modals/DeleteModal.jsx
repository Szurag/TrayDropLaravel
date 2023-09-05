import { Button, Dialog, DialogContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import { Trans, useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export default function DeleteModal({
    open,
    data,
    handleClose,
    isLoading,
    onConfirm,
}) {
    const [t] = useTranslation();

    const shortContent = (content) => {
        if (content?.length > 25) {
            return content.substring(0, 25) + "...";
        }

        return content;
    };

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
                    {t(`main:${data.type}.remove`)}
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{ wordBreak: "break-word", wordWrap: "balance" }}
                    >
                        <Trans
                            i18nKey={
                                data.num === "all"
                                    ? `main:all.${data.type}.remove_confirmation`
                                    : `main:${data.type}.remove_confirmation`
                            }
                            values={{
                                content: shortContent(
                                    data.type === "clipboard"
                                        ? data.content
                                        : data.fileName,
                                ),
                            }}
                        />
                    </Typography>
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
                        color="error"
                        variant="contained"
                        loading={isLoading}
                        startIcon={<Icon icon="ph:x-circle" />}
                        onClick={() => onConfirm(data)}
                    >
                        {t("main:remove")}
                    </LoadingButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
