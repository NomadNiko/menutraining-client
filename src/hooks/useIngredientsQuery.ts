import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  useGetIngredientsService,
  useCreateIngredientService,
  useUpdateIngredientService,
  useDeleteIngredientService,
} from "@/services/api/services/ingredients";
import { CreateIngredientDto, UpdateIngredientDto } from "@/types/ingredient";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";

// Create query keys
export const ingredientsQueryKeys = createQueryKeys(["ingredients"], {
  list: () => ({
    key: [],
    sub: {
      byFilter: (filter?: { name?: string; allergyId?: string }) => ({
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

// Get ingredients query hook
export const useIngredientsQuery = (filter?: {
  name?: string;
  allergyId?: string;
}) => {
  const fetchIngredients = useGetIngredientsService();

  return useInfiniteQuery({
    // Use the query key factory directly here without memoization
    queryKey: ingredientsQueryKeys.list().sub.byFilter(filter).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetchIngredients(
        {
          page: pageParam,
          limit: 10,
          name: filter?.name,
          allergyId: filter?.allergyId,
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

// Create ingredient mutation hook
export const useCreateIngredientMutation = () => {
  const queryClient = useQueryClient();
  const createIngredient = useCreateIngredientService();

  return useMutation({
    mutationFn: (data: CreateIngredientDto) => createIngredient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ingredientsQueryKeys.list().key,
      });
    },
  });
};

// Update ingredient mutation hook
export const useUpdateIngredientMutation = () => {
  const queryClient = useQueryClient();
  const updateIngredient = useUpdateIngredientService();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIngredientDto }) =>
      updateIngredient({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ingredientsQueryKeys.detail().sub.byId(variables.id).key,
      });
      queryClient.invalidateQueries({
        queryKey: ingredientsQueryKeys.list().key,
      });
    },
  });
};

// Delete ingredient mutation hook
export const useDeleteIngredientMutation = () => {
  const queryClient = useQueryClient();
  const deleteIngredient = useDeleteIngredientService();

  return useMutation({
    mutationFn: (id: string) => deleteIngredient({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ingredientsQueryKeys.list().key,
      });
    },
  });
};
