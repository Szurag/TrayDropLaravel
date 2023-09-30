import { useTranslation, Trans } from "react-i18next";
import {
    filesCreate,
    filesDelete,
    filesDeleteAll,
    filesDownload,
    filesList,
    filesShare,
} from "../../../api/FilesApi.js";
import Card from "../../../components/Card";
import { useDropzone } from "react-dropzone";
import Menu from "../../../components/Menu";
import DeleteModal from "../../../components/Modals/DeleteModal";
import Tile from "../../../components/Tile/Tile.jsx";
import TileHeader from "../../../components/Tile/TileHeader.jsx";
import {
    Box,
    Typography,
    Skeleton,
    IconButton,
    Tooltip,
    useMediaQuery,
    useTheme,
    Pagination,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState, useCallback, useEffect } from "react";
import FilesProgress from "./Progress/FilesProgress";
import { Icon } from "@iconify/react";
import ShareModal from "./Modal/ShareModal";
import InfoModal from "../../../components/Modals/InfoModal";
import axios from "axios";
import UploadModal from "./Modal/UploadModal";

export default function Files({ passwd, updateData, triggerReRenderShared }) {
    const { i18n, t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isDeleteModalLoading, setIsDeleteModalLoading] = useState(false);
    const [isShareModalLoading, setIsShareModalLoading] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isUploadModalLoading, setIsUploadModalLoading] = useState(false);
    const [dataRow, setDataRow] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [isFilesLoading, setIsFilesLoading] = useState(true);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadQueue, setDownloadQueue] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadQueue, setUploadQueue] = useState([]);
    const [uploadInstance, setUploadInstance] = useState({});
    const [downloadInstance, setDownloadInstance] = useState({});
    const [filesStatus, setFilesStatus] = useState([]);
    const [files, setFiles] = useState([]);
    const [cancelSourceUpload, setCancelSourceUpload] = useState(
        axios.CancelToken.source(),
    );
    const [cancelSourceDownload, setCancelSourceDownload] = useState(
        axios.CancelToken.source(),
    );
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("xl"));
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(0);

    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles.length <= 0) return;

            acceptedFiles.map((item, itemIndex) => {
                const formData = new FormData();
                handleCloseMenu();

                formData.append("file", item);
                formData.append("password", passwd);

                if (
                    uploadProgress > 0 ||
                    (itemIndex > 0 && acceptedFiles.length > 1)
                ) {
                    setUploadQueue((queue) => {
                        const newData = [...queue];
                        newData.push({ form: formData, fileName: item.name });
                        return newData;
                    });
                    handleSnackbarOpen(
                        "warning",
                        t("main:files.added_to_queue") + ": " + item.name,
                    );
                    return;
                }

                handleFilesSend(formData, item.name);
            });
        },
        [uploadProgress],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    useEffect(() => {
        if (uploadProgress === 0 && uploadQueue.length > 0) {
            handleFilesSend(uploadQueue[0].form, uploadQueue[0].fileName);
            setUploadQueue(uploadQueue.slice(1));
        }
    }, [uploadProgress]);

    const handleFilesSend = (data, fileName) => {
        handleSnackbarOpen(
            "info",
            t("main:files.upload_started") + ": " + fileName,
        );

        filesCreate(
            { form: data, cancelToken: cancelSourceUpload.token },
            (event) => {
                const percentCompleted = Math.round(
                    (event.loaded * 100) / (event.total || 1),
                );
                setUploadProgress(percentCompleted);

                setUploadInstance({
                    value: event.loaded,
                    percent: percentCompleted,
                });
            },
            (response, error) => {
                setUploadProgress(0);
                setUploadInstance({});
                if (error) {
                    if (axios.isCancel(error)) {
                        console.log(error.message);
                        handleSnackbarOpen(
                            "success",
                            t("main:errors.canceled_upload"),
                        );
                        return;
                    }

                    handleSnackbarOpen("error", `${error}`);
                    return;
                }

                if (response) {
                    handleSnackbarOpen(
                        "success",
                        t("main:files.sent") + ": " + fileName,
                    );
                }
            },
        );
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

    const handleOpenDeleteModal = (row) => {
        setDataRow(row);
        setIsDeleteModalOpen(true);
    };

    const handleOpenUploadModal = (row) => {
        setDataRow(row);
        setIsUploadModalOpen(true);
    };

    useEffect(() => {
        if (downloadProgress === 0 && downloadQueue.length > 0) {
            handleFilesDownload(downloadQueue[0].form, downloadQueue[0].index);
            setDownloadQueue(downloadQueue.slice(1));
        }
    }, [downloadProgress]);

    const handleFilesDownload = (data, itemIndex) => {
        if (downloadProgress > 0) {
            setDownloadQueue((item) => {
                const newData = [...item];
                newData.push({ form: data, index: itemIndex });
                return newData;
            });
            setFilesStatus((item) => {
                const newData = [...item];
                newData[itemIndex] = "queued";
                return newData;
            });
            return;
        }

        setFilesStatus((item) => {
            const newData = [...item];
            newData[itemIndex] = "downloading";
            return newData;
        });
        filesDownload(
            {
                password: passwd,
                id: data.id,
                cancelToken: cancelSourceDownload.token,
            },
            (event) => {
                const percentCompleted = Math.round(
                    (event.loaded * 100) / (event.total || 1),
                );
                setDownloadProgress(percentCompleted);

                setDownloadInstance({
                    value: event.loaded,
                    percent: percentCompleted,
                });
            },
            (response, error) => {
                setDownloadProgress(0);
                setDownloadInstance({});
                if (error) {
                    if (axios.isCancel(error)) {
                        console.log(error.message);
                        handleSnackbarOpen(
                            "success",
                            t("main:errors.canceled_download"),
                        );

                        setFilesStatus((item) => {
                            const newData = [...item];
                            newData[itemIndex] = "canceled";
                            return newData;
                        });

                        setTimeout(() => {
                            setFilesStatus((item) => {
                                const newData = [...item];
                                newData[itemIndex] = "normal";
                                return newData;
                            });
                        }, 1000);

                        return;
                    }

                    handleSnackbarOpen("error", `${error}`);
                    return;
                }

                if (response) {
                    const blob = new Blob([response.data], {
                        type: response.headers["content-type"],
                    });
                    const url = window.URL.createObjectURL(blob);
                    let a = document.createElement("a");
                    a.href = url;
                    a.download = data.fileName;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove();

                    setFilesStatus((item) => {
                        const newData = [...item];
                        newData[itemIndex] = "downloaded";
                        return newData;
                    });

                    setTimeout(() => {
                        setFilesStatus((item) => {
                            const newData = [...item];
                            newData[itemIndex] = "normal";
                            return newData;
                        });
                    }, 1000);
                }
            },
        );
    };

    const handleFilesList = () => {
        filesList(
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
                    setFiles(response.data.data);
                    setIsFilesLoading(false);
                }
            },
        );
    };

    const handleFilesRemove = () => {
        setIsDeleteModalLoading(true);
        filesDelete(dataRow, (response, error) => {
            setIsDeleteModalOpen(false);
            setIsDeleteModalLoading(false);

            if (error) {
                handleSnackbarOpen("error", `${error}`);
                return;
            }

            if (response) {
                handleSnackbarOpen("success", t("main:files.deleted"));
            }
        });
    };

    const handleFilesRemoveAll = () => {
        filesDeleteAll((response, error) => {
            if (error) {
                handleSnackbarOpen("error", `${error}`);
                return;
            }

            if (response) {
                handleSnackbarOpen("success", t("main:files.deleted"));
            }
        });
        handleCloseMenu();
    };

    const handleConfirmDeleteModal = (row) => {
        if (row.num === "all") {
            handleFilesRemoveAll();

            setIsDeleteModalOpen(false);
        } else {
            handleFilesRemove();
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

    const handleConfirmShareModal = (data) => {
        setIsShareModalLoading(true);

        const inputDate = new Date(data.expirationDate);
        const preparedData = {
            file_id: data.fileId,
            expiration_date: `${inputDate.getFullYear()}-${(
                inputDate.getMonth() + 1
            )
                .toString()
                .padStart(2, "0")}-${inputDate
                .getDate()
                .toString()
                .padStart(2, "0")} ${inputDate
                .getHours()
                .toString()
                .padStart(2, "0")}:${inputDate
                .getMinutes()
                .toString()
                .padStart(2, "0")}:${inputDate
                .getSeconds()
                .toString()
                .padStart(2, "0")}`,
            password: data.password,
        };

        filesShare(preparedData, (response, error) => {
            setIsShareModalOpen(false);
            setIsShareModalLoading(false);

            if (error) {
                handleSnackbarOpen("error", `${error}`);
                return;
            }

            if (response) {
                triggerReRenderShared();
                handleSnackbarOpen(
                    "success",
                    t("main:files.share.shared") + ": " + data.fileName,
                );
                handleOpenInfoModal({
                    i18nKey: "main:files.share.shared_file",
                    content: (
                        <Box>
                            <Typography>
                                <Typography sx={{ fontWeight: "bold" }}>
                                    {t("main:files.share.link")}:
                                </Typography>
                                {localStorage.getItem("hostname")}/api/share/
                                {response.data.share.download_code}
                                <Tooltip title={t("main:copy")}>
                                    <IconButton
                                        sx={{ ml: 0.5, alignSelf: "center" }}
                                        onClick={() => {
                                            navigator.clipboard
                                                .writeText(
                                                    `${localStorage.getItem(
                                                        "hostname",
                                                    )}/api/share/${
                                                        response.data.share
                                                            .download_code
                                                    }`,
                                                )
                                                .then(() => {
                                                    handleSnackbarOpen(
                                                        "success",
                                                        t(
                                                            "main:files.share.copied",
                                                        ),
                                                    );
                                                });
                                        }}
                                    >
                                        <Icon icon="ph:clipboard" />
                                    </IconButton>
                                </Tooltip>
                            </Typography>
                            <Typography>
                                <Typography sx={{ fontWeight: "bold", mt: 2 }}>
                                    {t("main:files.share.date")}:
                                </Typography>
                                {preparedData.expiration_date}
                            </Typography>
                        </Box>
                    ),
                });
            }
        });
    };

    const handleOpenShareModal = (row) => {
        setDataRow(row);
        setIsShareModalOpen(true);
    };

    const handleOpenInfoModal = (row) => {
        setDataRow(row);
        setIsInfoModalOpen(true);
    };

    useEffect(() => {
        if (passwd?.length > 0) {
            handleFilesList();
        }
    }, [passwd]);

    useEffect(() => {
        setFilesStatus(
            files?.length > 0 &&
                files.map((item, itemIndex) => {
                    if (filesStatus[itemIndex] !== "normal") {
                        return filesStatus[itemIndex];
                    } else {
                        return "normal";
                    }
                }),
        );
    }, [files]);

    useEffect(() => {
        if (updateData.message === "files") {
            handleFilesList();
        }
    }, [updateData]);

    const handleCancelTransfer = (type) => {
        switch (type) {
            case "upload":
                cancelSourceUpload.cancel("Request canceled by user");
                setCancelSourceUpload(axios.CancelToken.source());
                break;

            case "download":
                cancelSourceDownload.cancel("Request canceled by user");
                setCancelSourceDownload(axios.CancelToken.source());
                break;
        }
    };

    useEffect(() => {
        if (!!isSmallScreen) {
            window.removeEventListener("keydown", () => {});
        }

        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "v") {
                handleFileFromClipboard();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
    }, []);

    const handleFileFromClipboard = () => {
        navigator.clipboard.read().then((clipboardFiles) => {
            clipboardFiles.forEach((clipboardItem) => {
                clipboardItem.types.forEach((type) => {
                    if (
                        type.startsWith("image/") ||
                        type.startsWith("video/") ||
                        type.startsWith("audio/")
                    ) {
                        clipboardItem.getType(type).then((blob) => {
                            handleOpenUploadModal({
                                blob: blob,
                                type: type,
                            });
                        });
                    }
                });
            });
        });
    };

    const handleConfirmUploadModal = (fileName, blob, type) => {
        setIsUploadModalLoading(false);
        setIsUploadModalOpen(false);

        const file = new File([blob], fileName, { type });
        const formData = new FormData();

        formData.append("file", file);
        formData.append("password", passwd);

        if (uploadProgress > 0) {
            setUploadQueue((queue) => {
                const newData = [...queue];
                newData.push({ form: formData, fileName: fileName });
                return newData;
            });
            handleSnackbarOpen(
                "warning",
                t("main:files.added_to_queue") + ": " + fileName,
            );
            return;
        }

        handleFilesSend(formData, fileName);
    };

    useEffect(() => {
        setIsFilesLoading(true);
        handleFilesList();
    }, [page]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flex: 3,
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
            <ShareModal
                open={isShareModalOpen}
                data={dataRow}
                handleClose={() => setIsShareModalOpen(false)}
                onConfirm={handleConfirmShareModal}
                isLoading={isShareModalLoading}
            />
            <InfoModal
                open={isInfoModalOpen}
                data={dataRow}
                handleClose={() => setIsInfoModalOpen(false)}
            />
            <UploadModal
                open={isUploadModalOpen}
                data={dataRow}
                handleClose={() => setIsUploadModalOpen(false)}
                onConfirm={handleConfirmUploadModal}
                isLoading={isUploadModalLoading}
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
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                    {...getRootProps()}
                >
                    <TileHeader
                        title={t("main:files.main")}
                        icon="pepicons-pencil:dots-y"
                        handleOpen={handleOpenMenu}
                        action={{
                            title: t("main:upload"),
                            getRootProps: getRootProps,
                            icon: "octicon:upload-16",
                            file: true,
                            getInputProps: getInputProps,
                        }}
                        onClick={(event) => event.stopPropagation()}
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
                                        type: "files",
                                    }),
                                label: t("main:remove_all"),
                                sx: { color: "red" },
                            },
                        ]}
                        getInputProps={getInputProps}
                        type="files"
                        getRootProps={getRootProps}
                    />
                    {!!isFilesLoading ? (
                        <Box sx={{ px: 1, mt: 1.5 }}>
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
                    ) : !!isDragActive ? (
                        <Box sx={{ mt: 1.5 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    textAlign: "center",
                                    fontSize: 40,
                                    mt: 10,
                                }}
                                {...getRootProps()}
                            >
                                {t("main:files.drop_files")}
                            </Typography>
                        </Box>
                    ) : (
                        <Box
                            sx={{ px: 1, mt: 1.5, overflowY: "auto", flex: 1 }}
                            {...getRootProps()}
                            onClick={(event) => event.stopPropagation()}
                        >
                            {files?.length > 0 ? (
                                files.map((item, itemIndex) => (
                                    <Card
                                        key={itemIndex}
                                        type="file"
                                        sx={{ mb: 2 }}
                                        onConfirm={handleFilesDownload}
                                        buttonContent={filesStatus[itemIndex]}
                                        icon={
                                            <Icon
                                                icon="ph:files"
                                                style={{ fontSize: "22px" }}
                                            />
                                        }
                                        data={{
                                            id: item.id,
                                            fileName: item.original_name,
                                            index: itemIndex,
                                            content: item.original_name,
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
                                                fileName: item.original_name,
                                                type: "files",
                                            })
                                        }
                                        optionalButtons={[
                                            {
                                                startIcon: (
                                                    <Icon icon={"ph:share"} />
                                                ),
                                                action: () =>
                                                    handleOpenShareModal({
                                                        password: passwd,
                                                        fileId: item.id,
                                                        fileName:
                                                            item.original_name,
                                                    }),
                                                label: t("main:share"),
                                            },
                                        ]}
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
                                    <Trans i18nKey={"main:files.no_results"} />
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
                <FilesProgress
                    upload={uploadInstance}
                    download={downloadInstance}
                    handleCancelTransfer={handleCancelTransfer}
                />
            </Tile>
        </Box>
    );
}
