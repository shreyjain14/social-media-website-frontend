import { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
}

const Alert = ({ children }: AlertProps) => {
  return <div className="alert alert-danger">{children}</div>;
};

export default Alert;
