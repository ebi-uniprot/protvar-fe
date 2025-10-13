// RangeSlider.tsx
import React, { useState } from 'react';
import './RangeSlider.css';

interface RangeSliderProps {
  label: string;
  paramName: string;
  min?: number;
  max?: number;
  step?: number;
  onRangeChange: (paramName: string, low: number | null, high: number | null) => void;
  initialLow?: number | null;
  initialHigh?: number | null;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
                                                   label,
                                                   paramName,
                                                   min = 0,
                                                   max = 100,
                                                   step,
                                                   onRangeChange,
                                                   initialLow = null,
                                                   initialHigh = null
                                                 }) => {
  // Auto-calculate step if not provided
  const rangeStep = step ?? (max - min <= 2 ? 0.01 : 1);

  const [isActive, setIsActive] = useState(initialLow !== null || initialHigh !== null);
  const [lowValue, setLowValue] = useState(initialLow ?? min);
  const [highValue, setHighValue] = useState(initialHigh ?? max);

  const handleReset = () => {
    setIsActive(false);
    setLowValue(min);
    setHighValue(max);
    onRangeChange(paramName, null, null);
  };

  const handleApply = () => {
    setIsActive(true);
    onRangeChange(paramName, lowValue, highValue);
  };

  const handleLowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(min, Math.min(Number(e.target.value), highValue));
    setLowValue(Number(value.toFixed(rangeStep < 1 ? 2 : 0)));
  };

  const handleHighChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(max, Math.max(Number(e.target.value), lowValue));
    setHighValue(Number(value.toFixed(rangeStep < 1 ? 2 : 0)));
  };

  const lowPercent = ((lowValue - min) / (max - min)) * 100;
  const highPercent = ((highValue - min) / (max - min)) * 100;

  const formatValue = (value: number) => {
    return rangeStep < 1 ? value.toFixed(2) : value.toString();
  };

  return (
    <div className="range-slider">
      <div className="range-slider__header">
        <label className="range-slider__label">{label}</label>
        {isActive && (
          <button onClick={handleReset} className="range-slider__clear">
            Clear
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
          step={rangeStep}
          value={lowValue}
          onChange={handleLowChange}
          className="range-slider__input"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={rangeStep}
          value={highValue}
          onChange={handleHighChange}
          className="range-slider__input"
        />
      </div>

      <div className="range-slider__values">
        <div className="range-slider__value-box">
          <span className="range-slider__value-label">Min</span>
          <input
            type="number"
            min={min}
            max={highValue}
            step={rangeStep}
            value={lowValue}
            onChange={handleLowChange}
            className="range-slider__value-input"
          />
        </div>
        <div className="range-slider__value-box">
          <span className="range-slider__value-label">Max</span>
          <input
            type="number"
            min={lowValue}
            max={max}
            step={rangeStep}
            value={highValue}
            onChange={handleHighChange}
            className="range-slider__value-input"
          />
        </div>
      </div>

      {!isActive && (lowValue !== min || highValue !== max) && (
        <button onClick={handleApply} className="range-slider__apply">
          Apply Range
        </button>
      )}

      {isActive && (
        <div className="range-slider__active">
          Range: {formatValue(lowValue)} - {formatValue(highValue)}
        </div>
      )}
    </div>
  );
};

export default RangeSlider;