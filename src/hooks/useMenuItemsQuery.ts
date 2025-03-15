import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  useGetMenuItemsService,
  useCreateMenuItemService,
  useUpdateMenuItemService,
  useDeleteMenuItemService,
} from "@/services/api/services/menu-items";
import { CreateMenuItemDto, UpdateMenuItemDto } from "@/types/menu-item";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";

// Create query keys
export const menuItemsQueryKeys = createQueryKeys(["menuItems"], {
  list: () => ({
    key: [],
    sub: {
      byFilter: (filter?: { ingredientId?: string }) => ({
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

// Get menu items query hook
export const useMenuItemsQuery = (filter?: { ingredientId?: string }) => {
  const fetchMenuItems = useGetMenuItemsService();

  return useInfiniteQuery({
    // Use the query key factory directly here without memoization
    queryKey: menuItemsQueryKeys.list().sub.byFilter(filter).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetchMenuItems(
        {
          page: pageParam,
          limit: 10,
          ingredientId: filter?.ingredientId,
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

// Create menu item mutation hook
export const useCreateMenuItemMutation = () => {
  const queryClient = useQueryClient();
  const createMenuItem = useCreateMenuItemService();

  return useMutation({
    mutationFn: (data: CreateMenuItemDto) => createMenuItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: menuItemsQueryKeys.list().key,
      });
    },
  });
};

// Update menu item mutation hook
export const useUpdateMenuItemMutation = () => {
  const queryClient = useQueryClient();
  const updateMenuItem = useUpdateMenuItemService();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuItemDto }) =>
      updateMenuItem({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: menuItemsQueryKeys.detail().sub.byId(variables.id).key,
      });
      queryClient.invalidateQueries({
        queryKey: menuItemsQueryKeys.list().key,
      });
    },
  });
};

// Delete menu item mutation hook
export const useDeleteMenuItemMutation = () => {
  const queryClient = useQueryClient();
  const deleteMenuItem = useDeleteMenuItemService();

  return useMutation({
    mutationFn: (id: string) => deleteMenuItem({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: menuItemsQueryKeys.list().key,
      });
    },
  });
};
