"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

const TopLeftImg = () => {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <div className="absolute left-0 top-0 mix-blend-color-dodge z-10 w-50 xl:w-100 opacity-50 pointer-events-none select-none">
      <Image
        src="/top-left-img.png"
        alt="left cover bg"
        width={400}
        height={400}
      />
    </div>
  );
};

export default TopLeftImg;
