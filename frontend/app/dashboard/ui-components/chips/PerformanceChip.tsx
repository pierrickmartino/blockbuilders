import { formatNumber } from "@/lib/format";
import { Chip } from "@mui/material"

interface PerformanceChipProps {
    input: number;
    type: "currency" | "quantity_precise" | "quantity" | "percentage";
    icon?: React.ReactElement<unknown>
  }

const PerformanceChip: React.FC<PerformanceChipProps> = ({input, type, icon}) => {

    return (
        <Chip
            icon={icon} 
            sx={{
                pl: "4px",
                pr: "4px",
                borderColor:
                input < 0
                ? "error.dark"
                : input > 0
                ? "success.dark"
                : "rgba(107, 114, 128, 0.1)", // No background color if the unrealized gain is 0
                backgroundColor:
                input < 0
                    ? "error.light"
                    : input > 0
                    ? "success.light"
                    : "rgba(249, 250, 251, 1)", // No background color if the unrealized gain is 0
                color:
                input < 0
                    ? "error.main"
                    : input > 0
                    ? "success.main"
                    : "rgba(75, 85, 99, 1)", // No color if the unrealized gain is 0
            }}
            size="small"
            variant="outlined"
            label={formatNumber(input, type)}
        />     
    ); 
};
export default PerformanceChip;