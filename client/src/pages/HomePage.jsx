import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  RotateCcw,
  Sparkles,
  X,
  Calendar,
  User,
  GraduationCap,
  IndianRupee,
  Globe,
  Loader2,
  BookmarkCheck,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRecommendations, extractProfile } from "../services/api";
import Header from "../components/Header";
import StateAutocomplete from "../components/StateAutocomplete";
import Toast from "../components/Toast";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];
const categories = [
  "Business",
  "Education",
  "Employment",
  "Agriculture",
  "Healthcare",
  "Housing",
  "Women Empowerment",
  "Startup",
  "Skill Development",
  "Senior Citizen",
  "Student",
  "Farmer",
  "Other",
];
const education = [
  "No Formal Education",
  "10th Pass",
  "12th Pass",
  "Diploma",
  "ITI",
  "Graduate",
  "Engineering",
  "Post Graduate",
  "Doctorate",
  "Other",
];
const languages = [
  "English",
  "Hindi",
  "Telugu",
  "Tamil",
  "Kannada",
  "Malayalam",
];

const loadingLogs = [
  "Analyzing your target goals...",
  "Contacting AI decision nodes...",
  "Validating profile details against state codes...",
  "Scanning 50+ central & regional schemes...",
  "Calibrating final rules and eligibility...",
  "Compiling matches...",
];

const Field = ({ label, name, errors, icon, children }) => (
  <label className="block text-sm font-semibold text-text-muted transition-colors duration-200">
    <span className="flex items-center gap-1.5">
      {icon}
      {label}
      <span className="text-red-500">*</span>
    </span>
    {children}
    {errors[name] && (
      <span
        role="alert"
        className="mt-1.5 block text-xs font-semibold text-red-500 animate-pulse"
      >
        {errors[name].message}
      </span>
    )}
  </label>
);

function CategoryPicker({ selected, toggle, open, setOpen, invalid }) {
  return (
    <div className="relative mt-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={`flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl border bg-bg-secondary px-4 py-2.5 text-left shadow-sm transition duration-200 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 ${invalid
          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
          : "border-border-main hover:border-brand-primary/60 focus:border-brand-primary"
          }`}
      >
        <span
          className={
            selected.length
              ? "flex min-w-0 flex-1 flex-wrap gap-1.5"
              : "text-text-dim text-sm"
          }
        >
          {selected.length
            ? selected.map((item) => (
              <span
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-bg px-2.5 py-1 text-xs font-bold text-brand-primary"
                key={item}
              >
                {item}
                <X
                  onClick={(event) => {
                    event.stopPropagation();
                    toggle(item);
                  }}
                  className="cursor-pointer hover:text-brand-hover transition-colors"
                  size={13}
                />
              </span>
            ))
            : "Select applicable categories"}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-text-dim transition duration-200 ${open ? "rotate-180 text-brand-primary" : ""
            }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border-main bg-bg-secondary shadow-xl"
          >
            <p className="border-b border-border-main px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-dim bg-bg-tertiary/40">
              Choose one or more
            </p>
            <div className="grid max-h-60 grid-cols-1 gap-1 overflow-y-auto p-2 sm:grid-cols-2 no-scrollbar">
              {categories.map((item) => (
                <label
                  key={item}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${selected.includes(item)
                    ? "bg-brand-bg text-brand-primary"
                    : "text-text-muted hover:bg-bg-tertiary hover:text-text-main"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(item)}
                    onChange={() => toggle(item)}
                    className="h-4 w-4 rounded accent-brand-primary cursor-pointer"
                  />
                  {item}
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isAutofilling, setIsAutofilling] = useState(false);

  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      goal: "",
      age: "",
      gender: "",
      state: "",
      education: "",
      income: "",
      goalCategory: [],
      language: "English",
    },
  });

  const selectedCategories = watch("goalCategory");
  const goalText = watch("goal");

  // Cycle loading logs during submission
  useEffect(() => {
    let interval;
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingLogs.length);
      }, 900);
    } else {
      setLoadingTextIndex(0);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const inputClass = (name) =>
    `mt-2 w-full rounded-xl border bg-bg-secondary px-4 py-3.5 text-text-main shadow-sm outline-none transition duration-200 placeholder:text-text-dim focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 ${errors[name]
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-border-main focus:border-brand-primary"
    }`;

  const toggleCategory = (item) =>
    setValue(
      "goalCategory",
      selectedCategories.includes(item)
        ? selectedCategories.filter((x) => x !== item)
        : [...selectedCategories, item],
      { shouldValidate: true }
    );

  const handleNext = async () => {
    let fields = [];
    if (step === 1) fields = ["goal", "goalCategory"];
    if (step === 2) fields = ["age", "gender", "state"];

    const isValid = await trigger(fields);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleAutofill = async () => {
    if (!goalText || goalText.trim().length < 10) {
      setToast({
        message: "Please write at least 10 characters in your goal first.",
        type: "error",
      });
      return;
    }

    setIsAutofilling(true);
    try {
      const { data } = await extractProfile(goalText);
      let filledFields = [];

      if (data.age) {
        setValue("age", data.age, { shouldValidate: true });
        filledFields.push("Age");
      }
      if (data.gender) {
        const normalized = ["Male", "Female", "Other", "Prefer not to say"].find(
          (g) => g.toLowerCase() === data.gender.toLowerCase()
        );
        if (normalized) {
          setValue("gender", normalized, { shouldValidate: true });
          filledFields.push("Gender");
        }
      }
      if (data.state) {
        const matchedState = states.find(
          (s) => s.toLowerCase() === data.state.toLowerCase()
        );
        if (matchedState) {
          setValue("state", matchedState, { shouldValidate: true });
          filledFields.push("State");
        }
      }
      if (data.education) {
        const matchedEd = education.find(
          (e) =>
            e.toLowerCase() === data.education.toLowerCase() ||
            (data.education.toLowerCase().includes("engineer") && e === "Engineering") ||
            (data.education.toLowerCase().includes("grad") && e === "Graduate")
        );
        if (matchedEd) {
          setValue("education", matchedEd, { shouldValidate: true });
          filledFields.push("Education");
        }
      }
      if (data.income !== undefined && data.income !== null) {
        setValue("income", data.income, { shouldValidate: true });
        filledFields.push("Family Income");
      }

      if (filledFields.length > 0) {
        setToast({
          message: `AI Autofilled: ${filledFields.join(", ")} ✨`,
          type: "success",
        });
      } else {
        setToast({
          message: "No matching fields could be extracted. Try providing details like age, location or income in the text.",
          type: "info",
        });
      }
    } catch {
      setToast({
        message: "AI Autofill is unavailable right now. Try completing the form fields manually.",
        type: "error",
      });
    } finally {
      setIsAutofilling(false);
    }
  };

  const submit = async (profile) => {
    try {
      const { data } = await getRecommendations(profile);
      navigate("/recommendations", { state: { schemes: data, profile } });
    } catch {
      setToast({
        message: "Something went wrong. Please check your connection and try again.",
        type: "error",
      });
    }
  };

  return (
    <main className="min-h-screen bg-bg-primary text-text-main transition-colors duration-300 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40 dark:opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] radial-glow pointer-events-none" />

      <Header showBack={false} />

      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 z-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-bg px-3.5 py-1.5 text-xs font-bold tracking-wide text-brand-primary"
          >
            <CheckCircle2 size={13.5} /> Built for every indian
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 font-serif text-4xl font-semibold tracking-tight leading-[1.1] md:text-6xl text-text-main"
          >
            Find the Right Scheme <br className="hidden sm:inline" />
            <span className="text-brand-primary bg-gradient-to-r from-brand-primary to-teal-500 bg-clip-text text-transparent">
              You Deserve.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-muted"
          >
            Describe your situation in plain language, and SchemeSathi will help you discover government schemes, subsidies, scholarships, and welfare programs you may be eligible for
          </motion.p>
        </div>

        {/* Wizard Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-12 max-w-3xl rounded-3xl border border-border-main bg-bg-secondary p-6 shadow-xl shadow-black/[0.02] md:p-9 relative"
        >
          {/* Form Wizard Progress Indicators */}
          <div className="flex items-center justify-between border-b border-border-main pb-6 mb-8">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 w-10 rounded-full transition-all duration-300 ${s <= step ? "bg-brand-primary" : "bg-bg-tertiary"
                    }`}
                />
              ))}
            </div>
            <span className="rounded-full bg-brand-bg px-3 py-1 text-xs font-bold text-brand-primary border border-brand-primary/10">
              Step {step} of 3
            </span>
          </div>

          <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="block text-sm font-semibold text-text-muted">
                        Goal or situation <span className="text-red-500">*</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleAutofill}
                        disabled={isAutofilling || !goalText}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/20 bg-brand-bg px-3 py-1.5 text-xs font-bold text-brand-primary shadow-sm hover:bg-brand-primary hover:text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isAutofilling ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles size={13} />
                            Magic Autofill ✨
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      className={`${inputClass("goal")} h-32 resize-none`}
                      placeholder="Example: I am a 22-year-old female engineering graduate from Maharashtra looking to start a dairy farm startup. Annual income is 4 lakhs."
                      {...register("goal", {
                        required: "Please describe your goal.",
                        minLength: {
                          value: 10,
                          message: "Please write at least 10 characters.",
                        },
                      })}
                    />
                    {errors.goal && (
                      <span className="mt-1.5 block text-xs font-semibold text-red-500">
                        {errors.goal.message}
                      </span>
                    )}
                  </div>

                  <Field
                    label="Goal categories"
                    name="goalCategory"
                    errors={errors}
                    icon={<BookmarkCheck size={16} className="text-brand-primary" />}
                  >
                    <input
                      type="hidden"
                      {...register("goalCategory", {
                        validate: (value) =>
                          value.length > 0 ||
                          "Please select at least one goal category.",
                      })}
                    />
                    <CategoryPicker
                      selected={selectedCategories}
                      toggle={toggleCategory}
                      open={open}
                      setOpen={setOpen}
                      invalid={Boolean(errors.goalCategory)}
                    />
                  </Field>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.18 }}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  <div className="col-span-full">
                    <p className="text-sm font-semibold text-text-muted mb-4 border-b border-border-main pb-2">
                      Personal Profile Details
                    </p>
                  </div>

                  <Field
                    label="Age"
                    name="age"
                    errors={errors}
                    icon={<Calendar size={16} className="text-brand-primary" />}
                  >
                    <input
                      className={inputClass("age")}
                      type="number"
                      placeholder="Enter age"
                      {...register("age", {
                        required: "Please enter your age.",
                        valueAsNumber: true,
                        min: {
                          value: 18,
                          message: "Age must be between 18 and 100.",
                        },
                        max: {
                          value: 100,
                          message: "Age must be between 18 and 100.",
                        },
                      })}
                    />
                  </Field>

                  <Field
                    label="Gender"
                    name="gender"
                    errors={errors}
                    icon={<User size={16} className="text-brand-primary" />}
                  >
                    <select
                      className={inputClass("gender")}
                      {...register("gender", {
                        required: "Please select your gender.",
                      })}
                    >
                      <option value="">Select gender</option>
                      {["Male", "Female", "Other", "Prefer not to say"].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </Field>

                  <div className="col-span-full">
                    <label className="block text-sm font-semibold text-text-muted">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-brand-primary" />
                        State or Union Territory
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <Controller
                      name="state"
                      control={control}
                      rules={{ required: "Please select your state." }}
                      render={({ field }) => (
                        <StateAutocomplete
                          states={states}
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.state}
                        />
                      )}
                    />
                    {errors.state && (
                      <span className="mt-1.5 block text-xs font-semibold text-red-500">
                        {errors.state.message}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.18 }}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  <div className="col-span-full">
                    <p className="text-sm font-semibold text-text-muted mb-4 border-b border-border-main pb-2">
                      Socio-economic background
                    </p>
                  </div>

                  <Field
                    label="Education Level"
                    name="education"
                    errors={errors}
                    icon={<GraduationCap size={16} className="text-brand-primary" />}
                  >
                    <select
                      className={inputClass("education")}
                      {...register("education", {
                        required: "Please select education.",
                      })}
                    >
                      <option value="">Select education</option>
                      {education.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label="Annual Family Income"
                    name="income"
                    errors={errors}
                    icon={<IndianRupee size={15} className="text-brand-primary" />}
                  >
                    <input
                      className={inputClass("income")}
                      type="number"
                      placeholder="e.g. 350000"
                      {...register("income", {
                        required: "Please enter family income.",
                        valueAsNumber: true,
                        min: { value: 0, message: "Income cannot be negative." },
                      })}
                    />
                  </Field>

                  <div className="col-span-full">
                    <Field
                      label="Output Results Language"
                      name="language"
                      errors={errors}
                      icon={<Globe size={16} className="text-brand-primary" />}
                    >
                      <select
                        className={inputClass("language")}
                        {...register("language", {
                          required: "Please select results language.",
                        })}
                      >
                        {languages.map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-border-main pt-6 mt-8 sm:flex-row sm:justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-main bg-bg-secondary px-5 py-3.5 text-sm font-bold text-text-muted hover:bg-bg-tertiary hover:text-text-main transition duration-200 cursor-pointer"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setOpen(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-text-dim hover:text-text-muted hover:bg-bg-tertiary/50 transition duration-200 cursor-pointer"
                >
                  <RotateCcw size={15} /> Clear Form
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-primary/20 hover:bg-brand-hover hover:-translate-y-0.5 transition duration-200 cursor-pointer"
                >
                  Next Step <ArrowRight size={17} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-primary/20 hover:bg-brand-hover hover:-translate-y-0.5 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  Find Eligible Schemes <ArrowRight size={17} />
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </section>

      {/* Dynamic Immersive Submission Loading Screen */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary/95 backdrop-blur-sm px-6"
          >
            <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

            <div className="relative flex flex-col items-center max-w-sm text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="h-16 w-16 text-brand-primary rounded-full border-[3px] border-bg-tertiary border-t-brand-primary mb-8"
              />

              <h2 className="text-xl font-bold tracking-tight mb-2">Analyzing Profile</h2>

              {/* Cycling animated text steps */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingTextIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-text-muted font-medium min-h-[20px]"
                >
                  {loadingLogs[loadingTextIndex]}
                </motion.p>
              </AnimatePresence>

              {/* Progress loader simulation bar */}
              <div className="w-48 bg-bg-tertiary h-1 rounded-full overflow-hidden mt-6">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  className="h-full bg-brand-primary w-24 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
