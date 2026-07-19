import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRecommendations } from "../services/api";

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
const Field = ({ label, name, errors, children }) => (
  <label className="block text-sm font-semibold text-slate-700">
    {label}
    <span className="ml-1 text-red-500">*</span>
    {children}
    {errors[name] && (
      <span
        role="alert"
        className="mt-1.5 block text-xs font-medium text-red-600"
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
        className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border bg-white px-3 py-2 text-left shadow-sm transition focus:outline-none focus:ring-4 focus:ring-teal-100 ${invalid ? "border-red-400" : "border-slate-200 hover:border-teal-400"}`}
      >
        <span
          className={
            selected.length
              ? "flex min-w-0 flex-1 flex-wrap gap-1.5"
              : "text-slate-400"
          }
        >
          {selected.length
            ? selected.map((item) => (
                <span
                  className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-800"
                  key={item}
                >
                  {item}
                  <X
                    onClick={(event) => {
                      event.stopPropagation();
                      toggle(item);
                    }}
                    className="cursor-pointer"
                    size={12}
                  />
                </span>
              ))
            : "Select applicable categories"}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <p className="border-b border-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            Choose one or more
          </p>
          <div className="grid max-h-64 grid-cols-1 gap-1 overflow-y-auto p-2 sm:grid-cols-2">
            {categories.map((item) => (
              <label
                key={item}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${selected.includes(item) ? "bg-teal-50 text-teal-800" : "text-slate-700 hover:bg-slate-50"}`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(item)}
                  onChange={() => toggle(item)}
                  className="h-4 w-4 accent-teal-700"
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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
  const selected = watch("goalCategory");
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");
  const input = (name) =>
    `mt-2 w-full rounded-xl border bg-white px-3.5 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 ${errors[name] ? "border-red-400" : "border-slate-200"}`;
  const toggle = (item) =>
    setValue(
      "goalCategory",
      selected.includes(item)
        ? selected.filter((x) => x !== item)
        : [...selected, item],
      { shouldValidate: true },
    );
  const submit = async (profile) => {
    try {
      const { data } = await getRecommendations(profile);
      navigate("/recommendations", { state: { schemes: data, profile } });
    } catch {
      setToast("Something went wrong. Please try again.");
      setTimeout(() => setToast(""), 3500);
    }
  };
  return (
    <main className="min-h-screen bg-[#f8faf9] text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-700 text-white">
              <Sparkles size={17} />
            </span>
            SchemeSathi
          </div>
          <span className="hidden text-sm font-medium text-slate-500 sm:block">
            Government schemes, made simple
          </span>
        </nav>
      </header>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-bold tracking-wide text-teal-800">
            <CheckCircle2 size={14} /> Built for every Indian citizen
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
            Find public benefits that{" "}
            <span className="text-teal-700">fit your life.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Share your situation and receive clearly explained government scheme
            matches in one place.
          </p>
        </div>
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-10 max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_55px_-35px_rgba(15,23,42,.35)] md:p-8"
        >
          <div className="flex items-start justify-between border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-xl font-bold">Your details</h2>
              <p className="mt-1 text-sm text-slate-500">
                Fields marked * are required.
              </p>
            </div>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
              Step 1 of 3
            </span>
          </div>
          <form
            onSubmit={handleSubmit(submit)}
            noValidate
            className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <Field label="Goal or situation" name="goal" errors={errors}>
              <textarea
                className={input("goal")}
                rows="4"
                placeholder="Example: I am an engineering graduate looking to start a dairy business."
                {...register("goal", {
                  required: "Please describe your goal.",
                })}
              />
            </Field>
            <Field label="Goal categories" name="goalCategory" errors={errors}>
              <input
                type="hidden"
                {...register("goalCategory", {
                  validate: (value) =>
                    value.length > 0 ||
                    "Please select at least one goal category.",
                })}
              />
              <CategoryPicker
                selected={selected}
                toggle={toggle}
                open={open}
                setOpen={setOpen}
                invalid={Boolean(errors.goalCategory)}
              />
            </Field>
            <Field label="Age" name="age" errors={errors}>
              <input
                className={input("age")}
                type="number"
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
            <Field label="Gender" name="gender" errors={errors}>
              <select
                className={input("gender")}
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
            <Field
              label="State or Union Territory"
              name="state"
              errors={errors}
            >
              <input
                list="states"
                className={input("state")}
                placeholder="Search your state"
                {...register("state", {
                  required: "Please select your state.",
                })}
              />
              <datalist id="states">
                {states.map((x) => (
                  <option key={x} value={x} />
                ))}
              </datalist>
            </Field>
            <Field label="Education" name="education" errors={errors}>
              <select
                className={input("education")}
                {...register("education", {
                  required: "Please select your education.",
                })}
              >
                <option value="">Select education</option>
                {education.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
            <Field label="Annual family income" name="income" errors={errors}>
              <div className="relative">
                <span className="absolute left-3.5 top-5 text-slate-400">
                  ₹
                </span>
                <input
                  className={`${input("income")} pl-7`}
                  type="number"
                  {...register("income", {
                    required: "Please enter your annual family income.",
                    valueAsNumber: true,
                    min: { value: 0, message: "Income cannot be negative." },
                  })}
                />
              </div>
            </Field>
            <Field label="Language" name="language" errors={errors}>
              <select
                className={input("language")}
                {...register("language", {
                  required: "Please select a language.",
                })}
              >
                {languages.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
            <div className="col-span-full flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <RotateCcw size={16} />
                Clear form
              </button>
              <button
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  "Finding Eligible Schemes..."
                ) : (
                  <>
                    Find Eligible Schemes <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.section>
      </section>
      {toast && (
        <div
          role="alert"
          className="fixed bottom-6 right-6 rounded-xl bg-slate-900 px-5 py-4 text-sm font-medium text-white shadow-2xl"
        >
          {toast}
        </div>
      )}
    </main>
  );
}
