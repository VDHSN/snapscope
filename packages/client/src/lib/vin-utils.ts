/**
 * VIN validation and utility functions
 * Implements standard VIN format and checksum validation
 */

/**
 * VIN character mapping for checksum calculation per ISO 3779
 * Letters I, O, Q are excluded from VINs
 */
const VIN_CHAR_MAP: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
  'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
  'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9
};

/**
 * Position weights for VIN checksum calculation
 */
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Formats VIN input by removing invalid characters and converting to uppercase
 * @param input - Raw VIN input string
 * @returns Formatted VIN string (max 17 characters)
 */
export function formatVIN(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^A-HJ-NPR-Z0-9]/g, '') // Remove invalid characters (including I, O, Q)
    .slice(0, 17); // Limit to 17 characters
}

/**
 * Validates VIN format (17 characters, no I/O/Q)
 * @param vin - VIN string to validate
 * @returns true if VIN format is valid
 */
export function isValidVINFormat(vin: string): boolean {
  if (vin.length !== 17) return false;
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
}

/**
 * Calculates VIN checksum digit based on ISO 3779 standard
 * @param vin - 17-character VIN string
 * @returns Expected checksum character or null if calculation fails
 */
export function calculateVINChecksum(vin: string): string | null {
  if (!isValidVINFormat(vin)) return null;

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    if (i === 8) continue; // Skip check digit position
    
    const char = vin[i];
    const value = VIN_CHAR_MAP[char];
    const weight = VIN_WEIGHTS[i];
    
    if (value === undefined) return null;
    sum += value * weight;
  }

  const remainder = sum % 11;
  return remainder === 10 ? 'X' : remainder.toString();
}

/**
 * Validates complete VIN including checksum verification
 * @param vin - VIN string to validate
 * @returns true if VIN is valid (format + checksum)
 */
export function isValidVIN(vin: string): boolean {
  if (!isValidVINFormat(vin)) return false;

  const checkDigit = vin[8];
  const calculatedCheck = calculateVINChecksum(vin);
  
  return calculatedCheck === checkDigit;
}

/**
 * Extracts basic information from VIN (stub for future implementation)
 * @param vin - Valid 17-character VIN
 * @returns Basic VIN decode information
 */
export function decodeVIN(vin: string): {
  wmi: string; // World Manufacturer Identifier (positions 1-3)
  vds: string; // Vehicle Descriptor Section (positions 4-9)
  vis: string; // Vehicle Identifier Section (positions 10-17)
  year?: number; // Model year (position 10)
  isValid: boolean;
} {
  if (!isValidVINFormat(vin)) {
    return {
      wmi: '',
      vds: '',
      vis: '',
      isValid: false,
    };
  }

  const wmi = vin.slice(0, 3);
  const vds = vin.slice(3, 9);
  const vis = vin.slice(9, 17);

  // VIN year decode (position 10) - supports 1980 onwards, repeats every 30 years
  const yearChar = vin[9];
  
  // Year mapping per ISO 3779 (excludes I, O, Q, U, Z, 0)
  const yearMap: Record<string, number[]> = {
    'A': [1980, 2010], 'B': [1981, 2011], 'C': [1982, 2012], 'D': [1983, 2013],
    'E': [1984, 2014], 'F': [1985, 2015], 'G': [1986, 2016], 'H': [1987, 2017],
    'J': [1988, 2018], 'K': [1989, 2019], 'L': [1990, 2020], 'M': [1991, 2021],
    'N': [1992, 2022], 'P': [1993, 2023], 'R': [1994, 2024], 'S': [1995, 2025],
    'T': [1996, 2026], 'V': [1997, 2027], 'W': [1998, 2028], 'X': [1999, 2029],
    'Y': [2000, 2030], '1': [2001, 2031], '2': [2002, 2032], '3': [2003, 2033],
    '4': [2004, 2034], '5': [2005, 2035], '6': [2006, 2036], '7': [2007, 2037],
    '8': [2008, 2038], '9': [2009, 2039]
  };

  let decodedYear: number | undefined = undefined;
  const possibleYears = yearMap[yearChar];
  if (possibleYears) {
    const currentYear = new Date().getFullYear();
    // Select the most likely year based on current date
    // Prefer the year that's closest to current year but not too far in the future
    decodedYear = possibleYears[0];
    for (const year of possibleYears) {
      if (year <= currentYear + 1 && year > decodedYear) {
        decodedYear = year;
      }
    }
  }

  return {
    wmi,
    vds,
    vis,
    year: decodedYear,
    isValid: isValidVIN(vin),
  };
}

/**
 * Gets user-friendly validation error message for VIN
 * @param vin - VIN string to validate
 * @returns Error message or null if valid
 */
export function getVINValidationError(vin: string): string | null {
  if (vin.length === 0) return null; // Allow empty for initial state
  
  if (vin.length < 17) {
    return `VIN must be 17 characters (currently ${vin.length})`;
  }
  
  if (vin.length > 17) {
    return 'VIN too long (maximum 17 characters)';
  }
  
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return 'Invalid characters (letters I, O, Q are not allowed)';
  }
  
  if (!isValidVIN(vin)) {
    return 'Invalid VIN checksum';
  }
  
  return null;
}