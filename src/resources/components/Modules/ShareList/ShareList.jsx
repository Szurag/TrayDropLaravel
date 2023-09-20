import { Box, Pagination, Skeleton, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { filesSharedDelete, filesSharedList } from "../../../api/FilesApi.js";
import Card from "../Card.jsx";
import { Icon } from "@iconify/react";
import { useSnackbar } from "notistack";
import DeleteModal from "../Modals/DeleteModal.jsx";

export default function ShareList({ updateData, reRenderShared, ...props }) {
    const { i18n, t } = useTranslation();
    const [shared, setShared] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(0);
    const [isSharedLoading, setIsSharedLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const [clipboardStatus, setClipboardStatus] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteModalLoading, setIsDeleteModalLoading] = useState(false);
    const [dataRow, setDataRow] = useState({});

    const handleSnackbarOpen = (color = "success", content = ".") => {
        enqueueSnackbar(content, {
            variant: color,
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
            },
        });
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

    const handleSharedList = () => {
        filesSharedList((response, error) => {
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
                setShared(response.data.data);
                setIsSharedLoading(false);
            }
        });
    };

    const handleSharedDelete = (data) => {
        filesSharedDelete(data.id, (response, error) => {
            if (error) {
                handleSnackbarOpen("error", `${error}`);
                return;
            }

            if (response) {
                handleSnackbarOpen("success", t("main:files.share.deleted"));
                handleSharedList();
            }
        });
    };

    const handleOpenDeleteModal = (row) => {
        setDataRow(row);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDeleteModal = (row) => {
        setIsDeleteModalOpen(false);
        handleSharedDelete(row);
    };

    useEffect(() => {
        setIsSharedLoading(true);
        handleSharedList();
    }, [updateData, reRenderShared]);

    return (
        <Box {...props}>
            <DeleteModal
                open={isDeleteModalOpen}
                data={dataRow}
                handleClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDeleteModal}
                isLoading={isDeleteModalLoading}
            />
            {!!isSharedLoading ? (
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
                <Box sx={{ px: 1, flex: 1 }}>
                    {shared?.length > 0 ? (
                        shared?.map((item, itemIndex) => (
                            <Card
                                key={itemIndex}
                                type="clipboard"
                                sx={{ mb: 2 }}
                                icon={
                                    <Icon
                                        icon="ph:share"
                                        style={{ fontSize: "22px" }}
                                    />
                                }
                                data={{
                                    index: itemIndex,
                                    content: item.file?.original_name,
                                    copyContent:
                                        localStorage.getItem("hostname") +
                                        "/api/share/" +
                                        item.download_code,
                                    date: new Date(item.expiration_date)
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
                                onConfirm={handleClipboardCopy}
                                buttonContent={clipboardStatus[itemIndex]}
                                handleOpenDeleteModal={() =>
                                    handleOpenDeleteModal({
                                        id: item.file.id,
                                        fileName: item.file?.original_name,
                                        type: "share",
                                    })
                                }
                            />
                        ))
                    ) : (
                        <Typography
                            variant="h6"
                            sx={{
                                mx: 4,
                                mt: 4,
                                fontSize: 16,
                                textAlign: "center",
                            }}
                        >
                            <Trans i18nKey="main:profile_share.no_results" />
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
        </Box>
    );
}
