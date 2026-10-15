import MortgageForm from "./ui/mortgage-form";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-2xl mt-2">Ипотечный калькулятор</h1>
      <MortgageForm />
    </div>
  );
}
