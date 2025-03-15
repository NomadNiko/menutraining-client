export type Allergy = {
  _id: string;
  allergyId: string;
  allergyName: string;
  allergyLogoUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAllergyDto = {
  allergyName: string;
  allergyLogoUrl?: string;
};

export type UpdateAllergyDto = Partial<CreateAllergyDto>;
