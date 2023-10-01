import { useEffect, useState } from "react";
import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

export default function EditableField({ id, value, onConfirm }) {
    const [t] = useTranslation();
    const [currentValue, setCurrentValue] = useState(value);
    const [resultValue, setResultValue] = useState(value);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setCurrentValue(value);
        setResultValue(value);
    }, [value]);

    const handleAbortEdit = () => {
        setIsEditing(false);
        setCurrentValue(resultValue);
    };

    const handleConfirmEdit = () => {
        setIsEditing(false);

        if (currentValue !== resultValue) {
            onConfirm(id, currentValue);
        }

        setResultValue(currentValue);
    };

    return (
        <Box>
            {isEditing ? (
                <>
                    <TextField
                        multiline
                        rows={3}
                        value={currentValue}
                        onChange={(event) =>
                            setCurrentValue(event.target.value)
                        }
                        size="small"
                        sx={{ width: "110%", borderRadius: "10px" }}
                    />
                    <Tooltip sx={{ mt: 1 }} title={t("main:save")}>
                        <IconButton size="small" onClick={handleConfirmEdit}>
                            <Icon icon={"ph:check"} style={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip sx={{ mt: 1 }} title={t("main:cancel")}>
                        <IconButton size="small" onClick={handleAbortEdit}>
                            <Icon icon={"ph:x"} style={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip>
                </>
            ) : (
                <Typography
                    variant="h5"
                    sx={{
                        fontSize: "18px",
                        textWrap: "wrap",
                        wordBreak: "break-all",
                    }}
                >
                    {resultValue}
                    <Tooltip title={t("main:edit")}>
                        <IconButton
                            size="small"
                            onClick={() => setIsEditing(true)}
                        >
                            <Icon
                                icon={"mdi:pencil-outline"}
                                style={{ fontSize: 20 }}
                            />
                        </IconButton>
                    </Tooltip>
                </Typography>
            )}
        </Box>
    );
}
