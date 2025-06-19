export default function Button({ children, className, ...props }) {
  return (
    <button
      className={`flex cursor-pointer items-center justify-center text-gray-100 bg-gradient-to-r from-[#7A5AFB] to-[#1E60EC] disabled:from-[#5B5A92] disabled:to-[#5B5A92] rounded-xl px-[20px] py-[13px] text-base font-bold leading-[19px]  ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
