import { useEffect } from "react";
import {
    clipboardList,
    clipboardCreate,
    clipboardDelete,
    clipboardDeleteAll,
    clipboardUpdate,
} from "../../../api/ClipboardApi.js";
import Card from "../../../components/Card";
import Menu from "../../../components/Menu";
import DeleteModal from "../../../components/Modals/DeleteModal";
import Tile from "../../../components/Tile/Tile.jsx";
import TileHeader from "../../../components/Tile/TileHeader.jsx";
import { Trans, useTranslation } from "react-i18next";
import { Box, Typography, Skeleton, Pagination } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function Clipboard({ passwd, updateData }) {
    const { i18n, t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteModalLoading, setIsDeleteModalLoading] = useState(false);
    const [dataRow, setDataRow] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [isClipboardsLoading, setIsClipboardsLoading] = useState(true);
    const [clipboardStatus, setClipboardStatus] = useState([]);
    const [clipboards, setClipboards] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(0);

    useEffect(() => {
        window.removeEventListener("keydown", () => {});

        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "v") {
                handleClipboardSend();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
    }, []);

    const handleSnackbarOpen = (color = "success", content = ".") => {
        enqueueSnackbar(content, {
            variant: color,
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
            },
        });
    };

    const handleOpenDeleteModal = (row) => {
        setDataRow(row);
        setIsDeleteModalOpen(true);
    };

    const handleClipboardCopy = (content, itemIndex) => {
        navigator.clipboard.writeText(content).then(() => {
            setClipboardStatus((item) => {
                const newData = [...item];
                newData[itemIndex] = "completed";
                return newData;
            });

            setTimeout(() => {
                setClipboardStatus((item) => {
                    const newData = [...item];
                    newData[itemIndex] = "normal";
                    return newData;
                });
            }, 1000);
        });
    };

    const handleClipboardList = () => {
        clipboardList(
            {
                password: passwd,
                per_page: 25,
                order_by: "desc",
                page: page || 1,
            },
            (response, error) => {
                if (error) {
                    handleSnackbarOpen("error", `${error}`);
                    setPage(0);
                    setTotal(0);
                    setLastPage(0);
                    return;
                }

                if (response) {
                    setPage(response.data.current_page);
                    setTotal(response.data.total);
                    setLastPage(response.data.last_page);
                    setClipboards(response.data.data);
                    setIsClipboardsLoading(false);
                }
            },
        );
    };
    const clipboardCheckIfProcessable = (content) => {
        for (let i = 0; i < content.length; i++) {
            if (content[i] !== " ") {
                return true;
            }
        }
        return false;
    };

    const handleClipboardSend = () => {
        navigator.clipboard.read().then((clipboardContent) => {
            for (const item of clipboardContent) {
                for (const type of item.types) {
                    if (type.startsWith("text")) {
                        navigator.clipboard
                            .readText()
                            .then((clipboardContent) => {
                                if (
                                    !clipboardCheckIfProcessable(
                                        clipboardContent,
                                    )
                                ) {
                                    handleSnackbarOpen(
                                        "error",
                                        t("main:clipboard.empty"),
                                    );
                                    return;
                                }

                                clipboardCreate(
                                    {
                                        content: clipboardContent,
                                        device_type: "web",
                                        password: passwd,
                                    },
                                    (response, error) => {
                                        if (error) {
                                            handleSnackbarOpen(
                                                "error",
                                                `${error}`,
                                            );
                                            return;
                                        }

                                        if (response) {
                                            handleSnackbarOpen(
                                                "success",
                                                t("main:clipboard.sent"),
                                            );
                                        }
                                    },
                                );
                            });

                        break;
                    }
                }
            }
        });
        handleCloseMenu();
    };

    const handleClipboardRemove = () => {
        setIsDeleteModalLoading(true);
        clipboardDelete(dataRow, (response, error) => {
            setIsDeleteModalOpen(false);
            setIsDeleteModalLoading(false);

            if (error) {
                handleSnackbarOpen("error", `${error}`);
                return;
            }

            if (response) {
                handleSnackbarOpen("success", t("main:clipboard.deleted"));
            }
        });
    };

    const handleConfirmDeleteModal = (row) => {
        if (row.num === "all") {
            handleClipboardRemoveAll();

            setIsDeleteModalOpen(false);
        } else {
            handleClipboardRemove();
        }
    };

    const handleOpenMenu = (event) => {
        setMenuAnchorEl(event.currentTarget);
        setIsMenuOpen(true);
    };

    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
        setIsMenuOpen(false);
    };

    const handleClipboardRemoveAll = () => {
        clipboardDeleteAll((response, error) => {
            if (error) {
                handleSnackbarOpen("error", `${error}`);
                return;
            }

            if (response) {
                handleSnackbarOpen("success", t("main:clipboard.deleted"));
            }
        });
        handleCloseMenu();
    };

    const handleClipboardEdit = (id, value) => {
        clipboardUpdate({ id, value }, (response, error) => {
            if (error) {
                handleSnackbarOpen("error", `${error}`);
                return;
            }

            if (response) {
                handleSnackbarOpen("success", t("main:clipboard.updated"));
            }
        });
    };

    useEffect(() => {
        if (passwd?.length > 0) {
            handleClipboardList();
        }
    }, [passwd]);

    useEffect(() => {
        setClipboardStatus(
            clipboards?.length > 0 &&
                clipboards.map((item, itemIndex) => {
                    if (clipboardStatus[itemIndex] !== "normal") {
                        return clipboardStatus[itemIndex];
                    } else {
                        return "normal";
                    }
                }),
        );
    }, [clipboards]);

    useEffect(() => {
        if (updateData.message === "clipboard") {
            handleClipboardList();
        }
    }, [updateData]);

    useEffect(() => {
        setIsClipboardsLoading(true);
        handleClipboardList();
    }, [page]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flex: 2,
                height: "100%",
                position: "relative",
            }}
        >
            <DeleteModal
                open={isDeleteModalOpen}
                data={dataRow}
                handleClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDeleteModal}
                isLoading={isDeleteModalLoading}
            />
            <Tile
                sx={{
                    flex: 1,
                    pb: 2,
                    position: "relative",
                    overflowY: "hidden",
                    overflowX: "hidden",
                }}
            >
                <TileHeader
                    title={t("main:clipboard.main")}
                    icon="pepicons-pencil:dots-y"
                    handleOpen={handleOpenMenu}
                    action={{
                        title: t("main:paste"),
                        action: handleClipboardSend,
                        icon: "mdi:content-paste",
                    }}
                />
                <Menu
                    isOpen={isMenuOpen}
                    handleClose={handleCloseMenu}
                    anchorEl={menuAnchorEl}
                    options={[
                        {
                            action: () =>
                                handleOpenDeleteModal({
                                    num: "all",
                                    type: "clipboard",
                                }),
                            label: t("main:remove_all"),
                            sx: { color: "red" },
                        },
                    ]}
                    type="clipboard"
                />
                {!!isClipboardsLoading ? (
                    <Box sx={{ px: 1 }}>
                        <Skeleton
                            sx={{
                                width: "100%",
                                height: "80px",
                                borderRadius: 6,
                            }}
                        />
                        <Skeleton
                            sx={{
                                width: "100%",
                                height: "80px",
                                borderRadius: 6,
                            }}
                        />
                        <Skeleton
                            sx={{
                                width: "100%",
                                height: "80px",
                                borderRadius: 6,
                            }}
                        />
                    </Box>
                ) : (
                    <Box sx={{ px: 1, flex: 1, overflowY: "auto" }}>
                        {clipboards?.length > 0 ? (
                            clipboards.map((item, itemIndex) => (
                                <Card
                                    key={itemIndex}
                                    type="clipboard"
                                    sx={{ mb: 2, overflowY: "auto" }}
                                    icon={
                                        <Icon
                                            icon="ph:clipboard"
                                            style={{ fontSize: "22px" }}
                                        />
                                    }
                                    onConfirm={handleClipboardCopy}
                                    buttonContent={clipboardStatus[itemIndex]}
                                    data={{
                                        id: item.id,
                                        index: itemIndex,
                                        content: item.content,
                                        copyContent: item.content,
                                        date: new Date(item.created_at)
                                            .toLocaleString(i18n.language, {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: false,
                                            })
                                            .replace(",", ""),
                                    }}
                                    handleOpenDeleteModal={() =>
                                        handleOpenDeleteModal({
                                            id: item.id,
                                            content: item.content,
                                            type: "clipboard",
                                        })
                                    }
                                    clipboardEditConfirm={handleClipboardEdit}
                                />
                            ))
                        ) : (
                            <Typography
                                variant="h6"
                                sx={{
                                    mx: 10,
                                    mt: 4,
                                    fontSize: 16,
                                    textAlign: "center",
                                }}
                            >
                                <Trans i18nKey={"main:clipboard.no_results"} />
                            </Typography>
                        )}
                        {total > 26 && (
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Pagination
                                    count={lastPage}
                                    color="primary"
                                    sx={{ alignSelf: "center" }}
                                    page={page}
                                    onChange={(event, page) => {
                                        setPage(page);
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                )}
            </Tile>
        </Box>
    );
}
