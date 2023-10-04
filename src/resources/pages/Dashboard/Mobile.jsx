import { useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import Files from "./Files/Files.jsx";
import Clipboard from "./Clipboard/Clipboard.jsx";
import Profile from "./Shared/Shared.jsx";
import pairdrop from "../../assets/img/pairdrop.png";
import PairdropMobile from "./Pairdrop/PairdropMobile.jsx";

export default function Mobile({
    passwd,
    updateData,
    triggerReRenderShared,
    reRenderShared,
}) {
    const [t] = useTranslation();
    const [value, setValue] = useState(0);
    const [body, setBody] = useState([]);
    const [pairdropDisplay, setPairdropDisplay] = useState(false);

    useEffect(() => {
        switch (value) {
            case 0:
                setPairdropDisplay(false);
                setBody(
                    <Files
                        passwd={passwd}
                        updateData={updateData}
                        triggerReRenderShared={triggerReRenderShared}
                    />,
                );
                break;

            case 1:
                setPairdropDisplay(false);
                setBody(<Clipboard passwd={passwd} updateData={updateData} />);
                break;

            case 2:
                setPairdropDisplay(false);
                setBody(
                    <Profile
                        updateData={updateData}
                        reRenderShared={reRenderShared}
                    />,
                );
                break;

            case 3:
                setPairdropDisplay(true);
                setBody(<></>);
                break;

            default: {
                setPairdropDisplay(false);
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
            <Box sx={{ p: 3, height: "100vh", pb: 10 }}>
                {body}
                <PairdropMobile
                    sx={{ display: pairdropDisplay ? "block" : "none" }}
                />
            </Box>
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
                    bgcolor: "rgba(20,35,60,0.51)",
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
                <BottomNavigationAction
                    label={"Pairdrop"}
                    icon={
                        <img
                            src={pairdrop}
                            height={20}
                            style={{
                                marginBottom: "5px",
                                filter: "grayscale(100%) brightness(300%)",
                            }}
                            className="Mui-selected"
                        />
                    }
                    sx={{ ".Mui-selected": { color: "#fff" } }}
                />
            </BottomNavigation>
        </>
    );
}
