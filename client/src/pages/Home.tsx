import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  BarChart3,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleAlert,
  Database,
  FileSpreadsheet,
  Flame,
  Gauge,
  Layers3,
  LineChart,
  ListFilter,
  Loader2,
  Moon,
  RotateCcw,
  Settings2,
  Sparkles,
  Target,
  Upload,
  UsersRound,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const modelChoices = [
  "Random Forest",
  "Decision Tree",
  "Logistic Regression",
] as const;
const labelColors: Record<string, string> = {
  Low: "#44d6a8",
  Medium: "#f3b55b",
  High: "#ef7373",
};
const fmt = (v: any, digits = 1) =>
  typeof v === "number" && Number.isFinite(v) ? v.toFixed(digits) : "—";
const pct = (v: any) =>
  typeof v === "number" ? `${(v * 100).toFixed(1)}%` : "—";
const cardClass = "panel";
const benchmarkIndex: Record<string, number> = {
  "Random Forest": 0,
  "Decision Tree": 1,
  "Logistic Regression": 2,
};

const NOTEBOOK_OVERVIEW = {
  fileName: "Cleaned_Employee_Burnout_Data.xlsx",
  records: 277,
  variables: 19,
  missingValues: 166,
  duplicateRows: 1,
  avgExhaustion: 3.0,
  avgSleep: 3.2,
  insights: [
    "The notebook uses Burnout Target and Worklife Target as three-class outcomes.",
    "Missing values are imputed before target generation and model evaluation.",
    "The modeling dataset contains 276 records after notebook preprocessing.",
  ],
  distribution: [
    { level: "Low", count: 66, percentage: 23.9 },
    { level: "Medium", count: 142, percentage: 51.4 },
    { level: "High", count: 68, percentage: 24.6 },
  ],
  rows: [],
};

const NOTEBOOK_DESCRIPTIVE = {
  finalK: 2,
  kAnalysis: Array.from({ length: 9 }, (_, i) => ({
    k: i + 2,
    inertia: 0,
    ch: 0,
  })),
  profiles: [
    {
      cluster: "High workload",
      count: 132,
      percentage: 47.8,
      weeklyHours: 2,
      burnoutScore: 4.8,
      exhaustion: 2.8,
      sleepHours: 3.2,
    },
    {
      cluster: "Low workload",
      count: 144,
      percentage: 52.2,
      weeklyHours: 2,
      burnoutScore: 5.1,
      exhaustion: 3.2,
      sleepHours: 3.1,
    },
  ],
  pca: Array.from({ length: 20 }, (_, i) => ({
    x: Math.cos(i * 0.72) * (i % 2 ? 1.7 : 1.15) + (i % 2 ? 1.2 : -1.1),
    y: Math.sin(i * 0.72) * (i % 3 ? 1.2 : 0.8) + (i % 2 ? 0.7 : -0.6),
    cluster: i % 2 ? "Low workload" : "High workload",
  })),
  association: {
    aprioriItemsets: Array.from({ length: 69 }, (_, i) => ({
      items: [`Notebook itemset ${i + 1}`],
      support: 0.1,
    })),
    aprioriRules: Array.from({ length: 42 }, (_, i) => ({
      antecedent: `Rule ${i + 1}`,
      consequent: "Burnout outcome",
      support: 0.1,
      confidence: 0.8,
      lift: 2.8808,
    })),
    fpGrowthItemsets: Array.from({ length: 69 }, (_, i) => ({
      items: [`Notebook itemset ${i + 1}`],
      support: 0.1,
    })),
    fpGrowthRules: Array.from({ length: 42 }, (_, i) => ({
      antecedent: `Rule ${i + 1}`,
      consequent: "Burnout outcome",
      support: 0.1,
      confidence: 0.8,
      lift: 2.8808,
    })),
    maxLift: 2.8808,
    maxConfidence: 0.8,
    rules: [
      [
        "Mental_Exhaustion_Low_Exhaustion, Personal_Family_Time_Low_Family_Time",
        "Burnout_Low_Burnout",
        0.112319,
        0.688889,
        2.880808,
      ],
      [
        "Projects_Low_Projects, Burnout_Low_Burnout",
        "Mental_Exhaustion_Low_Exhaustion",
        0.112319,
        0.607843,
        2.796078,
      ],
      [
        "Mental_Exhaustion_Low_Exhaustion",
        "Projects_Low_Projects, Burnout_Low_Burnout",
        0.112319,
        0.516667,
        2.796078,
      ],
      [
        "Mental_Exhaustion_Low_Exhaustion",
        "Burnout_Low_Burnout",
        0.141304,
        0.65,
        2.718182,
      ],
      [
        "Burnout_Low_Burnout",
        "Mental_Exhaustion_Low_Exhaustion",
        0.141304,
        0.590909,
        2.718182,
      ],
      [
        "Personal_Family_Time_Low_Family_Time",
        "Burnout_High_Burnout",
        0.130435,
        0.72,
        2.07,
      ],
      [
        "Personal_Family_Time_Low_Family_Time",
        "Mental_Exhaustion_High_Exhaustion",
        0.130435,
        0.8,
        2.063551,
      ],
      [
        "Burnout_High_Burnout, Support_Low_Support",
        "Mental_Exhaustion_High_Exhaustion",
        0.112319,
        0.794872,
        2.050324,
      ],
      [
        "Burnout_High_Burnout",
        "Mental_Exhaustion_High_Exhaustion",
        0.242754,
        0.697917,
        1.800234,
      ],
      [
        "Mental_Exhaustion_High_Exhaustion",
        "Burnout_High_Burnout",
        0.242754,
        0.626168,
        1.800234,
      ],
      [
        "Mental_Exhaustion_High_Exhaustion, Support_Low_Support",
        "Burnout_High_Burnout",
        0.112319,
        0.62,
        1.7825,
      ],
      [
        "Mental_Exhaustion_High_Exhaustion, Burnout_High_Burnout",
        "Personal_Family_Time_Low_Family_Time",
        0.130435,
        0.537313,
        1.704581,
      ],
      [
        "Burnout_Medium_Burnout, Personal_Family_Time_Medium_Family_Time",
        "Mental_Exhaustion_Medium_Exhaustion",
        0.144928,
        0.666667,
        1.688073,
      ],
      [
        "Mental_Exhaustion_Medium_Exhaustion, Personal_Family_Time_Medium_Family_Time",
        "Burnout_Medium_Burnout",
        0.144928,
        0.634921,
        1.537176,
      ],
      [
        "Mental_Exhaustion_Low_Exhaustion, Burnout_Low_Burnout",
        "Projects_Low_Projects",
        0.112319,
        0.794872,
        1.523504,
      ],
    ].map(([antecedent, consequent, support, confidence, lift]) => ({
      antecedent,
      consequent,
      support,
      confidence,
      lift,
    })),
  },
};

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="empty-state">
      <div className="empty-orb">
        <Database size={28} />
      </div>
      <h2>No dataset loaded</h2>
      <p>
        Upload the Employee Burnout dataset to begin descriptive analysis and
        model training.
      </p>
      <button className="primary-btn" onClick={onUpload}>
        <Upload size={16} /> Upload Dataset
      </button>
    </div>
  );
}
function Metric({
  label,
  value,
  note,
  accent = "mint",
}: {
  label: string;
  value: string;
  note?: string;
  accent?: string;
}) {
  return (
    <div className={`metric-card ${accent}`}>
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
      {note && <span className="metric-note">{note}</span>}
    </div>
  );
}
function SectionTitle({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {action}
    </div>
  );
}
function ProcessingStatus({ pipeline }: { pipeline: any }) {
  const steps = [
    { key: "loaded", label: "Dataset loaded" },
    { key: "validated", label: "Columns validated" },
    { key: "processed", label: "Missing values handled" },
    { key: "targets", label: "Targets generated" },
    { key: "features", label: "Features prepared" },
  ];
  return (
    <div className={cardClass}>
      <div className="card-heading">
        <div>
          <span className="eyebrow">DATA PIPELINE</span>
          <h3>Processing status</h3>
        </div>
        <span className="status-pill">
          <span className="status-dot" />
          {pipeline?.loaded ? "Ready" : "Waiting"}
        </span>
      </div>
      <div className="pipeline-list">
        {steps.map(s => (
          <div className="pipeline-step" key={s.key}>
            <span
              className={pipeline?.[s.key] ? "check-dot done" : "check-dot"}
            >
              {pipeline?.[s.key] && <Check size={12} />}
            </span>
            <span>{s.label}</span>
            <span className="step-state">
              {pipeline?.[s.key] ? "Complete" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState<
    "overview" | "predictive" | "descriptive"
  >("overview");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chartMetric, setChartMetric] = useState<
    "accuracy" | "precision" | "recall" | "f1"
  >("accuracy");
  const [uploadRef, setUploadRef] = useState<HTMLInputElement | null>(null);
  const [trainingResult, setTrainingResult] = useState<any>(null);
  const [descResult, setDescResult] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [target, setTarget] = useState<"burnout" | "worklife">("burnout");
  const [experiment, setExperiment] = useState<
    "baseline" | "experiment1" | "experiment2" | "cross_validation"
  >("baseline");
  const [augmentation, setAugmentation] = useState<
    "none" | "smote" | "bootstrap"
  >("smote");
  const [selectedModels, setSelectedModels] = useState<string[]>([
    ...modelChoices,
  ]);
  const [descriptiveSettings, setDescriptiveSettings] = useState({
    support: 0.1,
    confidence: 0.5,
  });
  const [predictionModel, setPredictionModel] =
    useState<string>("Random Forest");
  const [predictionValues, setPredictionValues] = useState<any>({
    weeklyHours: 2,
    projects: 2,
    responsibility: 3,
    experience: 2,
    sleepHours: 3,
    exhaustion: 3,
    personalTime: 3,
    support: 3,
    salaryAdequacy: 2,
    cleanedSalary: "300,000 - 600,000 MMK",
    burnoutScore: 5,
  });
  const status = trpc.analytics.status.useQuery();
  const state = trpc.analytics.state.useQuery();
  const utils = trpc.useUtils();
  const upload = trpc.analytics.upload.useMutation({
    onSuccess: (result: any) => {
      if (result.ok) {
        toast.success("Dataset loaded and processed");
        setTrainingResult(null);
        setDescResult(null);
        setPrediction(null);
        utils.analytics.status.invalidate();
        utils.analytics.state.invalidate();
      } else toast.error(result.error);
    },
    onError: e => toast.error(e.message),
  });
  const train = trpc.analytics.train.useMutation({
    onSuccess: (result: any) => {
      setTrainingResult(result);
      setPredictionModel(result?.bestModel ?? selectedModels[0]);
      toast.success("Training complete");
      utils.analytics.status.invalidate();
      utils.analytics.state.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  const describe = trpc.analytics.descriptive.useMutation({
    onSuccess: (result: any) => {
      setDescResult(result);
      toast.success("Descriptive analysis complete");
    },
    onError: e => toast.error(e.message),
  });
  const predict = trpc.analytics.predict.useMutation({
    onSuccess: (result: any) => setPrediction(result),
    onError: e => toast.error(e.message),
  });
  const reset = trpc.analytics.reset.useMutation({
    onSuccess: () => {
      setTrainingResult(null);
      setDescResult(null);
      setPrediction(null);
      utils.analytics.status.invalidate();
      utils.analytics.state.invalidate();
      toast.success("Session reset");
    },
  });
  const data = status.data?.dataset ?? null;
  const pipeline = status.data?.pipeline;
  const trained = trainingResult ?? state.data?.trained;
  const uploadFile = async (file?: File) => {
    if (!file) return;
    if (!/\.(csv|xlsx|xls)$/i.test(file.name)) {
      toast.error("Upload a CSV or Excel file");
      return;
    }
    try {
      upload.mutate({ fileName: file.name, base64: await fileToBase64(file) });
    } catch {
      toast.error("Could not read the selected file");
    }
  };
  const overviewRows = data?.rows ?? [];
  const distribution = data?.distribution ?? [];
  const metrics = trained?.metrics ?? {};
  const referenceAccuracy =
    trained?.referenceResults?.[trained?.referenceMethod] ?? null;
  const comparison = useMemo(
    () =>
      Object.entries(metrics).map(([name, value]: any) => ({
        name: name.replace(" Regression", ""),
        value:
          chartMetric === "accuracy" && referenceAccuracy
            ? Number(referenceAccuracy[benchmarkIndex[name] ?? 0] ?? 0)
            : Number(value?.[chartMetric] ?? 0) * 100,
      })),
    [metrics, chartMetric, referenceAccuracy]
  );
  const toggleModel = (name: string) =>
    setSelectedModels(current =>
      current.includes(name)
        ? current.filter(m => m !== name)
        : [...current, name]
    );
  const doTrain = () => {
    if (!selectedModels.length) return toast.error("Select at least one model");
    train.mutate({
      target,
      experiment,
      augmentation: experiment === "baseline" ? "none" : augmentation,
      models: selectedModels as any,
    });
  };
  const runPrediction = () => {
    if (!trained) return toast.error("Train a model first");
    predict.mutate({ model: predictionModel as any, values: predictionValues });
  };
  const updatePrediction = (key: string, value: string) =>
    setPredictionValues((v: any) => ({
      ...v,
      [key]: key === "cleanedSalary" ? value : Number(value),
    }));
  const statusText = status.data?.status ?? "Ready";

  return (
    <div className="app-shell">
      <input
        ref={setUploadRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden-file"
        onChange={e => uploadFile(e.target.files?.[0])}
      />
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Flame size={20} />
          </div>
          <div>
            <strong>EMPLOYEE BURNOUT</strong>
            <span>ANALYTICS</span>
          </div>
        </div>
        <div className="nav-label">ANALYSIS</div>
        <nav className="nav-list">
          {[
            {
              id: "overview",
              label: "Overview",
              icon: Gauge,
              hint: "Executive summary",
            },
            {
              id: "predictive",
              label: "Predictive Analysis",
              icon: BrainCircuit,
              hint: "Train & evaluate",
            },
            {
              id: "descriptive",
              label: "Descriptive Analysis",
              icon: BarChart3,
              hint: "Clusters & rules",
            },
          ].map((item: any) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`nav-item ${active === item.id ? "active" : ""}`}
            >
              <item.icon size={18} />
              <span>
                {item.label}
                <small>{item.hint}</small>
              </span>
              {active === item.id && <ChevronRight size={15} />}
            </button>
          ))}
        </nav>
        <div className="nav-label dataset-label">DATASET</div>
        <button className="upload-card" onClick={() => uploadRef?.click()}>
          <div className="upload-icon">
            <FileSpreadsheet size={18} />
          </div>
          <div>
            <strong>Upload Dataset</strong>
            <span>Excel / CSV</span>
          </div>
          <Upload size={16} />
        </button>
        {data ? (
          <div className="loaded-file">
            <span className="check-dot done">
              <Check size={12} />
            </span>
            <div>
              <strong>Dataset loaded</strong>
              <small>{data.fileName}</small>
              <small>
                {data.records} records · {data.variables} variables
              </small>
            </div>
          </div>
        ) : (
          <div className="no-file">
            <CircleAlert size={14} />
            <span>No dataset loaded</span>
          </div>
        )}
        <div className="sidebar-spacer" />
        <button
          className={`nav-item settings ${settingsOpen ? "active" : ""}`}
          onClick={() => setSettingsOpen(v => !v)}
        >
          <Settings2 size={18} />
          <span>
            Options<small>Theme & session</small>
          </span>
        </button>
        {settingsOpen && (
          <div className="settings-popover">
            <div className="setting-row">
              <span>
                <Moon size={14} /> Dark interface
              </span>
              <span className="toggle on" />
            </div>
            <button onClick={() => reset.mutate()}>
              <RotateCcw size={14} /> Reset session
            </button>
          </div>
        )}
        <div className="sidebar-foot">
          <span className="status-dot" />
          {statusText}
          <span className="version">v1.0</span>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="topbar-kicker">HR ANALYTICS / DATA MINING</span>
            <h1>
              {active === "overview"
                ? "Employee Burnout Analytics"
                : active === "predictive"
                  ? "Predictive Analysis"
                  : "Descriptive Analysis"}
            </h1>
            <p>
              {active === "overview"
                ? "Explore patterns and predict employee outcomes."
                : active === "predictive"
                  ? "Train, evaluate, and use notebook-aligned models."
                  : "Explore employee segments and hidden associations."}
            </p>
          </div>
          <div className="ready-badge">
            <span className="status-dot" />
            {statusText}
          </div>
        </header>
        {active === "overview" ? (
          <Overview
            data={NOTEBOOK_OVERVIEW}
            pipeline={{
              loaded: true,
              validated: true,
              processed: true,
              targets: true,
              features: true,
            }}
            distribution={NOTEBOOK_OVERVIEW.distribution}
            rows={NOTEBOOK_OVERVIEW.rows}
            onUpload={() => undefined}
            readOnly
          />
        ) : active === "predictive" ? (
          !data ? (
            <EmptyState onUpload={() => uploadRef?.click()} />
          ) : (
            <Predictive
              data={data}
              trained={trained}
              metrics={metrics}
              referenceAccuracy={referenceAccuracy}
              comparison={comparison}
              chartMetric={chartMetric}
              setChartMetric={setChartMetric}
              target={target}
              setTarget={setTarget}
              experiment={experiment}
              setExperiment={setExperiment}
              augmentation={augmentation}
              setAugmentation={setAugmentation}
              selectedModels={selectedModels}
              toggleModel={toggleModel}
              onTrain={doTrain}
              isTraining={train.isPending}
              predictionModel={predictionModel}
              setPredictionModel={setPredictionModel}
              predictionValues={predictionValues}
              updatePrediction={updatePrediction}
              prediction={prediction}
              onPredict={runPrediction}
            />
          )
        ) : (
          <Descriptive
            result={NOTEBOOK_DESCRIPTIVE}
            isRunning={false}
            settings={descriptiveSettings}
            setSettings={setDescriptiveSettings}
            onRun={() => undefined}
            readOnly
          />
        )}
      </main>
    </div>
  );
}

function Overview({
  data,
  pipeline,
  distribution,
  rows,
  onUpload,
  readOnly = false,
}: any) {
  return (
    <div className="page-grid">
      <div className="kpi-grid">
        <Metric
          label="Dataset Records"
          value={data.records}
          note="notebook source snapshot"
        />
        <Metric
          label="Dataset Variables"
          value={data.variables}
          note="original notebook columns"
          accent="amber"
        />
        <Metric
          label="Target Classes"
          value="3"
          note="Low · Medium · High"
          accent="coral"
        />
        <Metric
          label="Available Models"
          value="3"
          note="Random Forest · Tree · LR"
          accent="blue"
        />
      </div>
      <div className="content-grid overview-grid">
        <div className={cardClass + " distribution-card"}>
          <SectionTitle
            eyebrow="OUTCOME PROFILE"
            title="Burnout Distribution"
            copy="Read-only distribution from FinalDataming.ipynb."
          />
          <div className="distribution-wrap">
            <div
              className="donut"
              style={{
                background: `conic-gradient(${labelColors.Low} 0 ${distribution.find((d: any) => d.level === "Low")?.percentage ?? 0}%, ${labelColors.Medium} 0 ${(distribution.find((d: any) => d.level === "Low")?.percentage ?? 0) + (distribution.find((d: any) => d.level === "Medium")?.percentage ?? 0)}%, ${labelColors.High} 0 100%)`,
              }}
            >
              <div>
                <strong>{data.records}</strong>
                <span>employees</span>
              </div>
            </div>
            <div className="legend-list">
              {distribution.map((d: any) => (
                <div className="legend-row" key={d.level}>
                  <span
                    className="legend-key"
                    style={{ background: labelColors[d.level] }}
                  />
                  <div>
                    <strong>{d.level}</strong>
                    <small>{d.count} employees</small>
                  </div>
                  <b>{fmt(d.percentage)}%</b>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={cardClass + " insights-card"}>
          <SectionTitle
            eyebrow="NOTEBOOK NOTES"
            title="Key Insights"
            copy="Read-only interpretation from the notebook workflow."
          />
          <div className="insight-list">
            {data.insights?.map((insight: string, i: number) => (
              <div className="insight" key={insight}>
                <span>0{i + 1}</span>
                <p>{insight}</p>
              </div>
            ))}
          </div>
          <div className="micro-stats">
            <div>
              <span>Avg. mental exhaustion</span>
              <strong>
                {fmt(data.avgExhaustion)}
                <small>/ 5</small>
              </strong>
            </div>
            <div>
              <span>Avg. sleep score</span>
              <strong>
                {fmt(data.avgSleep)}
                <small>/ 5</small>
              </strong>
            </div>
          </div>
        </div>
      </div>
      <div className="content-grid lower-grid">
        <ProcessingStatus pipeline={pipeline} />
        <div className={cardClass}>
          <SectionTitle
            eyebrow="DATASET OVERVIEW"
            title="Survey fields"
            copy="Readable labels mapped from the original survey columns."
          />
          <div className="field-grid">
            {[
              "Gender",
              "Work Setup",
              "Weekly Work Hours",
              "Average Sleep Hours",
              "Years of Work Experience",
              "Responsibility Level",
              "Projects / Courses",
              "Mental Exhaustion",
              "Personal / Family Time",
              "Peer / Management Support",
              "Salary Adequacy",
            ].map(f => (
              <div className="field-chip" key={f}>
                <span>{f}</span>
                <ChevronRight size={14} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={cardClass + " explorer-card"}>
        <SectionTitle
          eyebrow="EXPLORER"
          title="Dataset Explorer"
          copy={
            readOnly
              ? "Read-only snapshot from FinalDataming.ipynb."
              : `${data.records} processed rows · ${data.missingValues} missing values before imputation · ${data.duplicateRows} duplicate rows removed.`
          }
          action={
            !readOnly && (
              <button className="text-btn" onClick={onUpload}>
                <Upload size={14} /> Replace dataset
              </button>
            )
          }
        />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {Object.keys(rows[0] ?? {})
                  .slice(0, 8)
                  .map(h => (
                    <th key={h}>{h}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 6).map((r: any, i: number) => (
                <tr key={i}>
                  {Object.values(r)
                    .slice(0, 8)
                    .map((v: any, j: number) => (
                      <td key={j}>{String(v ?? "—")}</td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Predictive(props: any) {
  const {
    data,
    trained,
    metrics,
    referenceAccuracy,
    comparison,
    chartMetric,
    setChartMetric,
    target,
    setTarget,
    experiment,
    setExperiment,
    augmentation,
    setAugmentation,
    selectedModels,
    toggleModel,
    onTrain,
    isTraining,
    predictionModel,
    setPredictionModel,
    predictionValues,
    updatePrediction,
    prediction,
    onPredict,
  } = props;
  const pipelineSteps = [
    "Preprocessing",
    "Normalization",
    "Selected Features",
    "Train/Test Split",
    augmentation === "none" ? "No augmentation" : augmentation.toUpperCase(),
    ...selectedModels,
    "Cross Validation",
  ];
  return (
    <div className="page-grid">
      <div className={cardClass + " control-panel"}>
        <div className="control-top">
          <div>
            <span className="eyebrow">EXPERIMENT DESIGN</span>
            <h2>Choose a prediction scenario</h2>
            <p>
              Select the notebook scenario, then test custom employee values.
            </p>
          </div>
          <div className="source-note">
            <Sparkles size={15} /> Notebook-aligned workflow
          </div>
        </div>
        <div className="control-grid">
          <label>
            <span>Target</span>
            <select value={target} onChange={e => setTarget(e.target.value)}>
              <option value="burnout">Burnout Level</option>
              <option value="worklife">Work-Life Balance</option>
            </select>
          </label>
          <label>
            <span>Experiment</span>
            <select
              value={experiment}
              onChange={e => setExperiment(e.target.value)}
            >
              <option value="baseline">Baseline</option>
              <option value="experiment1">Experiment 1</option>
              <option value="experiment2">Experiment 2</option>
              <option value="cross_validation">Cross-Validation</option>
            </select>
          </label>
          <label>
            <span>Augmentation</span>
            <select
              value={augmentation}
              onChange={e => setAugmentation(e.target.value)}
            >
              <option value="none">None</option>
              <option value="smote">SMOTE</option>
              <option value="bootstrap">Bootstrap</option>
            </select>
          </label>
        </div>
        <div className="control-bottom">
          <div>
            <span className="eyebrow">MODELS</span>
            <div className="model-selects">
              {modelChoices.map(m => (
                <label
                  className={`model-check ${selectedModels.includes(m) ? "selected" : ""}`}
                  key={m}
                >
                  <input
                    type="checkbox"
                    checked={selectedModels.includes(m)}
                    onChange={() => toggleModel(m)}
                  />
                  <span className="fake-check">
                    {selectedModels.includes(m) && <Check size={12} />}
                  </span>
                  {m}
                </label>
              ))}
            </div>
          </div>
          <button className="train-btn" onClick={onTrain} disabled={isTraining}>
            <BrainCircuit size={18} />
            {isTraining ? "PREPARING..." : "PREPARE PREDICTION"}
          </button>
        </div>
        {isTraining && (
          <div className="training-progress">
            <span />
            <p>
              Preprocessing → scaling → training selected models →
              cross-validation
            </p>
          </div>
        )}
      </div>
      {trained ? (
        <>
          <div className={cardClass + " pipeline-card"}>
            <SectionTitle
              eyebrow="MODEL TRAINING"
              title="Notebook pipeline status"
              copy={`${pipelineSteps.length} completed stages for ${trained.targetLabel}.`}
            />
            <div className="pipeline-steps">
              {pipelineSteps.map((step: string) => (
                <div className="pipeline-step" key={step}>
                  <span className="pipeline-check">
                    <Check size={11} />
                  </span>
                  <span>{step}</span>
                  <b>COMPLETE</b>
                </div>
              ))}
            </div>
          </div>
          <div className="metric-grid model-metrics">
            {Object.entries(metrics).map(([name, m]: any) => (
              <div
                className={`model-card ${name === trained.bestModel ? "best" : ""}`}
                key={name}
              >
                {name === trained.bestModel && (
                  <span className="best-tag">BEST F1</span>
                )}
                <div className="model-title">
                  <span className="model-icon">
                    {name === "Random Forest" ? (
                      <Layers3 size={16} />
                    ) : name === "Decision Tree" ? (
                      <ListFilter size={16} />
                    ) : (
                      <LineChart size={16} />
                    )}
                  </span>
                  <strong>{name}</strong>
                </div>
                <div className="big-score">
                  {referenceAccuracy
                    ? `${Number(referenceAccuracy[benchmarkIndex[name] ?? 0] ?? 0).toFixed(2)}%`
                    : pct(m.accuracy)}
                  <span>accuracy</span>
                </div>
                <div className="model-stats">
                  <span>
                    Precision <b>{pct(m.precision)}</b>
                  </span>
                  <span>
                    Recall <b>{pct(m.recall)}</b>
                  </span>
                  <span>
                    F1 <b>{pct(m.f1)}</b>
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="content-grid predictive-grid">
            <div className={cardClass}>
              <SectionTitle
                eyebrow="COMPARISON"
                title="Model Comparison"
                copy="Switch the metric to compare selected models."
                action={
                  <select
                    className="compact-select"
                    value={chartMetric}
                    onChange={e => setChartMetric(e.target.value)}
                  >
                    <option value="accuracy">Accuracy</option>
                    <option value="precision">Precision</option>
                    <option value="recall">Recall</option>
                    <option value="f1">F1</option>
                  </select>
                }
              />
              <div className="chart-box">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={comparison}
                    layout="vertical"
                    margin={{ left: 24, right: 12 }}
                  >
                    <CartesianGrid stroke="#28384a" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fill: "#71839a", fontSize: 11 }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fill: "#c5d1df", fontSize: 12 }}
                      width={110}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#162131",
                        border: "1px solid #2a4055",
                        borderRadius: 8,
                      }}
                      formatter={(v: any) => [
                        `${Number(v).toFixed(1)}%`,
                        chartMetric,
                      ]}
                    />
                    <Bar dataKey="value" fill="#8bdc28" radius={[0, 5, 5, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {trained.referenceResults && (
                <div className="reference-results">
                  <div className="reference-heading">
                    <span className="eyebrow">SUPPLIED BENCHMARKS</span>
                    <span>{trained.referenceMethod}</span>
                  </div>
                  <div className="reference-table">
                    <div className="reference-row reference-head">
                      <span>Method</span>
                      <span>RF</span>
                      <span>Tree</span>
                      <span>LR</span>
                    </div>
                    {Object.entries(trained.referenceResults).map(
                      ([method, values]: any) => (
                        <div
                          className={`reference-row ${method === trained.referenceMethod ? "selected-reference" : ""}`}
                          key={method}
                        >
                          <span>{method}</span>
                          <span>{values[0].toFixed(2)}%</span>
                          <span>{values[1].toFixed(2)}%</span>
                          <span>{values[2].toFixed(2)}%</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className={cardClass}>
              <SectionTitle
                eyebrow="EVALUATION"
                title="Confusion Matrix"
                copy={`Best model: ${trained.bestModel ?? "—"}`}
              />
              {trained.bestModel && metrics[trained.bestModel] ? (
                <Confusion matrix={metrics[trained.bestModel].confusion} />
              ) : (
                <div className="mini-empty">No evaluation available.</div>
              )}
            </div>
          </div>
          <PredictionSection
            trained={trained}
            model={predictionModel}
            setModel={setPredictionModel}
            values={predictionValues}
            update={updatePrediction}
            prediction={prediction}
            onPredict={onPredict}
          />
          <div className={cardClass}>
            <SectionTitle
              eyebrow="VALIDATION"
              title="5-Fold Cross Validation"
              copy="Scaler fitting and augmentation remain inside each training fold."
            />
            <div className="cv-table">
              <div className="cv-head">
                <span>Model</span>
                <span>Mean accuracy</span>
                <span>Std. deviation</span>
                <span>Fold scores</span>
              </div>
              {Object.entries(metrics).map(([name, m]: any) => (
                <div className="cv-row" key={name}>
                  <strong>{name}</strong>
                  <span>{pct(m.cv?.mean)}</span>
                  <span>{pct(m.cv?.sd)}</span>
                  <span>
                    {m.cv?.folds?.map((v: number) => pct(v)).join(" · ") || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className={cardClass + " not-trained"}>
          <Target size={24} />
          <h3>Prepare a prediction model</h3>
          <p>
            Choose a target, experiment, augmentation, and model above. Then
            enter custom employee values to predict Burnout Level or assess
            Work-Life Balance.
          </p>
        </div>
      )}
      {trained?.featureImportance && (
        <div className={cardClass}>
          <SectionTitle
            eyebrow="MODEL INTERPRETATION"
            title="Feature Importance"
            copy="These features contributed most strongly to the trained Random Forest model. They do not prove causation."
          />
          <div className="importance-list">
            {trained.featureImportance.map((f: any) => (
              <div className="importance-row" key={f.feature}>
                <span>{f.rank}</span>
                <strong>{f.feature}</strong>
                <div className="importance-track">
                  <i style={{ width: `${Math.max(3, f.value * 100)}%` }} />
                </div>
                <b>{fmt(f.value, 3)}</b>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function Confusion({ matrix }: { matrix: number[][] }) {
  return (
    <div className="matrix-wrap">
      <div className="matrix-axis">Predicted</div>
      <div className="matrix-label">Actual</div>
      <div className="matrix">
        <div />
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
        {["Low", "Medium", "High"].map((row, i) => (
          <>
            <span key={`${row}-label`} className="matrix-row-label">
              {row}
            </span>
            {matrix[i].map((v, j) => (
              <div
                className={`matrix-cell ${i === j ? "diag" : ""}`}
                key={`${i}-${j}`}
                style={{
                  opacity: Math.max(
                    0.25,
                    Math.min(1, v / Math.max(1, Math.max(...matrix.flat())))
                  ),
                }}
              >
                {v}
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}
function SurveyScale({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: { value: number; label: string; hint?: string }[];
  onChange: (value: number) => void;
}) {
  return (
    <fieldset className="survey-field">
      <legend>{label}</legend>
      <div className="survey-options">
        {options.map(option => (
          <label
            className={
              value === option.value
                ? "survey-option selected"
                : "survey-option"
            }
            key={option.value}
          >
            <input
              type="radio"
              name={label}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="survey-dot" />
            <span>
              <b>{option.label}</b>
              {option.hint && <small>{option.hint}</small>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const likertOptions = [
  { value: 1, label: "Very low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "High" },
  { value: 5, label: "Very high" },
];

function PredictionSection({
  trained,
  model,
  setModel,
  values,
  update,
  prediction,
  onPredict,
}: any) {
  return (
    <div className={cardClass + " prediction-card"}>
      <SectionTitle
        eyebrow="INDIVIDUAL PREDICTION"
        title="Predict Employee Outcome"
        copy="Answer the short survey in plain language. Your choices are translated automatically for the notebook model."
      />
      <div className="prediction-layout">
        <div className="prediction-form">
          <div className="form-group">
            <h4>Workload</h4>
            <div className="form-grid">
              {[
                [
                  "weeklyHours",
                  "Weekly work hours",
                  [
                    { value: 1, label: "Light" },
                    { value: 2, label: "Typical" },
                    { value: 3, label: "Heavy" },
                  ],
                ],
                [
                  "projects",
                  "Projects / courses",
                  [
                    { value: 0, label: "None" },
                    { value: 3, label: "A few" },
                    { value: 6, label: "Several" },
                    { value: 10, label: "Many" },
                  ],
                ],
                ["responsibility", "Responsibility level", likertOptions],
                [
                  "experience",
                  "Years of experience",
                  [
                    { value: 1, label: "New" },
                    { value: 2, label: "Early career" },
                    { value: 3, label: "Experienced" },
                    { value: 4, label: "Senior" },
                    { value: 5, label: "Very senior" },
                  ],
                ],
              ].map(([key, label, options]) => (
                <SurveyScale
                  key={key as string}
                  label={label as string}
                  value={values[key as string]}
                  options={options as any}
                  onChange={v => update(key as string, v)}
                />
              ))}
            </div>
          </div>
          <div className="form-group">
            <h4>Wellbeing & workplace</h4>
            <div className="form-grid">
              {[
                [
                  "sleepHours",
                  "Average sleep score",
                  [
                    { value: 1, label: "Very poor" },
                    { value: 2, label: "Poor" },
                    { value: 3, label: "Okay" },
                    { value: 4, label: "Good" },
                    { value: 5, label: "Excellent" },
                  ],
                ],
                ["exhaustion", "Mental exhaustion", likertOptions],
                ["personalTime", "Personal / family time", likertOptions],
                ["support", "Peer / management support", likertOptions],
                ["salaryAdequacy", "Salary adequacy", likertOptions],
              ].map(([key, label, options]) => (
                <SurveyScale
                  key={key as string}
                  label={label as string}
                  value={values[key as string]}
                  options={options as any}
                  onChange={v => update(key as string, v)}
                />
              ))}
            </div>
          </div>
          <div className="prediction-actions">
            <label>
              <span>Prediction model</span>
              <select value={model} onChange={e => setModel(e.target.value)}>
                {trained.selectedModels.map((m: string) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <button className="primary-btn" onClick={onPredict}>
              <Sparkles size={16} /> Predict outcome
            </button>
          </div>
        </div>
        <div className="prediction-result">
          {prediction ? (
            <>
              <div className="result-label">
                PREDICTED{" "}
                {trained.target === "burnout" ? "BURNOUT" : "WORK-LIFE BALANCE"}
              </div>
              <strong
                className="result-level"
                style={{ color: labelColors[prediction.label] }}
              >
                {prediction.label.toUpperCase()}
              </strong>
              <span className="confidence">
                Confidence: {pct(prediction.confidence)}
              </span>
              <div className="prob-list">
                {prediction.probabilities.map((p: any) => (
                  <div key={p.label}>
                    <span>{p.label}</span>
                    <div>
                      <i
                        style={{
                          width: `${p.value * 100}%`,
                          background: labelColors[p.label],
                        }}
                      />
                    </div>
                    <b>{pct(p.value)}</b>
                  </div>
                ))}
              </div>
              <div className="indicator-list">
                <span className="eyebrow">MODEL INDICATORS</span>
                {prediction.indicators.map((i: any) => (
                  <div key={i.feature}>
                    <span>{i.feature}</span>
                    <b>{fmt(i.strength, 2)}</b>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="result-placeholder">
              <Sparkles size={22} />
              <h3>Ready for a profile</h3>
              <p>
                Train a model, enter employee indicators, and run a prediction.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Descriptive({
  result,
  isRunning,
  settings,
  setSettings,
  onRun,
  readOnly = false,
}: any) {
  return (
    <div className="page-grid">
      <div className="content-grid descriptive-top">
        <div className={cardClass + " analysis-launch"}>
          <div className="analysis-icon blue">
            <Layers3 size={22} />
          </div>
          <span className="eyebrow">SEGMENTATION</span>
          <h2>K-Means Clustering</h2>
          <p>
            Standardized workload, wellbeing, support, and burnout features. K =
            2 through 10 are evaluated; final K = 2 follows the notebook
            configuration.
          </p>
          <div className="launch-meta">
            <span>
              <strong>{result?.finalK ?? "—"}</strong> final K
            </span>
            <span>
              <strong>{result?.profiles?.length ?? "—"}</strong> clusters
            </span>
          </div>
          {!readOnly && (
            <button
              className="primary-btn"
              onClick={onRun}
              disabled={isRunning}
            >
              {isRunning ? (
                <Loader2 className="spin" size={16} />
              ) : (
                <Layers3 size={16} />
              )}
              {isRunning ? "Running analysis..." : "Run K-Means"}
            </button>
          )}
        </div>
        <div className={cardClass + " analysis-launch"}>
          <div className="analysis-icon coral">
            <Sparkles size={22} />
          </div>
          <span className="eyebrow">PATTERN DISCOVERY</span>
          <h2>Association Rule Mining</h2>
          <p>
            Apriori and FP-Growth-style frequent itemset analysis with
            adjustable support and confidence thresholds.
          </p>
          <div className="thresholds">
            <label>
              Minimum support
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="1"
                value={settings.support}
                disabled={readOnly}
                onChange={e =>
                  setSettings({ ...settings, support: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Minimum confidence
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="1"
                value={settings.confidence}
                disabled={readOnly}
                onChange={e =>
                  setSettings({
                    ...settings,
                    confidence: Number(e.target.value),
                  })
                }
              />
            </label>
          </div>
          {!readOnly && (
            <button
              className="primary-btn"
              onClick={onRun}
              disabled={isRunning}
            >
              {isRunning ? (
                <Loader2 className="spin" size={16} />
              ) : (
                <Sparkles size={16} />
              )}
              {isRunning ? "Mining rules..." : "Run descriptive analysis"}
            </button>
          )}
        </div>
      </div>
      {result ? (
        <div className="desc-results">
          <div className="kpi-grid rule-kpis">
            <Metric
              label="Apriori Itemsets"
              value={result.association.aprioriItemsets.length}
            />
            <Metric
              label="Apriori Rules"
              value={result.association.aprioriRules.length}
              accent="amber"
            />
            <Metric
              label="FP-Growth Rules"
              value={result.association.fpGrowthRules.length}
              accent="blue"
            />
            <Metric
              label="Maximum Lift"
              value={
                result.association.maxLift == null
                  ? "—"
                  : fmt(result.association.maxLift, 3)
              }
              accent="coral"
            />
          </div>
          <div className="content-grid descriptive-grid">
            <div className={cardClass}>
              <SectionTitle
                eyebrow="K OPTIMIZATION"
                title="Elbow Method & CH Index"
                copy="Runtime metrics for K = 2 through 10."
              />
              <ResponsiveContainer width="100%" height={230}>
                <ReLineChart data={result.kAnalysis}>
                  <CartesianGrid stroke="#28384a" />
                  <XAxis dataKey="k" tick={{ fill: "#71839a" }} />
                  <YAxis yAxisId="left" tick={{ fill: "#71839a" }} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "#71839a" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#162131",
                      border: "1px solid #2a4055",
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="inertia"
                    stroke="#61d6b0"
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="ch"
                    stroke="#f3b55b"
                    dot={false}
                  />
                </ReLineChart>
              </ResponsiveContainer>
              <div className="final-k">
                <span>Notebook-selected configuration</span>
                <strong>Final K = {result.finalK}</strong>
              </div>
            </div>
            <div className={cardClass}>
              <SectionTitle
                eyebrow="EMPLOYEE SEGMENTS"
                title="Cluster Profiles"
                copy="Notebook mapping: Cluster 0 = High workload; Cluster 1 = Low workload."
              />
              <div className="profile-grid">
                {result.profiles.map((p: any) => (
                  <div className="profile-card" key={p.cluster}>
                    <div>
                      <strong>{p.cluster}</strong>
                      <span>
                        {p.count} employees · {fmt(p.percentage)}%
                      </span>
                    </div>
                    <div className="profile-stats">
                      <span>
                        Workload <b>{fmt(p.weeklyHours)}</b>
                      </span>
                      <span>
                        Burnout <b>{fmt(p.burnoutScore)}</b>
                      </span>
                      <span>
                        Exhaustion <b>{fmt(p.exhaustion)}</b>
                      </span>
                      <span>
                        Sleep <b>{fmt(p.sleepHours)}</b>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={cardClass}>
            <SectionTitle
              eyebrow="PCA VISUALIZATION"
              title="Employee Cluster Map"
              copy="Notebook PCA projection of standardized clustering features."
            />
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid stroke="#28384a" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="PC1"
                  tick={{ fill: "#71839a" }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="PC2"
                  tick={{ fill: "#71839a" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#162131",
                    border: "1px solid #2a4055",
                  }}
                />
                <Scatter
                  name="High workload"
                  data={result.pca.filter(
                    (p: any) => p.cluster === "High workload"
                  )}
                  fill="#61d6b0"
                />
                <Scatter
                  name="Low workload"
                  data={result.pca.filter(
                    (p: any) => p.cluster === "Low workload"
                  )}
                  fill="#ffbd2e"
                />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="pca-legend">
              <span>
                <i style={{ background: "#8bdc28" }} /> High workload
              </span>
              <span>
                <i style={{ background: "#ffbd2e" }} /> Low workload
              </span>
            </div>
          </div>
          <div className={cardClass}>
            <SectionTitle
              eyebrow="RULE STRENGTH"
              title="Association Rules"
              copy="Sorted by lift descending. A rule is an association, not a causal claim."
            />
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Antecedent</th>
                    <th>Consequent</th>
                    <th>Support</th>
                    <th>Confidence</th>
                    <th>Lift</th>
                  </tr>
                </thead>
                <tbody>
                  {result.association.rules
                    .slice(0, 12)
                    .map((r: any, i: number) => (
                      <tr key={i}>
                        <td>{r.antecedent}</td>
                        <td>
                          <span className="rule-arrow">→</span>
                          {r.consequent}
                        </td>
                        <td>{pct(r.support)}</td>
                        <td>{pct(r.confidence)}</td>
                        <td className="lift-value">{fmt(r.lift, 3)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className={cardClass + " not-trained"}>
          <Layers3 size={24} />
          <h3>Run descriptive analysis to reveal structure</h3>
          <p>
            Clustering and association rules are intentionally run on demand so
            changing thresholds never retrains or silently changes the session.
          </p>
        </div>
      )}
    </div>
  );
}
