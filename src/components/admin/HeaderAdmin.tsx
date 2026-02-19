

type Props = {
  title: string;
  subtitle?: string;
};

function HeaderAdmin({ title, subtitle }: Props) {
  return (
    <div className="w-full  bg-white border-b p-4 py-5 shadow-sm ">
      <div className="flex flex-col gap-1">
        {/* title */}
        <h1 className="text-2xl font-bold text-slate-800">
          {title}
        </h1>

        {/* subtitle */}
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default HeaderAdmin;
