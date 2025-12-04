// diseaseService.js
const { v4: uuidv4 } = require('uuid');

const diseaseService = {
  // Disease categories with genes - matches Python Storage
  // NOTE: Genes are NEVER sent to frontend - only used for PSI server-side
  disease_categories: [
    {
      id: uuidv4(),
      name: "Breast Cancer",
      description: "Risk assessment based on hereditary and molecular markers associated with breast cancer.",
      genes: ["BRCA1", "BRCA2", "TP53", "ERBB2"]
    },
    {
      id: uuidv4(),
      name: "Alzheimer's Disease",
      description: "Risk evaluation based on genetic indicators linked to neurodegenerative conditions.",
      genes: ["APOE", "ABCA7", "CLU", "PICALM"]
    },
    {
      id: uuidv4(),
      name: "Type 2 Diabetes",
      description: "Risk assessment based on inherited factors influencing insulin regulation and metabolism.",
      genes: ["TCF7L2", "FTO", "SLC30A8", "KCNJ11"]
    },
    {
      id: uuidv4(),
      name: "Cardiovascular Disease",
      description: "Risk evaluation using genetic markers associated with lipid processing and vascular health.",
      genes: ["LDLR", "PCSK9", "CETP", "IL6"]
    }
  ],

  // Get all disease categories (matches Python get_disease_categories)
  getDiseaseCategories() {
    return this.disease_categories;
  },

  // Get disease genes by ID (matches Python get_disease_genes)
  getDiseaseGenes(diseaseId) {
    const disease = this.disease_categories.find(d => d.id === diseaseId);
    if (!disease) {
      return null; // or return []
    }
    return disease.genes;
  }
};

module.exports = diseaseService;