//

import { UpdateCheckButton } from "./UpdateCheckButton";

export function ChatHero() {
  return (
    <div className="relative z-[2] mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center px-6 pt-[110px] pb-[52px] text-center">
      {/* Product Update Badge - interactive, theme-aware update checker */}
      <UpdateCheckButton />

      {/* Heading */}
      <div className="mt-4 flex w-full flex-col items-center gap-0">
        <h1 className="font-display text-hero font-normal leading-[1] tracking-normal text-white">
          HR Connect
        </h1>

        <h2 className="mt-[-2px] font-display text-hero font-medium leading-[1] tracking-normal bg-hero-text bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
          Internal Employee Assistant
        </h2>
      </div>

      {/* Subtitle */}
      <p className="mt-3 font-body text-base font-normal text-stone">
        HR Policies, Documents &amp; Benefits
      </p>
    </div>
  );
}
