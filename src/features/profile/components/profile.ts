import avatarPlaceholder from "/dog.png";
import backPlaceholder from "/frieren.png";

export function profile() {
	return `
    <div class="w-200"> 
        <div class="relative">
            <img src="${backPlaceholder}" class="h-74 w-full object-cover object-top rounded-xs">
            <img src="${avatarPlaceholder}" class="h-40 rounded-xs absolute -bottom-18 left-4"> 
        </div>
        <div class="p-4 flex flex-col gap-2">
            <div class="h-18 w-full flex justify-end">
                <button class="h-fit py-2 px-4 border bg-bg2 border-border text-body-md">Edit Profile</button>
            </div>
            <div class="flex flex-col"> 
                <p class="font-medium text-title-lg">retardedmoron69</p>
                <p class="font-medium text-body-lg text-fg5">BSCS - 2</p>
            </div>
            <div class="flex flex-col gap-3">
                <p class="text-fg3">
                    something something cool bio something something very cool bio :DD
                    if u're looking at this u're a loseeeeer. XDDDDDDDDDD
                </p>
                <div class="flex gap-4 text-fg5 text-body-md">
                    <p>3 posts</p>
                    <p>121 upvotes received</p>
                    <p>Joined August 2025</p>
                </div>
            </div>
        </div>
    </div>
    `;
}
