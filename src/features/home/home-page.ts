import { header } from "../../shared/components/header.ts";
import { sideBar } from "../../shared/components/sideBar.ts";

export function HomePage() {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        ${header()}
        <div class="h-full w-full flex">
            ${sideBar()} 
            <div class="text-foreground0">
                <h3>bruh</h3>
            </div>
        </div>
    `
}
