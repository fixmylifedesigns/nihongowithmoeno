const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-center";

  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "border-2 border-red-600 text-red-600 hover:bg-red-50",
    outline: "border-2 border-gray-200 hover:border-red-600 hover:text-red-600",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
