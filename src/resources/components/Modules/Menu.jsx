import { MenuItem, Menu as MuiMenu, useTheme, alpha } from "@mui/material";

export default function Menu({ anchorEl, handleClose, isOpen, options }) {
    const theme = useTheme();

    return (
        <MuiMenu
            anchorEl={anchorEl}
            open={isOpen}
            onClose={handleClose}
            onClick={(event) => event.stopPropagation()}
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: 2,
                    marginTop: theme.spacing(1),
                    minWidth: 180,
                    backgroundColor: "rgba(15,15,25, 0.8)",
                    backdropFilter: "grayscale(30%) brightness(60%)",
                    color:
                        theme.palette.mode === "light"
                            ? "rgb(55, 65, 81)"
                            : theme.palette.grey[300],
                    boxShadow:
                        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
                    "& .MuiMenu-list": {
                        padding: "4px 0",
                    },
                    "& .MuiMenuItem-root": {
                        "& .MuiSvgIcon-root": {
                            fontSize: 18,
                            color: theme.palette.text.secondary,
                            marginRight: theme.spacing(1.5),
                        },
                        "&:active": {
                            backgroundColor: alpha(
                                theme.palette.primary.main,
                                theme.palette.action.selectedOpacity,
                            ),
                        },
                    },
                },
            }}
        >
            {options?.length > 0 &&
                options.map((item, itemIndex) => (
                    <MenuItem
                        key={itemIndex}
                        onClick={item.action}
                        sx={{ ...item.sx }}
                    >
                        {item.label}
                    </MenuItem>
                ))}
        </MuiMenu>
    );
}
