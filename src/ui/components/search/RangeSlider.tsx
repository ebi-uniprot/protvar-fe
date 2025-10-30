// RangeSlider.tsx
import React, { useState } from 'react';
import './RangeSlider.css';

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  initialLow?: number;
  initialHigh?: number;
  onChange: (low: number | undefined, high: number | undefined) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
                                                                       label,
                                                                       min,
                                                                       max,
                                                                       step = 0.01,
                                                                       initialLow,
                                                                       initialHigh,
                                                                       onChange
                                                                     }) => {
  const [lowValue, setLowValue] = useState(initialLow ?? min);
  const [highValue, setHighValue] = useState(initialHigh ?? max);
  const [isActive, setIsActive] = useState(
    initialLow !== undefined || initialHigh !== undefined
  );

  const handleReset = () => {
    setLowValue(min);
    setHighValue(max);
    setIsActive(false);
    onChange(undefined, undefined);
  };

  const handleLowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(min, Math.min(Number(e.target.value), highValue));
    setLowValue(value);
    setIsActive(true);
    onChange(value === min ? undefined : value, highValue === max ? undefined : highValue);
  };

  const handleHighChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(max, Math.max(Number(e.target.value), lowValue));
    setHighValue(value);
    setIsActive(true);
    onChange(lowValue === min ? undefined : lowValue, value === max ? undefined : value);
  };

  const lowPercent = ((lowValue - min) / (max - min)) * 100;
  const highPercent = ((highValue - min) / (max - min)) * 100;

  const formatValue = (value: number) => {
    return step < 1 ? value.toFixed(2) : value.toString();
  };

  return (
    <div className="range-slider">
      <div className="range-slider__header">
        <label className="range-slider__label">{label}</label>
        {isActive && (lowValue !== min || highValue !== max) && (
          <button onClick={handleReset} className="range-slider__reset">
            Reset
          </button>
        )}
      </div>

      <div className="range-slider__container">
        <div className="range-slider__track">
          <div
            className="range-slider__track-fill"
            style={{
              left: `${lowPercent}%`,
              width: `${highPercent - lowPercent}%`
            }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lowValue}
          onChange={handleLowChange}
          className="range-slider__input"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={highValue}
          onChange={handleHighChange}
          className="range-slider__input"
        />
      </div>

      <div className="range-slider__values">
        <span className="range-slider__value">{formatValue(lowValue)}</span>
        <span className="range-slider__separator">—</span>
        <span className="range-slider__value">{formatValue(highValue)}</span>
      </div>
    </div>
  );
};

export default RangeSlider;