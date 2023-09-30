import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function SnackbarSetupInfo({ status }) {
    const { enqueueSnackbar } = useSnackbar();
    const [t] = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        switch (status) {
            case "main":
                handleSnackbarOpen(
                    "success",
                    t("main:errors.main_choosen") +
                        " (" +
                        localStorage.getItem("hostname-main") +
                        ")",
                );
                break;

            case "alt":
                handleSnackbarOpen(
                    "success",
                    t("main:errors.alt_choosen") +
                        " (" +
                        localStorage.getItem("hostname-alt") +
                        ")",
                );
                break;

            case "err":
                handleSnackbarOpen(
                    "error",
                    t("main:errors.servers_unreachable"),
                );
                navigate("/setup");
                break;
        }
    }, [status]);

    const handleSnackbarOpen = (color = "success", content = ".") => {
        enqueueSnackbar(content, {
            variant: color,
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
            },
            autoHideDuration: 1000,
        });
    };

    return <></>;
}
