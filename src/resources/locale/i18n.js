import i18next from "i18next";

import en from "./en.json";
import pl from "./pl.json";

i18next.init({
    lng: localStorage.getItem("locale"),
    fallbackLng: "en",
    resources: {
        pl: {
            main: pl,
        },
        en: {
            main: en,
        },
    },
});

export default i18next;
