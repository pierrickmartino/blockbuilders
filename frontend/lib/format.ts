export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Function to format a number or string into a specific format type (currency, quantity, quantity_precise, quantity_rounded or percentage).
export const formatNumber = (
  value: number | string, // Accepts either a number or string as input.
  type: "currency" | "quantity_precise" | "quantity_rounded" | "quantity" | "percentage" = "quantity" // The format type with a default value of "quantity".
) => {
  // Guard clause to handle invalid inputs: empty strings, null, undefined, or non-numeric values.
  if (
    value === "" ||
    value === null ||
    value === undefined ||
    isNaN(Number(value))
  ) {
    return "-"; // If the input is invalid, return a default value of "-".
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
        minimumFractionDigits: 0, // No minimum decimal places.
        maximumFractionDigits: 8, // Allow up to 8 decimal places.
      }).format(numValue);
    
    case "quantity_rounded":
      // If the type is "quantity_rounded", format the number with up to 0 decimal places and round to the nearest cent.
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0, // No minimum decimal places.
        maximumFractionDigits: 0, // No maximum decimal places, so it will be rounded.
      }).format(numValue);

    case "quantity":
    default:
      // If the type is "quantity" or not explicitly specified, format the number with up to 2 decimal places.
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0, // No minimum decimal places.
        maximumFractionDigits: 2, // Allow up to 2 decimal places.
      }).format(numValue);
  }
};

export const capitalizeFirstLetter = (string : string) => {
  if (!string) return ''; // Gérer les cas où la chaîne est vide ou null
  return string.charAt(0).toUpperCase() + string.slice(1);
};