// diseaseService.js
const { v4: uuidv4 } = require('uuid');

const diseaseService = {
  // Disease categories with genes
  // NOTE: Genes are NEVER sent to frontend - only used for PSI server-side
  disease_categories: [
    // Use static id for now because backend database for disease categories not done yet
    {
      //id: uuidv4(),
      id: "disease-001",
      name: "Breast Cancer",
      description: "Risk assessment based on hereditary and molecular markers associated with breast cancer.",
      genes: ["BRCA1", "BRCA2", "TP53", "ERBB2"],
      hospitalId: "hospital_test_1"
    },
    {
      //id: uuidv4(),
      id: "disease-002",
      name: "Breast Cancer",
      description: "Comprehensive breast cancer risk panel with extended markers.",
      genes: ["BRCA1", "BRCA2", "PALB2", "CHEK2", "ATM"],
      hospitalId: "hospital_metro_2"
    },
    {
      //id: uuidv4(),
      id: "disease-003",
      name: "Alzheimer's Disease",
      description: "Risk evaluation based on genetic indicators linked to neurodegenerative conditions.",
      genes: ["APOE", "ABCA7", "CLU", "PICALM"],
      hospitalId: "hospital_test_1"
    },
    {
      //id: uuidv4(),
      id: "disease-004",
      name: "Type 2 Diabetes",
      description: "Risk assessment based on inherited factors influencing insulin regulation and metabolism.",
      genes: ["TCF7L2", "FTO", "SLC30A8", "KCNJ11"],
      hospitalId: "hospital_test_1"
    },
    {
      //id: uuidv4(),
      id: "disease-005",
      name: "Cardiovascular Disease",
      description: "Risk evaluation using genetic markers associated with lipid processing and vascular health.",
      genes: ["LDLR", "PCSK9", "CETP", "IL6"],
      hospitalId: "hospital_test_1"
    }
  ],

  // Get all disease categories 
  getDiseaseCategories() {
    return this.disease_categories;
  },

  // Get disease genes by ID 
  getDiseaseGenes(diseaseId) {
    const disease = this.disease_categories.find(d => d.id === diseaseId);
    if (!disease) {
      return null; // or return []
    }
    return disease.genes;
  }
};

module.exports = diseaseService;