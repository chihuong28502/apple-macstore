import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { locales } from "@/constants/i18n.config";

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales });
