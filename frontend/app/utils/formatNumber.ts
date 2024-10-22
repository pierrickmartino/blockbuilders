// Function to format a number or string into a specific format type (currency, quantity, or percentage).
const formatNumber = (
  value: number | string,  // Accepts either a number or string as input.
  type: "currency" | "quantity_precise" | "quantity" | "percentage" = "quantity"  // The format type with a default value of "quantity".
) => {

  // Guard clause to handle invalid inputs: empty strings, null, undefined, or non-numeric values.
  if (value === "" || value === null || value === undefined || isNaN(Number(value))) {
    return "-";  // If the input is invalid, return a default value of "-".
  }

  // Convert the value to a number in case it is passed as a string.
  const numValue = Number(value); 

  // Switch block to format the number based on the specified type.
  switch (type) {
    case "currency":
      // If the type is "currency", format the number as US dollars (USD) with 2 decimal places.
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(numValue);

    case "percentage":
      // If the type is "percentage", format the number as a percentage with 2 decimal places.
      return `${numValue.toFixed(2)}%`; 

    case "quantity_precise":
      // If the type is "quantity_precise", format the number with up to 8 decimal places.
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,  // No minimum decimal places.
        maximumFractionDigits: 8,  // Allow up to 8 decimal places.
      }).format(numValue);

    case "quantity":
    default:
      // If the type is "quantity" or not explicitly specified, format the number with up to 2 decimal places.
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,  // No minimum decimal places.
        maximumFractionDigits: 2,  // Allow up to 2 decimal places.
      }).format(numValue);
  }
};

export default formatNumber;
