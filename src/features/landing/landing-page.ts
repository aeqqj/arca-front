import { schoolCard } from "./components/schoolCard.ts";
import "remixicon/fonts/remixicon.css";

export function LandingPage() {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <header class="h-16 w-full px-6 flex items-center justify-end">
        <button class="cursor-pointer">
            <i class="ri-user-line text-3xl"></i>
        </button>
    </header>
    <section class="flex-1 flex flex-col gap-6 justify-center items-center select-none">
        <h1 class="font-bold text-shadow-lg">arca</h1>
        <div class="flex gap-10 mb-24">
            ${schoolCard("test")}
            ${schoolCard("test")}
            ${schoolCard("test")}
            ${schoolCard("test")}
        </div>
    </section>
    `;
};
