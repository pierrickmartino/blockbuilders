function getLast30Days(): string[] {
    const labels = [];
    const today = new Date();
  
    for (let i = 0; i < 30; i++) {
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - i);
  
      const day = pastDate.getDate(); // Numéro du jour
      const monthName = pastDate.toLocaleDateString("en-US", { month: "short" }); // Mois au format abrégé
  
      labels.push(`${monthName} ${day}`);
    }
  
    return labels.reverse(); // Inverser pour avoir du plus ancien au plus récent
  }

  export default getLast30Days;