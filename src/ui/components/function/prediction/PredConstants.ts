import tinygradient from "tinygradient";

export const STD_BENIGN_COLOR: string = 'blue'
export const STD_UNCERTAIN_COLOR: string = 'lightgray'
export const STD_PATHOGENIC_COLOR: string = 'red'

export const STD_COLOR_GRADIENT = tinygradient(STD_BENIGN_COLOR, STD_UNCERTAIN_COLOR, STD_PATHOGENIC_COLOR);
export const STD_COLOR_GRADIENT_REVERSE = tinygradient('red', 'lightgray', 'blue');

// default precision
export const PRECISION: number = 2 // dp
