import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  useGetAllergiesService,
  useCreateAllergyService,
  useUpdateAllergyService,
  useDeleteAllergyService,
} from "@/services/api/services/allergies";
import { CreateAllergyDto, UpdateAllergyDto } from "@/types/allergy";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";

// Create query keys
export const allergiesQueryKeys = createQueryKeys(["allergies"], {
  list: () => ({
    key: [],
    sub: {
      byFilter: (filter?: { name?: string }) => ({
        key: [filter],
      }),
    },
  }),
  detail: () => ({
    key: [],
    sub: {
      byId: (id: string) => ({
        key: [id],
      }),
    },
  }),
});

// Get allergies query hook
export const useAllergiesQuery = (filter?: { name?: string }) => {
  const fetchAllergies = useGetAllergiesService();

  return useInfiniteQuery({
    // Use the query key factory directly here without memoization
    queryKey: allergiesQueryKeys.list().sub.byFilter(filter).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetchAllergies(
        {
          page: pageParam,
          limit: 10,
          name: filter?.name,
        },
        { signal }
      );
      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data,
          nextPage: data.length === 10 ? pageParam + 1 : undefined,
        };
      }
      return { data: [], nextPage: undefined };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};

// Create allergy mutation hook
export const useCreateAllergyMutation = () => {
  const queryClient = useQueryClient();
  const createAllergy = useCreateAllergyService();

  return useMutation({
    mutationFn: (data: CreateAllergyDto) => createAllergy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allergiesQueryKeys.list().key,
      });
    },
  });
};

// Update allergy mutation hook
export const useUpdateAllergyMutation = () => {
  const queryClient = useQueryClient();
  const updateAllergy = useUpdateAllergyService();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAllergyDto }) =>
      updateAllergy({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: allergiesQueryKeys.detail().sub.byId(variables.id).key,
      });
      queryClient.invalidateQueries({
        queryKey: allergiesQueryKeys.list().key,
      });
    },
  });
};

// Delete allergy mutation hook
export const useDeleteAllergyMutation = () => {
  const queryClient = useQueryClient();
  const deleteAllergy = useDeleteAllergyService();
  return useMutation({
    mutationFn: (id: string) => deleteAllergy({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allergiesQueryKeys.list().key,
      });
    },
  });
};
