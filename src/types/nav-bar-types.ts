export interface NavBarSubmenuItem {
  id: number;
  navBarId: number;
  name: string;
  description: string;
  linkUrl: string;
  icon: string;
  displayOrder: number;
  status: string;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number | null;
  terminatedAt: string | null;
  terminatedBy: number | null;
}

export interface NavBarItem {
  id: number;
  name: string;
  description: string;
  linkUrl: string;
  icon: string;
  displayOrder: number;
  status: string;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number | null;
  terminatedAt: string | null;
  terminatedBy: number | null;
  submenus: NavBarSubmenuItem[];
}

export interface NavBarApiResponse {
  code: number;
  status: string;
  message: string;
  data: NavBarItem[];
  timestamp: string;
}
