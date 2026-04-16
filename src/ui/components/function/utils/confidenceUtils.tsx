/**
 * Utilities for confidence level calculation and display
 */

import React from 'react';

export interface ConfidenceLevel {
  threshold: number;
  icon: string;
  className: string;
  label: string;
}

export const CONFIDENCE_LEVELS = {
  VERY_HIGH: {
    threshold: 900,
    icon: 'bi-caret-up-fill',
    className: 'conf-vhigh',
    label: 'very high',
  },
  HIGH: {
    threshold: 800,
    icon: 'bi-caret-up-fill',
    className: 'conf-high',
    label: 'high',
  },
  LOW: {
    threshold: 0,
    icon: 'bi-caret-down-fill',
    className: 'conf-low',
    label: 'low',
  },
  VERY_LOW: {
    threshold: 0,
    icon: 'bi-caret-down-fill',
    className: 'conf-vlow',
    label: 'very low',
  },
} as const;

/**
 * Get confidence level for pocket score
 * @param score - Pocket combined score
 * @returns Confidence level object
 */
export function getPocketConfidence(score: number): ConfidenceLevel {
  if (score > 900) return CONFIDENCE_LEVELS.VERY_HIGH;
  if (score > 800) return CONFIDENCE_LEVELS.HIGH;
  return CONFIDENCE_LEVELS.LOW;
}

/**
 * Get confidence level for model pLDDT score
 * @param score - pLDDT mean score
 * @returns Confidence level object
 */
export function getModelConfidence(score: number): ConfidenceLevel {
  if (score > 90) return CONFIDENCE_LEVELS.VERY_HIGH;
  if (score > 70) return CONFIDENCE_LEVELS.HIGH;
  if (score > 50) return CONFIDENCE_LEVELS.LOW;
  return CONFIDENCE_LEVELS.VERY_LOW;
}

/**
 * Get confidence level for protein-protein interaction
 * @param pdockq - pDockQ score
 * @returns Confidence level object
 */
export function getInteractionConfidence(pdockq: number): ConfidenceLevel {
  if (pdockq > 0.50) return CONFIDENCE_LEVELS.VERY_HIGH;
  if (pdockq > 0.23) return CONFIDENCE_LEVELS.HIGH;
  return CONFIDENCE_LEVELS.LOW;
}

/**
 * Reusable confidence badge component
 */
interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
}

export function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  return (
    <>
      <i className={`bi ${level.icon} ${level.className}`}></i> {level.label}
    </>
  );
}

/**
 * Filter options for pocket confidence dropdown
 */
export const POCKET_FILTER_OPTIONS = [
  { value: -1, label: 'Show all' },
  { value: 0, label: <><i className={`bi ${CONFIDENCE_LEVELS.VERY_HIGH.icon} ${CONFIDENCE_LEVELS.VERY_HIGH.className}`} /> &gt;900 - {CONFIDENCE_LEVELS.VERY_HIGH.label}</> },
  { value: 1, label: <><i className={`bi ${CONFIDENCE_LEVELS.HIGH.icon} ${CONFIDENCE_LEVELS.HIGH.className}`} /> 800-900 - {CONFIDENCE_LEVELS.HIGH.label}</> },
  { value: 2, label: <><i className={`bi ${CONFIDENCE_LEVELS.LOW.icon} ${CONFIDENCE_LEVELS.LOW.className}`} /> &lt;800 - {CONFIDENCE_LEVELS.LOW.label}</> },
];