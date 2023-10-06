import Tile from "../../../components/Tile/Tile.jsx";
import PairdropIframe from "./PairdropIframe.jsx";

export default function PairdropEmbed({ state }) {
    return (
        <Tile
            sx={{
                position: "absolute",
                overflowY: "hidden",
                overflowX: "hidden",
                height: 600,
                width: 400,
                right: state ? "58px" : "-48px",
                bottom: state ? "58px" : "-48px",
                opacity: state ? 1.0 : 0.0,
                transform: state ? "" : "scale(0.7, 0.7)",
                transition: "0.2s",
                zIndex: state ? 5 : -1,
            }}
        >
            <PairdropIframe />
        </Tile>
    );
}
