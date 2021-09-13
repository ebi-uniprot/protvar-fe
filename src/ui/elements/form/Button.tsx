import { MouseEventHandler } from "react";

interface ButtonProps {
  className?: string
  type?: "button" | "submit" | "reset" | undefined
  children?: React.ReactNode
  onClick?: MouseEventHandler | undefined
}

const Button = ({ className = '', type = "button", onClick = () => { }, children = "Button" }: ButtonProps) => {

  return (
    <button data-icon="=" className={`button-new ${className}`} type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
