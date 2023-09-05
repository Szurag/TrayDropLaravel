import { Box } from "@mui/material";
import Instance from "./Instance";
import { useEffect, useState } from "react";

export default function FilesProgress({
    upload,
    download,
    handleCancelTransfer,
}) {
    const [bottomParam, setBottomParam] = useState("-50%");

    useEffect(() => {
        setBottomParam(!!upload.value || !!download.value ? 0 : "-50%");
    }, [upload, download]);

    return (
        <Box
            sx={{
                width: "100%",
                flex: 1,
                position: "fixed",
                bottom: bottomParam,
                transition: "1.5s bottom",
                left: 0,
                display: "flex",
                flexWrap: "wrap",
                px: 3,
                py: 3,
                gap: 3,
                background: "rgba(15,15,25, 0.8)",
            }}
        >
            {!!upload.value && (
                <Instance
                    type="upload"
                    data={upload}
                    handleCancelTransfer={handleCancelTransfer}
                />
            )}
            {!!upload.value && !!download.value && (
                <Box sx={{ borderRight: "1px solid #eee", height: 40 }} />
            )}
            {!!download.value && (
                <Instance
                    type="download"
                    data={download}
                    handleCancelTransfer={handleCancelTransfer}
                />
            )}
        </Box>
    );
}
