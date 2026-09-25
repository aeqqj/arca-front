import { initIcons } from "../../shared/icons.ts";
import { passwordToggle } from "./handler/passwordToggle.ts";

export function SignUpPage() {
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <section class="flex-1 flex justify-center items-center select-none text-foreground0 text-fg1">
            <div class="w-94 flex flex-col gap-6">
                <div class="flex items-baseline gap-4">
                    <h3 class="font-semibold text-shadow-lg text-6xl">sign up</h3>
                </div>
                <form action="" class="flex flex-col gap-6">
                    <div class="flex flex-col gap-1">
                        <label for="email" class="text-body-lg text-fg2">Name</label>
                        <input type="email" id="email" placeholder="Enter your Name" class="auth-input text-fg2">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="email" class="text-body-lg text-fg2">Email</label>
                        <input type="email" id="email" placeholder="Enter your email" class="auth-input text-fg2">
                    </div>
                    <div class="flex flex-col gap-1 mb-1">
                        <label for="password" class="text-fg2">Password</label>
                        <div class="relative">
                            <input type="password" id="password" placeholder="Enter your password" class="auth-input text-fg2 w-full">
                            <button type="button" id="togglePassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-fg4">
                                <i data-lucide="eye" class="w-5 h-5 hover:text-fg2 transition-colors"></i>
                            </button>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <button class="px-5 py-3 bg-foreground0 bg-fg1 text-base text-bg1 border border-white rounded-xs hover:bg-fg1/90 transition-colors">sign in</button>
                        <p class="w-full text-center text-fg4 text-sm">Already have an account? <a href="/auth/signin" class="underline hover:text-fg2 transition-colors">Sign in </a></p>
                    </div>
                </form>
            </div>
        </section>
    `;
	initIcons();
	passwordToggle();
}
