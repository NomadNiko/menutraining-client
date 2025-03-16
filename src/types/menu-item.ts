export type MenuItem = {
  _id: string;
  menuItemId: string;
  menuItemName: string;
  menuItemDescription?: string;
  menuItemIngredients: string[];
  menuItemUrl?: string;
  createdAt: string;
  updatedAt: string;
  id: string;
};

export type CreateMenuItemDto = {
  menuItemName: string;
  menuItemDescription?: string;
  menuItemIngredients: string[];
  menuItemUrl?: string;
};

export type UpdateMenuItemDto = Partial<CreateMenuItemDto>;
