import { initIcons } from "../../shared/icons.ts";
import { adminHeader } from "./components/adminHeader.ts";
import { adminSideBar } from "./components/adminSideBar.ts";

export function AdminPage() {
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div class="h-full flex">
            ${adminSideBar()}
            ${adminHeader()}
        </div>
    `;
    initIcons();
}
