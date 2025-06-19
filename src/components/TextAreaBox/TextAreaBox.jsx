export default function TextAreaBox({ className, ...props }) {
  return (
    <textarea
      className={`bg-[#38A2F124] text-[#FAFAFFCC] placeholder-[#FAFAFF80] outline-none px-4 py-2 rounded-md w-full ${className}`}
      {...props}
    ></textarea>
  );
}
