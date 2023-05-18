import { MouseEventHandler } from "react";

interface ButtonProps {
  className?: string
  type?: "button" | "submit" | "reset" | undefined
  children?: React.ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined
  loading?: boolean
  disabled?: boolean
  id?: string
}

const Button = ({ className = '', type = "button", onClick = () => { }, children = "Button", loading, disabled, id }: ButtonProps) => {
  if (loading)
    children = "Loading..."
  if (loading || disabled) {
    disabled = true
    className = `${className} button-disabled`
    onClick = () => { }
  }
  return (
    <button data-icon="=" className={`button-new ${className}`} type={type} onClick={onClick} disabled={disabled} id={id}>
      {children}
    </button>
  );
};

export default Button;
