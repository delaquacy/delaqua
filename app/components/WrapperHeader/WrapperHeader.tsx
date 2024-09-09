"use client";
import { useUserContext } from "@/app/contexts/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import Headers from "../Headers/Headers";
import { UnpaidOrdersModal } from "../UnpaidOrdersModal";

export default function WrapperHeader() {
  const { unpaidOrders, showWindow, setShowWindow } = useUserContext();

  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    if (pathname.includes("/my_account")) {
      router.push("/new_order");
    }
  }, [pathname]);

  return (
    <>
      <Headers setShowWindow={setShowWindow} />
      {showWindow && (
        <UnpaidOrdersModal
          showWindow={showWindow}
          onClose={() => setShowWindow(false)}
          unpaidOrders={unpaidOrders}
        />
      )}
    </>
  );
}
