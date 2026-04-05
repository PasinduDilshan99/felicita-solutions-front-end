import { NavBarItem, NavBarSubmenuItem } from "@/types/nav-bar-types";

export const getVisibleSubmenus = (item: NavBarItem): NavBarSubmenuItem[] => {
  if (!item.submenus) return [];
  return item.submenus
    .filter((submenu) => submenu.status === "VISIBLE")
    .sort((a, b) => a.displayOrder - b.displayOrder);
};

export const hasSubmenus = (item: NavBarItem): boolean => {
  return item.submenus && item.submenus.filter(sub => sub.status === "VISIBLE").length > 0;
};

export const getUserInitials = (user: { firstName: string; lastName: string }): string => {
  return `${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`;
};

export const getAvatarStyles = (size: "small" | "medium" | "large" = "medium") => {
  const sizes = {
    small: "w-7 h-7 text-xs",
    medium: "w-8 h-8 text-sm",
    large: "w-10 h-10 text-lg",
  };

  return {
    className: `rounded-full flex items-center justify-center overflow-hidden ${sizes[size]}`,
    style: {
      background: "linear-gradient(135deg, #8B5FBF 0%, #E9B949 100%)",
      border: "2px solid rgba(139, 95, 191, 0.3)",
    } as React.CSSProperties,
  };
};