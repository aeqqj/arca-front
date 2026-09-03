import avatar from "/dog.png";
import cover from "/frieren.png";

export function miniProfile() {
	return `
        <div class="w-100 h-fit bg-bg2 flex flex-col border border-border">
            <div class="relative">
                <img src="${cover}" class="h-40 w-full object-cover object-top rounded-xs">
                <img src="${avatar}" class="h-20 rounded-xs absolute -bottom-10 left-6"> 
            </div>
            <div class="p-6 pb-6 pt-4">
                <h4 class="text-fg2 font-medium ml-24 mb-5 cursor-pointer hover:text-fg-link transition-colors">retardedmoron69</h4>
                <div class="flex flex-col gap-4 text-body-md">
                    <p class="text-fg3">
                        I love Computers, especially the one in my house. I am also single, contact Anton Joseph Pepito at facebook. I have 10 cats, and I love pickling my balls.
                    </p>
                    <p class="text-fg5">Joined March 2, 2026</p>
                </div>
            </div>
        </div>
    `;
}
