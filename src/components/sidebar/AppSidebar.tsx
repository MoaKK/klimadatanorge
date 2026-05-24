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

  const modes = [
    { ...MODES[0], title: tModes("co2.title") },
    { ...MODES[1], title: tModes("temperature.title") },
    { ...MODES[2], title: tModes("sealevel.title") },
  ];

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Klimakart">
              <Link href="/">
                <Map className="size-4 shrink-0 ml-2" />
                <span className="font-semibold group-data-[collapsible=icon]:hidden">Klimakart</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{tNav("modes")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {modes.map(({ key, href, icon: Icon, title }) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(href)}
                    tooltip={title}
                  >
                    <Link href={href}>
                      <Icon />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
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