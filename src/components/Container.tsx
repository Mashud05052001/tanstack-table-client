import React from "react";

type PropType = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({ children, className }: PropType) => {
  return <div className={`max-w-3xl mx-auto ${className}`}>{children}</div>;
};

export default Container;
