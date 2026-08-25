import { urlLocationHandler } from "./core/router/router.ts";
import "remixicon/fonts/remixicon.css";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    ROUTING SOON(TM)
`;
urlLocationHandler();
