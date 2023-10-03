import { Icon } from "@iconify/react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import EditableField from "./EditableField.jsx";
import CollapseContent from "./CollapseContent.jsx";

export default function Card({
    type,
    icon,
    data,
    handleOpenDeleteModal,
    buttonContent,
    onConfirm,
    optionalButtons,
    sx,
    clipboardEditConfirm,
}) {
    const [t] = useTranslation();

    return (
        <Box
            sx={{
                width: "100%",
                p: 2,
                borderRadius: 4,
                border: "1px solid #eeeeee40",
                display: "flex",
                gap: 1,
                flexDirection: "column",
                justifyContent: "space-between",
                ...sx,
            }}
        >
            <Box sx={{ display: "flex", gap: 1 }}>
                <Box>{icon}</Box>
                {type === "clipboard" ? (
                    <EditableField
                        id={data.id}
                        value={data.content}
                        onConfirm={clipboardEditConfirm}
                    />
                ) : (
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: "18px",
                            textWrap: "wrap",
                            wordBreak: "break-all",
                        }}
                    >
                        <CollapseContent content={data.content} />
                    </Typography>
                )}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "start",
                    flex: 1,
                    mt: 2,
                }}
            >
                <Typography
                    variant="span"
                    sx={{
                        textWrap: "wrap",
                        wordBreak: "break-all",
                        color: "#aaa",
                        fontSize: 14,
                    }}
                >
                    {data.date}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        justifyContent: "end",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "end",
                        flex: 1,
                        mt: 3,
                    }}
                >
                    {type === "clipboard" &&
                        data.content.match(
                            `(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})`,
                        ) && (
                            <Button
                                color={"light"}
                                variant={"outlined"}
                                startIcon={<Icon icon="ion:open-outline" />}
                                onClick={() =>
                                    window.open(
                                        data.content.includes("://")
                                            ? data.content
                                            : "http://" + data.content,
                                        "_blank",
                                    )
                                }
                                sx={{ width: { xs: "100%", sm: "auto" } }}
                            >
                                {t("main:open_url")}
                            </Button>
                        )}
                    {optionalButtons?.length > 0 &&
                        optionalButtons.map((item, itemIndex) => (
                            <Box
                                sx={{ width: { xs: "100%", sm: "auto" } }}
                                key={itemIndex}
                            >
                                <Button
                                    color={item.color || "light"}
                                    variant={item.variant || "outlined"}
                                    startIcon={item.startIcon}
                                    onClick={item.action}
                                    sx={{ width: { xs: "100%", sm: "auto" } }}
                                >
                                    {item.label}
                                </Button>
                            </Box>
                        ))}
                    <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                        {type === "clipboard" ? (
                            <Button
                                color="light"
                                variant="outlined"
                                startIcon={<Icon icon={"ph:clipboard"} />}
                                onClick={() =>
                                    onConfirm(data.copyContent, data.index)
                                }
                                sx={{ width: { xs: "100%", sm: "auto" } }}
                            >
                                {buttonContent === "completed"
                                    ? t("main:copied")
                                    : t("main:copy")}
                            </Button>
                        ) : (
                            <Button
                                color="light"
                                variant="outlined"
                                startIcon={<Icon icon={"ph:download"} />}
                                onClick={() => onConfirm(data, data.index)}
                                sx={{ width: { xs: "100%", sm: "auto" } }}
                            >
                                {buttonContent === "downloaded"
                                    ? t("main:downloaded")
                                    : buttonContent === "downloading"
                                    ? t("main:downloading")
                                    : buttonContent === "queued"
                                    ? t("main:queued")
                                    : t("main:download")}
                            </Button>
                        )}
                    </Box>
                    <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                        <Button
                            color="error"
                            variant="contained"
                            startIcon={<Icon icon={"ph:minus-circle"} />}
                            onClick={() =>
                                handleOpenDeleteModal({ content: data.content })
                            }
                            sx={{ width: { xs: "100%", sm: "auto" } }}
                        >
                            {t("main:remove")}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
