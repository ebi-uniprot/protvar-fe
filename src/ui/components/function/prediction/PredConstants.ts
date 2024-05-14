import tinygradient from "tinygradient";

export const STD_BENIGN_COLOR: string = 'blue'
export const STD_UNCERTAIN_COLOR: string = 'lightgray'
export const STD_PATHOGENIC_COLOR: string = 'red'

export const STD_COLOR_GRADIENT = tinygradient(STD_BENIGN_COLOR, STD_UNCERTAIN_COLOR, STD_PATHOGENIC_COLOR);
