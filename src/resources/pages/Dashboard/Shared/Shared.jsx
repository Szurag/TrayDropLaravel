import { Box } from "@mui/material";
import Tile from "../../../components/Tile/Tile.jsx";
import TileHeader from "../../../components/Tile/TileHeader.jsx";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Menu from "../../../components/Menu";
import HostnameModal from "./Modal/HostnameModal";
import { useSnackbar } from "notistack";
import disk from "../../../assets/img/disk.png";
import Bar from "./DiskSpace/DiskSpace.jsx";
import axios from "axios";
import Loading from "./DiskSpace/Loading";
import ShareList from "./ShareList.jsx";

export default function Shared({ updateData, reRenderShared }) {
    const { i18n, t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [isHostnameModalOpen, setIsHostnameModalOpen] = useState(false);
    const [dataRow, setDataRow] = useState({});
    const { enqueueSnackbar } = useSnackbar();
    const [diskSpace, setDiskSpace] = useState({});
    const [diskLoading, setDiskLoading] = useState(true);

    const handleOpenHostnameModal = (row) => {
        handleCloseMenu();
        setDataRow(row);
        setIsHostnameModalOpen(true);
    };

    const handleConfirmHostnameModal = (data) => {
        setIsHostnameModalOpen(false);
        handleSnackbarOpen("success", t("main:settings.hostname_alt_success"));
        localStorage.setItem("hostname-alt", data.hostname);
    };

    const handleLogout = () => {
        localStorage.setItem("token", "");
        localStorage.setItem("_gqwexvcfq", "");
        window.location.reload();
    };

    const handleOpenMenu = (event) => {
        setMenuAnchorEl(event.currentTarget);
        setIsMenuOpen(true);
    };

    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
        setIsMenuOpen(false);
    };

    const handleSnackbarOpen = (color = "success", content = ".") => {
        enqueueSnackbar(content, {
            variant: color,
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
            },
        });
    };

    useEffect(() => {
        setDiskLoading(true);

        axios
            .get(`${localStorage.getItem("hostname")}/api/disk`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                setDiskSpace(response.data);
                setDiskLoading(false);
            })
            .catch((error) => {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    localStorage.setItem("token", "");
                    localStorage.setItem("_gqwexvcfq", "");
                    window.location.reload();
                }

                handleSnackbarOpen("error", `Error: ${error}`);
            });
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flex: 1.3,
                height: "100%",
                position: "relative",
            }}
        >
            <HostnameModal
                open={isHostnameModalOpen}
                data={dataRow}
                handleClose={() => setIsHostnameModalOpen(false)}
                onConfirm={handleConfirmHostnameModal}
                isLoading={false}
            />
            <Tile
                sx={{
                    flex: 1,
                    pb: 2,
                    position: "relative",
                    overflowY: "auto",
                    overflowX: "hidden",
                }}
            >
                <TileHeader
                    title={t("main:profile.main")}
                    icon="pepicons-pencil:dots-y"
                    handleOpen={handleOpenMenu}
                    action={{
                        title: t("main:logout"),
                        action: handleLogout,
                        icon: "material-symbols:logout",
                    }}
                />
                <Menu
                    isOpen={isMenuOpen}
                    handleClose={handleCloseMenu}
                    anchorEl={menuAnchorEl}
                    options={[
                        {
                            action: () => {
                                i18n.changeLanguage(
                                    i18n.language === "pl" ? "en" : "pl",
                                );
                                localStorage.setItem("locale", i18n.language);
                            },
                            label: t("main:change_language"),
                        },
                        {
                            action: handleOpenHostnameModal,
                            label: t("main:settings.hostname_alt_setup"),
                        },
                    ]}
                    type="settings"
                />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: 2,
                        height: "93%",
                    }}
                >
                    <ShareList
                        updateData={updateData}
                        reRenderShared={reRenderShared}
                        sx={{ overflowY: "auto" }}
                    />
                    {!diskLoading ? (
                        <Bar
                            isLoading={!diskSpace?.total}
                            barValue={
                                (diskSpace?.used_space_gb /
                                    diskSpace?.total_space_gb) *
                                100
                            }
                            icon={disk}
                            label={t("main:server_disk")}
                            value={diskSpace?.used_space_gb + "GB"}
                            description={
                                diskSpace?.free_space_gb +
                                "GB " +
                                t("main:available_of") +
                                " " +
                                diskSpace?.total_space_gb +
                                "GB"
                            }
                            sx={{ my: 2 }}
                        />
                    ) : (
                        <Loading />
                    )}
                </Box>
            </Tile>
        </Box>
    );
}
