import { initIcons } from "../../shared/icons.ts";
import { adminHeader } from "./components/adminHeader.ts";
import { adminSideBar } from "./components/adminSideBar.ts";

export function AdminUsersPage() {
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div class="h-full flex">
            ${adminSideBar()}
            <div class="flex flex-col flex-1 min-w-0">
                ${adminHeader("Users")}
            </div>
        </div>
    `;
    initIcons();
}
