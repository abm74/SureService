function Spinner() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-8 h-8 rounded-full bg-[conic-gradient(#0000_10%,var(--ink))] [mask:radial-gradient(farthest-side,#0000_calc(100%-4.5px),#000_0)] animate-[spin_1.5s_linear_infinite]"></div>
    </div>
  );
}

export default Spinner;
