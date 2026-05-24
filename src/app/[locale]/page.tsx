import { MapClient } from "@/components/map/MapClient";
import { LocaleSwitcher } from "@/components/locale/LocaleSwitcher";

const Page = () => {
  return (
    <div className="relative h-screen w-full">
      <MapClient />
      <div className="absolute top-4 right-4 z-10">
        <LocaleSwitcher />
      </div>
    </div>
  );
};

export default Page;