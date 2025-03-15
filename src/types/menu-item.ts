export type MenuItem = {
  _id: string;
  menuItemId: string;
  menuItemDescription?: string;
  menuItemIngredients: string[];
  menuItemUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateMenuItemDto = {
  menuItemDescription?: string;
  menuItemIngredients: string[];
  menuItemUrl?: string;
};

export type UpdateMenuItemDto = Partial<CreateMenuItemDto>;
