import { useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export default function CollapseContent({ content, maxLength = 80 }) {
    const [t] = useTranslation();
    const [currentContent, setCurrentContent] = useState(
        content.substring(0, maxLength),
    );
    const [collapseState, setCollapseState] = useState(true);

    useEffect(() => {
        setCurrentContent(content.substring(0, maxLength));
        setCollapseState(true);
    }, [content]);

    const handleToggle = () => {
        setCurrentContent(
            collapseState ? content : content.substring(0, maxLength),
        );
        setCollapseState(!collapseState);
    };

    return (
        <>
            {currentContent}
            {content.length > maxLength && (
                <Tooltip
                    title={
                        collapseState ? t("main:extend") : t("main:collapse")
                    }
                >
                    <IconButton onClick={handleToggle} size="small">
                        <Icon
                            icon={
                                collapseState
                                    ? "iconamoon:arrow-right-2"
                                    : "iconamoon:arrow-left-2"
                            }
                        />
                    </IconButton>
                </Tooltip>
            )}
        </>
    );
}
