import { createQueryKeys } from '@/services/react-query/query-key-factory';

export const cartKeys = createQueryKeys(['cart'], {
  root: () => ({
    key: [],
    sub: {
      detail: (userId: string) => ({
        key: [userId],
      }),
    },
  }),
});