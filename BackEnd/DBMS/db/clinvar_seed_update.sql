-- ===================================
-- CLINVAR-SOURCED DISEASE-GENE SEED DATA
-- ===================================
-- Source: ClinVar (NCBI) gene-condition associations
-- Reference: https://www.ncbi.nlm.nih.gov/clinvar/
-- Additional validation: gnomAD, GWAS Catalog, PubMed literature
-- Last updated: February 2026
--
-- This file replaces the original manually curated seed data
-- with clinically validated gene-disease associations from
-- ClinVar's public gene_condition_source_id database.
--
-- IMPORTANT: The hash_value fields are placeholder hex strings.
-- The actual SHA-256 hashes are computed at runtime by the PSI
-- protocol (Web Crypto API), so these placeholder values do not
-- affect PSI computation. They exist only to satisfy the NOT NULL
-- constraint in the database schema.
-- ===================================


-- ===================================
-- Disease 1: Breast Cancer (hospital_test_1)
-- ClinVar: Hereditary breast cancer susceptibility genes
-- Sources: BRCA1/2 (high penetrance), PALB2/ATM/CHEK2 (moderate),
--          CDH1/PTEN/TP53/RAD51C/RAD51D/BARD1 (established panel genes)
-- ===================================

DELETE FROM disease_genes WHERE disease_id = 'disease_breast_cancer_1';

INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_bc_brca1', 'disease_breast_cancer_1', 'BRCA1', 
        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_bc_brca2', 'disease_breast_cancer_1', 'BRCA2', 
        'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_bc_tp53', 'disease_breast_cancer_1', 'TP53', 
        'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_bc_palb2', 'disease_breast_cancer_1', 'PALB2', 
        'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_bc_atm', 'disease_breast_cancer_1', 'ATM', 
        'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_bc_chek2', 'disease_breast_cancer_1', 'CHEK2', 
        'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_bc_cdh1', 'disease_breast_cancer_1', 'CDH1', 
        'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_bc_pten', 'disease_breast_cancer_1', 'PTEN', 
        'b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_bc_rad51c', 'disease_breast_cancer_1', 'RAD51C', 
        'c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_bc_bard1', 'disease_breast_cancer_1', 'BARD1', 
        'd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1', datetime('now'), datetime('now'));
-- Breast Cancer: 3 genes → 10 genes


-- ===================================
-- Disease 2: Type 2 Diabetes (hospital_test_1)
-- ClinVar + GWAS Catalog: Confirmed T2D susceptibility genes
-- Sources: TCF7L2 (strongest), PPARG/KCNJ11 (established),
--          SLC30A8/CDKAL1/CDKN2A/IGF2BP2/HHEX/FTO/ABCC8/HNF4A
-- ===================================

DELETE FROM disease_genes WHERE disease_id = 'disease_diabetes_1';

INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_t2d_tcf7l2', 'disease_diabetes_1', 'TCF7L2', 
        'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_t2d_pparg', 'disease_diabetes_1', 'PPARG', 
        'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_t2d_fto', 'disease_diabetes_1', 'FTO', 
        'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_t2d_kcnj11', 'disease_diabetes_1', 'KCNJ11', 
        'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_t2d_slc30a8', 'disease_diabetes_1', 'SLC30A8', 
        'b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_t2d_cdkal1', 'disease_diabetes_1', 'CDKAL1', 
        'c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_t2d_cdkn2a', 'disease_diabetes_1', 'CDKN2A', 
        'd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_t2d_hhex', 'disease_diabetes_1', 'HHEX', 
        'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_t2d_abcc8', 'disease_diabetes_1', 'ABCC8', 
        'f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_t2d_hnf4a', 'disease_diabetes_1', 'HNF4A', 
        'a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4', datetime('now'), datetime('now'));
-- Type 2 Diabetes: 4 genes → 10 genes


-- ===================================
-- Disease 3: Alzheimer's Disease (hospital_test_1)
-- ClinVar: Alzheimer disease susceptibility and causative genes
-- Sources: APOE (strongest risk), APP/PSEN1/PSEN2 (early-onset),
--          TREM2/SORL1/ABCA7/CLU/BIN1/CR1 (late-onset risk)
-- ===================================

DELETE FROM disease_genes WHERE disease_id = 'disease_alzheimers_1';

INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_alz_apoe', 'disease_alzheimers_1', 'APOE', 
        'd77e33d56f7a3e7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_alz_psen1', 'disease_alzheimers_1', 'PSEN1', 
        'e88f44e67a8b4f8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_alz_psen2', 'disease_alzheimers_1', 'PSEN2', 
        'f99a55f78b9c5a9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_alz_app', 'disease_alzheimers_1', 'APP', 
        'a00b66a89c0d6b0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_alz_trem2', 'disease_alzheimers_1', 'TREM2', 
        'b11c77b90d1e7c1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_alz_sorl1', 'disease_alzheimers_1', 'SORL1', 
        'c22d88c01e2f8d2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_alz_abca7', 'disease_alzheimers_1', 'ABCA7', 
        'd33e99d12f3a9e3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_alz_clu', 'disease_alzheimers_1', 'CLU', 
        'e44f00e23a4b0f4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_alz_bin1', 'disease_alzheimers_1', 'BIN1', 
        'f55a11f34b5c1a5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d', datetime('now'), datetime('now'));
-- Alzheimer's: 4 genes → 9 genes


-- ===================================
-- Disease 4: Cardiovascular Disease (hospital_test_1)
-- ClinVar: Familial hypercholesterolemia and cardiovascular risk genes
-- Sources: LDLR/APOB/PCSK9 (FH causative), APOE/MTHFR/ACE (risk),
--          LPA/NPC1L1/ABCG5/MYBPC3 (additional cardiovascular)
-- ===================================

DELETE FROM disease_genes WHERE disease_id = 'disease_cardiovascular_1';

INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_cvd_apoe', 'disease_cardiovascular_1', 'APOE', 
        'd77e33d56f7a3e7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_cvd_mthfr', 'disease_cardiovascular_1', 'MTHFR', 
        'b11c77b90d1e7c1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_cvd_ace', 'disease_cardiovascular_1', 'ACE', 
        'c22d88c01e2f8d2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_cvd_ldlr', 'disease_cardiovascular_1', 'LDLR', 
        'd33e99d12f3a9e3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_cvd_pcsk9', 'disease_cardiovascular_1', 'PCSK9', 
        'e44f00e23a4b0f4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_cvd_apob', 'disease_cardiovascular_1', 'APOB', 
        'f55a11f34b5c1a5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_cvd_lpa', 'disease_cardiovascular_1', 'LPA', 
        'a66b22a45c6d2b6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_cvd_npc1l1', 'disease_cardiovascular_1', 'NPC1L1', 
        'b77c33b56d7e3c7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_cvd_abcg5', 'disease_cardiovascular_1', 'ABCG5', 
        'c88d44c67e8f4d8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_cvd_mybpc3', 'disease_cardiovascular_1', 'MYBPC3', 
        'd99e55d78f9a5e9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b', datetime('now'), datetime('now'));
-- Cardiovascular Disease: 5 genes → 10 genes


-- ===================================
-- Disease 5: Lung Cancer (hospital_test_1)
-- ClinVar: Lung cancer susceptibility and driver genes
-- Sources: EGFR/KRAS/ALK/ROS1 (driver mutations/targeted therapy),
--          TP53/STK11/BRAF/MET/RET/ERBB2 (additional ClinVar-listed)
-- ===================================

DELETE FROM disease_genes WHERE disease_id = 'disease_lung_cancer_1';

INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_lc_egfr', 'disease_lung_cancer_1', 'EGFR', 
        'f55a11f34b5c1a5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_lc_kras', 'disease_lung_cancer_1', 'KRAS', 
        'a66b22a45c6d2b6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_lc_alk', 'disease_lung_cancer_1', 'ALK', 
        'b77c33b56d7e3c7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_lc_tp53', 'disease_lung_cancer_1', 'TP53', 
        'c00d66c89e0f6d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_lc_ros1', 'disease_lung_cancer_1', 'ROS1', 
        'c88d44c67e8f4d8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_lc_stk11', 'disease_lung_cancer_1', 'STK11', 
        'd99e55d78f9a5e9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_lc_braf', 'disease_lung_cancer_1', 'BRAF', 
        'e00f66e89a0b6f0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_lc_met', 'disease_lung_cancer_1', 'MET', 
        'f11a77f90b1c7a1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_lc_ret', 'disease_lung_cancer_1', 'RET', 
        'a22b88a01c2d8b2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_lc_erbb2', 'disease_lung_cancer_1', 'ERBB2', 
        'b33c99b12d3e9c3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f', datetime('now'), datetime('now'));
-- Lung Cancer: 5 genes → 10 genes


-- ===================================
-- Disease 6: Chronic Inflammatory Disease (hospital_test_1)
-- ClinVar: Chronic inflammation and autoimmune condition genes
-- Sources: TNF/IL6/IL1B/CRP (original), plus NOD2/IL23R/CARD9/
--          HLA-DRB1/PTPN22/STAT3 (ClinVar autoimmune/inflammatory)
-- ===================================

DELETE FROM disease_genes WHERE disease_id = 'disease_inflammatory_1';

INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_inf_tnf', 'disease_inflammatory_1', 'TNF', 
        'd99e55d78f9a5e9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_inf_il6', 'disease_inflammatory_1', 'IL6', 
        'e00f66e89a0b6f0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_inf_il1b', 'disease_inflammatory_1', 'IL1B', 
        'f11a77f90b1c7a1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_inf_crp', 'disease_inflammatory_1', 'CRP', 
        'a22b88a01c2d8b2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_inf_nod2', 'disease_inflammatory_1', 'NOD2', 
        'b33c99b12d3e9c3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_inf_il23r', 'disease_inflammatory_1', 'IL23R', 
        'c44d00c23e4f0d4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_inf_card9', 'disease_inflammatory_1', 'CARD9', 
        'd55e11d34f5a1e5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_inf_ptpn22', 'disease_inflammatory_1', 'PTPN22', 
        'e66f22e45a6b2f6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c', datetime('now'), datetime('now'));
-- Chronic Inflammatory: 4 genes → 8 genes


-- ===================================
-- Disease 7: Obesity Susceptibility (hospital_test_1)
-- ClinVar + GWAS: Obesity and metabolic disorder genes
-- Sources: FTO (strongest GWAS), MC4R/LEPR/POMC/ADRB3 (original),
--          LEP/PCSK1/SIM1/BDNF (ClinVar monogenic/polygenic obesity)
-- ===================================

DELETE FROM disease_genes WHERE disease_id = 'disease_obesity_1';

INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_ob_fto', 'disease_obesity_1', 'FTO', 
        'f33a99f12b3c9a3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_ob_mc4r', 'disease_obesity_1', 'MC4R', 
        'b33c99b12d3e9c3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_ob_lepr', 'disease_obesity_1', 'LEPR', 
        'c44d00c23e4f0d4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_ob_pomc', 'disease_obesity_1', 'POMC', 
        'd55e11d34f5a1e5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_ob_adrb3', 'disease_obesity_1', 'ADRB3', 
        'e66f22e45a6b2f6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_ob_lep', 'disease_obesity_1', 'LEP', 
        'f77a33f56b7c3a7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_ob_pcsk1', 'disease_obesity_1', 'PCSK1', 
        'a88b44a67c8d4b8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_ob_sim1', 'disease_obesity_1', 'SIM1', 
        'b99c55b78d9e5c9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_ob_bdnf', 'disease_obesity_1', 'BDNF', 
        'c00d66c89e0f6d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a', datetime('now'), datetime('now'));
-- Obesity: 5 genes → 9 genes


-- ===================================
-- Disease 8: Colorectal Cancer (hospital_test_1)
-- ClinVar: Lynch syndrome and hereditary colorectal cancer genes
-- Sources: APC (FAP), MLH1/MSH2/MSH6/PMS2 (Lynch syndrome),
--          TP53/SMAD4/BMPR1A/STK11/MUTYH (additional CRC panel genes)
-- ===================================

DELETE FROM disease_genes WHERE disease_id = 'disease_colorectal_1';

INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_crc_apc', 'disease_colorectal_1', 'APC', 
        'f77a33f56b7c3a7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_crc_mlh1', 'disease_colorectal_1', 'MLH1', 
        'a88b44a67c8d4b8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_crc_msh2', 'disease_colorectal_1', 'MSH2', 
        'b99c55b78d9e5c9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_crc_tp53', 'disease_colorectal_1', 'TP53', 
        'c00d66c89e0f6d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_crc_smad4', 'disease_colorectal_1', 'SMAD4', 
        'c99d55c78e9f5d9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_crc_msh6', 'disease_colorectal_1', 'MSH6', 
        'd11e66d89f0a6e0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_crc_pms2', 'disease_colorectal_1', 'PMS2', 
        'e22f77e90a1b7f1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_crc_bmpr1a', 'disease_colorectal_1', 'BMPR1A', 
        'f33a88f01b2c8a2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_crc_stk11', 'disease_colorectal_1', 'STK11', 
        'a44b99a12c3d9b3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_crc_mutyh', 'disease_colorectal_1', 'MUTYH', 
        'b55c00b23d4e0c4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f', datetime('now'), datetime('now'));
-- Colorectal Cancer: 5 genes → 10 genes


-- ===================================
-- EXTRA DISEASES (hospital_test_2 and hospital_test_3)
-- These also get expanded with ClinVar-sourced genes
-- ===================================

-- Disease 9: Hypertrophic Cardiomyopathy (hospital_test_2)
-- ClinVar: HCM causative genes
DELETE FROM disease_genes WHERE disease_id = 'disease_extra_001';

INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_hcm_myh7', 'disease_extra_001', 'MYH7', 
        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', datetime('now', '-150 days'), datetime('now', '-10 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_hcm_mybpc3', 'disease_extra_001', 'MYBPC3', 
        'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', datetime('now', '-150 days'), datetime('now', '-10 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_hcm_tnnt2', 'disease_extra_001', 'TNNT2', 
        'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', datetime('now', '-150 days'), datetime('now', '-10 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_hcm_tpm1', 'disease_extra_001', 'TPM1', 
        'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', datetime('now', '-150 days'), datetime('now', '-10 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_hcm_actc1', 'disease_extra_001', 'ACTC1', 
        'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', datetime('now', '-150 days'), datetime('now', '-10 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_hcm_myl2', 'disease_extra_001', 'MYL2', 
        'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', datetime('now', '-150 days'), datetime('now', '-10 days'));
-- HCM: 2 genes → 6 genes


-- Disease 10: Hereditary Breast Cancer (hospital_test_2)
DELETE FROM disease_genes WHERE disease_id = 'disease_extra_002';

INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_hbc_brca1', 'disease_extra_002', 'BRCA1', 
        'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', datetime('now', '-145 days'), datetime('now', '-8 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_hbc_brca2', 'disease_extra_002', 'BRCA2', 
        'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', datetime('now', '-145 days'), datetime('now', '-8 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_hbc_palb2', 'disease_extra_002', 'PALB2', 
        'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', datetime('now', '-145 days'), datetime('now', '-8 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_hbc_tp53', 'disease_extra_002', 'TP53', 
        'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', datetime('now', '-145 days'), datetime('now', '-8 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_hbc_rad51d', 'disease_extra_002', 'RAD51D', 
        'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8', datetime('now', '-145 days'), datetime('now', '-8 days'));
-- Hereditary Breast Cancer: 2 genes → 5 genes


-- Disease 11: Cystic Fibrosis (hospital_test_2)
DELETE FROM disease_genes WHERE disease_id = 'disease_extra_003';

INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_cf_cftr', 'disease_extra_003', 'CFTR', 
        'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', datetime('now', '-140 days'), datetime('now', '-6 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_cf_scnn1b', 'disease_extra_003', 'SCNN1B', 
        'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', datetime('now', '-140 days'), datetime('now', '-6 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_cf_scnn1a', 'disease_extra_003', 'SCNN1A', 
        'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8', datetime('now', '-140 days'), datetime('now', '-6 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_cf_tgfb1', 'disease_extra_003', 'TGFB1', 
        'b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9', datetime('now', '-140 days'), datetime('now', '-6 days'));
-- Cystic Fibrosis: 1 gene → 4 genes


-- Disease 12: Parkinsons Disease (hospital_test_3)
DELETE FROM disease_genes WHERE disease_id = 'disease_extra_004';

INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_pd_snca', 'disease_extra_004', 'SNCA', 
        'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', datetime('now', '-135 days'), datetime('now', '-5 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_pd_lrrk2', 'disease_extra_004', 'LRRK2', 
        'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8', datetime('now', '-135 days'), datetime('now', '-5 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_pd_park7', 'disease_extra_004', 'PARK7', 
        'b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9', datetime('now', '-135 days'), datetime('now', '-5 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_pd_pink1', 'disease_extra_004', 'PINK1', 
        'c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0', datetime('now', '-135 days'), datetime('now', '-5 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_pd_prkn', 'disease_extra_004', 'PRKN', 
        'd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1', datetime('now', '-135 days'), datetime('now', '-5 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_pd_gba1', 'disease_extra_004', 'GBA1', 
        'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2', datetime('now', '-135 days'), datetime('now', '-5 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_pd_vps35', 'disease_extra_004', 'VPS35', 
        'f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3', datetime('now', '-135 days'), datetime('now', '-5 days'));
-- Parkinsons: 2 genes → 7 genes


-- Disease 13: Alzheimers Disease (hospital_test_3)
DELETE FROM disease_genes WHERE disease_id = 'disease_extra_005';

INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_alz2_apoe', 'disease_extra_005', 'APOE', 
        'b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9', datetime('now', '-130 days'), datetime('now', '-4 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_alz2_psen1', 'disease_extra_005', 'PSEN1', 
        'c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0', datetime('now', '-130 days'), datetime('now', '-4 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_alz2_app', 'disease_extra_005', 'APP', 
        'd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1', datetime('now', '-130 days'), datetime('now', '-4 days'));
INSERT OR IGNORE INTO disease_genes (id, disease_id, gene_symbol, hash_value, created_at, updated_at)
VALUES ('gene_alz2_trem2', 'disease_extra_005', 'TREM2', 
        'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2', datetime('now', '-130 days'), datetime('now', '-4 days'));
-- Alzheimers (hospital_test_3): 1 gene → 4 genes


-- ===================================
-- SUMMARY OF CHANGES
-- ===================================
-- Disease                         | Before | After | Source
-- --------------------------------|--------|-------|--------
-- Breast Cancer                   |    3   |   10  | ClinVar
-- Type 2 Diabetes                 |    4   |   10  | ClinVar + GWAS
-- Alzheimer's Disease             |    4   |    9  | ClinVar
-- Cardiovascular Disease          |    5   |   10  | ClinVar
-- Lung Cancer                     |    5   |   10  | ClinVar
-- Chronic Inflammatory Disease    |    4   |    8  | ClinVar
-- Obesity Susceptibility          |    5   |    9  | ClinVar + GWAS
-- Colorectal Cancer               |    5   |   10  | ClinVar
-- Hypertrophic Cardiomyopathy     |    2   |    6  | ClinVar
-- Hereditary Breast Cancer        |    2   |    5  | ClinVar
-- Cystic Fibrosis                 |    1   |    4  | ClinVar
-- Parkinsons Disease              |    2   |    7  | ClinVar
-- Alzheimers (hospital_test_3)    |    1   |    4  | ClinVar
-- --------------------------------|--------|-------|--------
-- TOTAL                           |   43   |  102  |
-- ===================================
