import { describe, expect, it, beforeEach } from "vitest";
import { utils, write } from "xlsx";
import { clearSession, getConfig, getDataset, getState, loadDataset, predictEmployee, runDescriptive, trainModels } from "./analytics";

const headers = {
  "Gender": "Female", "Your Current Country of Residence": "Myanmar", "Work Setup": "On-site", "Weekly Work Hours": "Under 40 hours",
  "Average Sleep Hours Per Day": "6 - 7 hours", "Years of Work Experience": "1 - 3 years", "Average Monthly Salary / Income": "300,000 - 600,000 MMK",
  "responsibility level": 3, "projects or courses": 2, "mental exhaustion": 3, "personal and family time": 3, "support from peers or management": 3,
  "How burnt out do you feel about going to work every day?": 5, "salary/income adequate": 2, "Cleaned Salary": "300,000 - 600,000 MMK",
};
function fixture(rows = 30) {
  const data = Array.from({ length: rows }, (_, i) => ({ ...headers, "mental exhaustion": (i % 5) + 1, "personal and family time": (i % 5) + 1, "How burnt out do you feel about going to work every day?": (i % 10) + 1 }));
  const wb = utils.book_new(); utils.book_append_sheet(wb, utils.json_to_sheet(data), "Employees");
  return Buffer.from(write(wb, { type: "buffer", bookType: "xlsx" })).toString("base64");
}

describe("employee burnout analytics runtime", () => {
  beforeEach(() => clearSession());
  it("rejects files missing notebook-required columns", () => {
    const wb = utils.book_new(); utils.book_append_sheet(wb, utils.json_to_sheet([{ Gender: "Female" }]), "Employees");
    const result = loadDataset("bad.xlsx", Buffer.from(write(wb, { type: "buffer", bookType: "xlsx" })).toString("base64"));
    expect(result.ok).toBe(false); expect(result.error).toContain("missing required fields"); expect(getDataset()).toBeNull();
  });
  it("loads, imputes, deduplicates, and engineers targets", () => {
    const result = loadDataset("fixture.xlsx", fixture());
    expect(result.ok).toBe(true); expect(getDataset()?.records).toBe(10); expect(getDataset()?.distribution).toHaveLength(3); expect(getState().dataset?.missingValues).toBe(0);
  });
  it("trains selected models and returns runtime evaluation", () => {
    loadDataset("fixture.xlsx", fixture());
    const result = trainModels({ target: "burnout", experiment: "baseline", augmentation: "none", models: ["Random Forest", "Logistic Regression"] });
    expect(result?.selectedModels).toEqual(["Random Forest", "Logistic Regression"]); expect(result?.metrics?.["Random Forest"]?.confusion).toHaveLength(3); expect(result?.metrics?.["Random Forest"]?.cv?.folds.length).toBeGreaterThan(0);
    const prediction = predictEmployee({ model: "Random Forest", values: { weeklyHours: 2, projects: 2, responsibility: 3, experience: 2, sleepHours: 3, exhaustion: 3, personalTime: 3, support: 3, salaryAdequacy: 2, cleanedSalary: "300,000 - 600,000 MMK", burnoutScore: 5 } });
    expect(["Low", "Medium", "High"]).toContain(prediction.label); expect(prediction.probabilities).toHaveLength(3);
  });
  it("exposes the complete supplied benchmark matrix", () => {
    expect(getConfig().experiments).toEqual(["baseline", "experiment1", "experiment2", "cross_validation"]);
    loadDataset("fixture.xlsx", fixture());
    const result = trainModels({ target: "burnout", experiment: "experiment1", augmentation: "bootstrap", models: ["Random Forest", "Decision Tree", "Logistic Regression"] });
    expect(result?.referenceMethod).toBe("Experiment 1 - Bootstrap");
    expect(result?.referenceResults?.["Experiment 1 - Bootstrap"]).toEqual([94.19, 90.70, 69.77]);
    expect(result?.referenceResults?.["Cross-Validation - Bootstrap"]).toEqual([60.00, 52.27, 59.55]);
  });
  it("runs clustering and association analysis from the processed rows", () => {
    loadDataset("fixture.xlsx", fixture());
    const result = runDescriptive({ support: 0.1, confidence: 0.5 });
    expect(result.finalK).toBe(2); expect(result.kAnalysis.length).toBeGreaterThan(0); expect(result.profiles).toHaveLength(2); expect(result.association).toHaveProperty("rules");
  });
});
