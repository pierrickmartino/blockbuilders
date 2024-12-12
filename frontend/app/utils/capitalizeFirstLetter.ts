const capitalizeFirstLetter = (string : string) => {
  if (!string) return ''; // Gérer les cas où la chaîne est vide ou null
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default capitalizeFirstLetter;