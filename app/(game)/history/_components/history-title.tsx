const HistoryTitle = ({ title }: { title: string }) => {
  return (
    <div className="w-full relative text-center h-6">
      <span className="text-sm text-slate-400 before:absolute before:content-[''] before:h-[1px] before:top-[50%] before:bg-slate-400/50 before:w-[45%] before:left-1 after:absolute after:content-[''] after:h-[1px] after:top-[50%] after:bg-slate-400/50 after:w-[45%] after:right-1">
        {title}
      </span>
    </div>
  );
};

export default HistoryTitle;
