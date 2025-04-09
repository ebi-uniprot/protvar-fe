import {DbReference, Evidence, EvidencedString} from "./Common";

export enum CommentType {
  FUNCTION = 'FUNCTION',
  CATALYTIC_ACTIVITY = 'CATALYTIC_ACTIVITY',
  ACTIVITY_REGULATION = 'ACTIVITY_REGULATION',
  SUBUNIT = 'SUBUNIT',
  SUBCELLULAR_LOCATION = 'SUBCELLULAR_LOCATION',
  DOMAIN = 'DOMAIN',
  PTM = 'PTM',
  SIMILARITY = 'SIMILARITY',
  WEBRESOURCE = 'WEBRESOURCE',
  INTERACTION = 'INTERACTION',
}

export type Comment =
  | APComment
  | BioPhyChemPropComment
  | CatalyticActivityComment
  | CofactorComment
  | DiseaseComment
  | IntActComment
  | MassSpecComment
  | RnaEdComment
  | SeqCautionComment
  | SubcellLocationComment
  | TextComment
  | WRComment;

export interface BaseComment {
  type: string; // not using CommentType here to allow any type we haven't explicitly defined in CommentType
  //molecule: string;

  // shared fields
  //text?: string | EvidencedString[]; // since 'text' can be a string or array of EvidencedString
  //evidences?: Evidence[];
}

interface APComment extends BaseComment {
  comment?: EvidencedString[];
  event?: string[];
  isoforms?: Isoform[];
}

interface Isoform {
  ids?: string[];
  name?: EvidencedString;
  synonyms?: EvidencedString[];
  text?: EvidencedString[];
  sequenceStatus?: string;
  sequence?: string[];
}

interface BioPhyChemPropComment extends BaseComment {
  absorption?: Absorption;
  kinetics?: Kinetics;
  phDependence?: EvidencedString[];
  temperatureDependence?: EvidencedString[];
  redoxPotential?: EvidencedString[];
}

interface Absorption {
  max?: EvidencedString;
  text?: EvidencedString[];
}

interface Kinetics {
  km?: EvidencedString[];
  vmax?: EvidencedString[];
  text?: EvidencedString[];
}

export interface CatalyticActivityComment extends BaseComment {
  reaction: Reaction;
  physiologicalReactions?: PhysiologicalReaction[];
}

export interface Reaction {
  name?: string;
  dbReferences?: DbReference[];
  //ecNumber?: string;
  evidences?: Evidence[];
}

interface PhysiologicalReaction {
  direction?: string;
  dbReference?: DbReference;
  evidences?: Evidence[];
}

interface CofactorComment extends BaseComment {
  cofactors: Cofactor[];
  text?: EvidencedString[];
}

interface Cofactor {
  name?: string;
  dbReference?: DbReference;
  evidences?: Evidence[];
}

interface DiseaseComment extends BaseComment {
  diseaseId: string;
  acronym?: string;
  dbReference?: DbReference;
  description?: EvidencedString;
  text?: EvidencedString[];
}

export interface IntActComment extends BaseComment {
  interactions: IntAct[];
}

export interface IntAct {
  accession1: string
  //chain1: string
  accession2: string
  //chain1: string
  gene: string
  interactor1: string
  interactor2: string
  organismDiffer: boolean
  experiments: number
}

interface MassSpecComment extends BaseComment {
  method?: string;
  mass?: number;
  error?: number;
  evidences?: EvidencedString[];
  text?: string;
}

interface RnaEdComment extends BaseComment {
  locationType?: string;
  locations?: EvidencedString[];
  text?: EvidencedString[];
}

interface SeqCautionComment extends BaseComment {
  conflictType?: string;
  sequence?: string;
  text?: string;
  evidences?: EvidencedString[];
}

export interface SubcellLocationComment extends BaseComment {
  locations: SubcellularLocation[];
  text?: EvidencedString[];
}

interface SubcellularLocation {
  location?: EvidencedString;
  topology?: EvidencedString;
  orientation?: EvidencedString;
}

export interface TextComment extends BaseComment {
  text: EvidencedString[];
}

export interface WRComment extends BaseComment {
  name?: string;
  url?: string;
  ftp?: string;
  text?: string;
}