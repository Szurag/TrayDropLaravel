import { useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import Files from "./Files";
import Clipboard from "./Clipboard";
import Profile from "./Profile";

export default function Mobile({
    passwd,
    updateData,
    triggerReRenderShared,
    reRenderShared,
}) {
    const [t] = useTranslation();
    const [value, setValue] = useState(0);
    const [body, setBody] = useState([]);

    useEffect(() => {
        switch (value) {
            case 0:
                setBody(
                    <Files
                        passwd={passwd}
                        updateData={updateData}
                        triggerReRenderShared={triggerReRenderShared}
                    />,
                );
                break;

            case 1:
                setBody(<Clipboard passwd={passwd} updateData={updateData} />);
                break;

            case 2:
                setBody(
                    <Profile
                        updateData={updateData}
                        reRenderShared={reRenderShared}
                    />,
                );
                break;

            default: {
                setBody(
                    <Files
                        passwd={passwd}
                        updateData={updateData}
                        triggerReRenderShared={triggerReRenderShared}
                    />,
                );
            }
        }
    }, [value, updateData]);

    return (
        <>
            <Box sx={{ p: 3, height: "90vh" }}>{body}</Box>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    bgcolor: "rgba(160,215,255, 0.11)",
                    backdropFilter: "blur(8px)",
                }}
            >
                <BottomNavigationAction
                    label={t("main:files.main")}
                    icon={
                        <Icon
                            icon="mdi:file-outline"
                            style={{ fontSize: 20, marginBottom: "5px" }}
                            className="Mui-selected"
                        />
                    }
                    sx={{ ".Mui-selected": { color: "#fff" } }}
                />
                <BottomNavigationAction
                    label={t("main:clipboard.main")}
                    icon={
                        <Icon
                            icon="mdi:clipboard-outline"
                            style={{ fontSize: 20, marginBottom: "5px" }}
                            className="Mui-selected"
                        />
                    }
                    sx={{ ".Mui-selected": { color: "#fff" } }}
                />
                <BottomNavigationAction
                    label={t("main:profile.main")}
                    icon={
                        <Icon
                            icon="mdi:cog-outline"
                            style={{ fontSize: 20, marginBottom: "5px" }}
                            className="Mui-selected"
                        />
                    }
                    sx={{ ".Mui-selected": { color: "#fff" } }}
                />
            </BottomNavigation>
        </>
    );
}
