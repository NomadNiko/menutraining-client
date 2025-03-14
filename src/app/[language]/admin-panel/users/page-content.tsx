"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useCallback, useMemo, useState } from "react";
import { useGetUsersQuery } from "./queries/queries";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import UserFilter from "./user-filter";
import { useRouter, useSearchParams } from "next/navigation";
import { UserFilterType } from "./user-filter-types";
import { SortEnum } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";
import Button from "@mui/material/Button";
import Link from "@/components/link";
import UsersTable from "@/components/users/UsersTable";

type UsersKeys = keyof User;

function Users() {
  const { t: tUsers } = useTranslation("admin-panel-users");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize sorting state
  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: UsersKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.DESC, orderBy: "id" };
  });

  // Handle sort column change
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: UsersKeys
  ) => {
    const isAsc = orderBy === property && order === SortEnum.ASC;
    const searchParams = new URLSearchParams(window.location.search);
    const newOrder = isAsc ? SortEnum.DESC : SortEnum.ASC;
    const newOrderBy = property;
    searchParams.set(
      "sort",
      JSON.stringify({ order: newOrder, orderBy: newOrderBy })
    );
    setSort({
      order: newOrder,
      orderBy: newOrderBy,
    });
    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  // Extract filter from URL
  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter) as UserFilterType;
    }

    return undefined;
  }, [searchParams]);

  // Fetch data
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetUsersQuery({ filter, sort: { order, orderBy } });

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Process users data
  const users = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as User[]) ?? ([] as User[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} pt={3}>
        {/* Header with title and actions */}
        <Grid container spacing={3} size={{ xs: 12 }}>
          <Grid size="grow">
            <Typography variant="h3">
              {tUsers("admin-panel-users:title")}
            </Typography>
          </Grid>
          <Grid container size="auto" wrap="nowrap" spacing={2}>
            <Grid size="auto">
              <UserFilter />
            </Grid>
            <Grid size="auto">
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin-panel/users/create"
                color="success"
              >
                {tUsers("admin-panel-users:actions.create")}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Users table */}
        <Grid size={{ xs: 12 }} mb={2}>
          <UsersTable
            users={users}
            order={order}
            orderBy={orderBy}
            handleRequestSort={handleRequestSort}
            handleScroll={handleScroll}
            isFetchingNextPage={isFetchingNextPage}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(Users, { roles: [RoleEnum.ADMIN] });
