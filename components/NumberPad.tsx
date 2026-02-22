import React from 'react';

type NumberPadProps = {
  onSelect: (num: number) => void;
  buttonClassName: string;
};

const NumberPad = ({ onSelect, buttonClassName }: NumberPadProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 pb-1 lg:grid lg:grid-cols-3 lg:gap-3 lg:pb-0">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button key={num} onClick={() => onSelect(num)} className={buttonClassName}>
          {num}
        </button>
      ))}
    </div>
  );
};

export default NumberPad;
