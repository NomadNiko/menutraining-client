import { format, isToday, isSameDay } from "date-fns";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
import { ProductItem } from "@/app/[language]/types/product-item";
import { useTranslation } from "@/services/i18n/client";
import { formatDuration } from "../utils/duration-utils";

interface DayColumnProps {
  date: Date;
  items: ProductItem[];
  onItemClick: (item: ProductItem) => void;
  isVendorView: boolean;
}

export default function DayColumn({
  date,
  items,
  onItemClick,
  isVendorView,
}: DayColumnProps) {
  const { t } = useTranslation("product-items");
  const isCurrentDay = isToday(date);

  // Filter items for this specific day
  const dayItems = items.filter((item) =>
    isSameDay(new Date(item.productDate), date)
  );

  // Sort items by start time
  const sortedItems = dayItems.sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        height: "100%",
        borderRight: 1,
        borderColor: "divider",
        "&:last-child": {
          borderRight: 0,
        },
      }}
    >
      <Box
        sx={{
          p: 1,
          textAlign: "center",
          bgcolor: (theme) =>
            isCurrentDay
              ? alpha(theme.palette.primary.main, 0.1)
              : "transparent",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle2">{format(date, "EEE")}</Typography>
        <Typography
          variant="h6"
          color={isCurrentDay ? "primary" : "text.primary"}
        >
          {format(date, "d")}
        </Typography>
      </Box>
      <Box
        sx={{
          height: "calc(100% - 70px)",
          overflow: "auto",
          p: 1,
        }}
      >
        {sortedItems.map((item) => (
          <Paper
            key={item._id}
            onClick={() => onItemClick(item)}
            sx={{
              p: 1,
              mb: 1,
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 2,
                bgcolor: "action.hover",
              },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                wordBreak: "break-word",
                mb: 0.5,
              }}
            >
              {item.templateName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block" }}
            >
              {t("startTime")} :{" "}
              {format(new Date(`2000-01-01T${item.startTime}`), "h:mm a")}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block" }}
            >
              {t("duration")} : {formatDuration(item.duration)}
            </Typography>

            {isVendorView && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color:
                    item.quantityAvailable > 0 ? "success.main" : "error.main",
                }}
              >
                {item.quantityAvailable} {t("available")}
              </Typography>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
