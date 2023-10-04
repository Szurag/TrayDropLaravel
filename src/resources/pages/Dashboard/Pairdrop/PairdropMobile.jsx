import Tile from "../../../components/Tile/Tile.jsx";
import PairdropIframe from "./PairdropIframe.jsx";

export default function PairdropMobile({ sx }) {
    return (
        <Tile
            sx={{
                flex: 1,
                pb: 2,
                position: "relative",
                overflowY: "hidden",
                overflowX: "hidden",
                height: "100%",
                width: "100%",
                ...sx,
            }}
        >
            <PairdropIframe />
        </Tile>
    );
}
