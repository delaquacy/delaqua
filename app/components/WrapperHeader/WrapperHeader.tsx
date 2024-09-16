"use client";
import { useUserContext } from "@/app/contexts/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import Headers from "../Headers/Headers";
import { UnpaidOrdersModal } from "../UnpaidOrdersModal";

export default function WrapperHeader() {
  const {
    unpaidOrders,
    showWindow,
    showContinueText,
    setShowContinueText,
    setShowWindow,
  } = useUserContext();

  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    if (pathname.includes("/my_account")) {
      router.push("/new_order");
    }
  }, [pathname]);

  return (
    <>
      <Headers
        setShowWindow={setShowWindow}
        setShowContinueText={setShowContinueText}
      />
      {showWindow && (
        <UnpaidOrdersModal
          showWindow={showWindow}
          showContinueText={showContinueText}
          onClose={() => setShowWindow(false)}
          unpaidOrders={unpaidOrders}
        />
      )}
    </>
  );
}
