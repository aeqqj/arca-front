import "remixicon/fonts/remixicon.css";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <header class="h-16 w-full px-6 flex items-center">
        <button class="cursor-pointer">
            <i class="ri-arrow-left-line text-foreground0 text-3xl"></i>
        </button>
    </header>
    <section class="flex-1 flex justify-center items-center select-none text-foreground0">
        <div class="w-94 flex flex-col gap-4">
            <div class="flex items-baseline gap-4">
                <h3 class="font-semibold text-shadow-lg">register</h3>
                <button class="text-foreground0 opacity-60 text-shadow-lg/25">(login)</button>
            </div>
            <div class="mb-24">
                <form action="" class="flex flex-col gap-6">
                    <div class="flex flex-col">
                        <label for="name">Name</label>
                        <input type="text" id="name" placeholder="Enter your name" class="auth-input">
                    </div>
                    <div class="flex flex-col gap-1">
                        <div class="flex flex-col">
                            <label for="email">Email</label>
                            <input type="email" id="email" placeholder="Enter your email" class="auth-input">
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <div class="flex flex-col">
                            <label for="password">Password</label>
                            <input type="password" id="password" placeholder="Enter your password" class="auth-input">
                        </div>
                    </div>
                    <button class="mt-4 py-2 bg-foreground0 text-background1 text-base border border-white rounded-xl shadow-xl">Register</button>
                </form>
            </div>
        </div>
    </section>
`;
