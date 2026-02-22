import React from 'react';

type ActionIconButtonProps = {
  onClick: () => void;
  className: string;
  label?: string;
  icon: React.ReactNode;
  labelClassName: string;
};

const ActionIconButton = ({ onClick, className, label, icon, labelClassName }: ActionIconButtonProps) => {
  return (
    <button onClick={onClick} className={className}>
      {icon}
      {label ? <span className={labelClassName}>{label}</span> : null}
    </button>
  );
};

export default ActionIconButton;
