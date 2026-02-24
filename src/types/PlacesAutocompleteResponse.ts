interface TextMatch {
  startOffset?: number;
  endOffset: number;
}

interface FormattedText {
  text: string;
  matches: TextMatch[];
}

interface StructuredFormat {
  mainText: FormattedText;
  secondaryText: FormattedText;
}

interface PlacePrediction {
  place: string;
  placeId: string;
  text: FormattedText;
  structuredFormat: StructuredFormat;
  types: string[];
}

export interface PlaceSuggestion {
  placePrediction: PlacePrediction;
}

export interface PlacesAutocompleteResponse {
  suggestions: PlaceSuggestion[];
}
