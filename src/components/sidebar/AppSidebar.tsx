"use client";

import { Map } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LocaleSwitcher } from "@/components/locale/LocaleSwitcher";
import { MODES } from "@/lib/modes";

function AppSidebar() {
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tModes = useTranslations("modes");

  const historicalModes = [
    { ...MODES[0], title: tModes("co2.title") },
    { ...MODES[1], title: tModes("temperature.title") },
    { ...MODES[2], title: tModes("sealevel.title") },
    { ...MODES[3], title: tModes("precipitation.title") },
    { ...MODES[4], title: tModes("glacier.title") },
  ];

  const liveModes = [
    { ...MODES[5], title: tModes("airquality.title") },
  ];

  function ModeList({ modes }: { modes: (typeof MODES[number] & { title: string })[] }) {
    return (
      <SidebarMenu className="gap-2">
        { modes.map(({ key, href, icon: Icon, title }) => (
          <SidebarMenuItem key={ key }>
            <SidebarMenuButton
              asChild
              isActive={ pathname.startsWith(href) }
              tooltip={ title }
            >
              <Link href={ href }>
                <Icon className="size-[clamp(1rem,2vw,1.25rem)]" aria-hidden="true" />
                <span>{ title }</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )) }
      </SidebarMenu>
    );
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="mb-5" size="lg" asChild tooltip={ tNav("appName") }>
              <Link href="/">
                <Map className="size-4 shrink-0 ml-2 sm:size-5" aria-hidden="true" />
                <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden sm:text-base">
                  { tNav("appName") }
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="" asChild tooltip="Github repo">
              <a
                href="https://github.com/MoaKK/klimadatanorge"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/github-icon.svg"
                  alt=""
                  className="size-4 shrink-0 invert opacity-60"
                  aria-hidden="true"
                />
                <span>Github</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{ tNav("historicalMaps") }</SidebarGroupLabel>
          <SidebarGroupContent>
            <ModeList modes={ historicalModes } />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{ tNav("liveMaps") }</SidebarGroupLabel>
          <SidebarGroupContent>
            <ModeList modes={ liveModes } />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LocaleSwitcher />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export { AppSidebar };