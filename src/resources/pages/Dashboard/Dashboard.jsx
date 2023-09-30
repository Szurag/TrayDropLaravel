import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generatePath } from "react-router-dom";
import Mobile from "./Mobile";
import { caesarShift, hex2a } from "../../components/Tools/caesarShift";
import Profile from "./Shared/Shared.jsx";
import Files from "./Files/Files.jsx";
import Clipboard from "./Clipboard/Clipboard.jsx";
import { useMediaQuery, useTheme, Box } from "@mui/material";
import Pusher from "pusher-js";
import favicon_active from "../../../public/favicon-active.ico";
import favicon_normal from "../../../public/favicon.ico";
import notification from "../../assets/sound/notification.mp3";
import { Howl } from "howler";

export default function Dashboard() {
    const [passwd, setPasswd] = useState("");
    const theme = useTheme();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("xl"));
    const [updateData, setUpdateData] = useState({});
    const [reRenderShared, setReRenderShared] = useState(false);

    const notificationSound = new Howl({
        src: [notification],
    });

    const changeFavicon = (active) => {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.getElementsByTagName("head")[0].appendChild(link);
        }

        let favicon;

        if (active) {
            favicon = favicon_active;
            notificationSound.play();
        } else {
            favicon = favicon_normal;
        }

        link.href = favicon;
    };

    const triggerReRenderShared = () => {
        setReRenderShared(!reRenderShared);
    };

    useEffect(() => {
        if (!localStorage.getItem("hostname")?.length > 0) {
            navigate(generatePath("/setup"));
            return;
        }

        if (!localStorage.getItem("P_APP_KEY")) {
            localStorage.clear();
            window.location.reload();
            return;
        }

        if (!localStorage.getItem("token")?.length > 0) {
            navigate(generatePath("/login"));
            return;
        }

        setPasswd(
            btoa(
                caesarShift(
                    atob(
                        caesarShift(
                            hex2a(
                                caesarShift(
                                    localStorage.getItem("_gqwexvcfq"),
                                    -3,
                                ),
                            ),
                            -13,
                        ),
                    ),
                    -7,
                ),
            ),
        );

        const pusher = new Pusher(localStorage.getItem("P_APP_KEY"), {
            channelAuthorization: {
                endpoint: `${localStorage.getItem(
                    "hostname",
                )}/broadcasting/auth`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
            cluster: localStorage.getItem("P_CLUSTER"),
        });

        let channel = pusher.subscribe(
            `private-updates.${localStorage.getItem("user_id")}`,
        );

        channel.bind("files.clipboard.updated", function (data) {
            if (data.type !== "deleted" && data.type !== "destroyed") {
                changeFavicon(true);
                setTimeout(() => {
                    changeFavicon(false);
                }, 3000);
            }
            setUpdateData(data);
        });
    }, []);

    return (
        <>
            {!!isSmallScreen ? (
                !!passwd && (
                    <Mobile
                        passwd={passwd}
                        updateData={updateData}
                        triggerReRenderShared={triggerReRenderShared}
                        reRenderShared={reRenderShared}
                    />
                )
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        py: 7,
                        px: 12,
                        height: "100vh",
                    }}
                >
                    {!!passwd && (
                        <>
                            <Profile
                                updateData={updateData}
                                reRenderShared={reRenderShared}
                            />
                            <Clipboard
                                passwd={passwd}
                                updateData={updateData}
                            />
                            <Files
                                passwd={passwd}
                                updateData={updateData}
                                triggerReRenderShared={triggerReRenderShared}
                            />
                        </>
                    )}
                </Box>
            )}
        </>
    );
}
