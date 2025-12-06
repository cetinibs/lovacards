# Design Document

## Overview

This design document outlines the technical approach for implementing comprehensive improvements to the LoveCard.ai application. The improvements are organized into several key areas: testing infrastructure, error handling, data persistence, accessibility, performance optimization, and enhanced user experience features.

The design follows React best practices, leverages TypeScript for type safety, and implements modern patterns including custom hooks, context providers, and error boundaries. The solution maintains backward compatibility while significantly improving code quality, user experience, and maintainability.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App Component                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Error Boundary Wrapper                    │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │           Context Providers Layer                │ │ │
│  │  │  - CardDataContext                               │ │ │
│  │  │  - ThemeContext                                  │ │ │
│  │  │  - LanguageContext                               │ │ │
│  │  │  ┌────────────────────────────────────────────┐ │ │ │
│  │  │  │         UI Components                      │ │ │ │
│  │  │  │  - Form Components (validated)             │ │ │ │
│  │  │  │  - Card Preview                            │ │ │ │
│  │  │  │  - Accessibility Enhanced UI               │ │ │ │
│  │  │  └────────────────────────────────────────────┘ │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Custom Hooks   │  │    Services     │  │     Utils       │
│  - useCardData  │  │  - geminiService│  │  - validation   │
│  - useLocalStor │  │  - storage      │  │  - sanitization │
│  - useValidation│  │                 │  │  - formatters   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Layer Responsibilities

1. **Error Boundary Layer**: Catches and handles runtime errors gracefully
2. **Context Layer**: Provides global state management without prop drilling
3. **Component Layer**: Presentational and container components with accessibility features
4. **Hooks Layer**: Reusable business logic and state management
5. **Services Layer**: External API communication and data operations
6. **Utils Layer**: Pure functions for validation, sanitization, and formatting

## Components and Interfaces

### 1. Context Providers

#### CardDataContext
```typescript
interface CardDataContextType {
  cardData: CardData;
  updateCardData: (field: keyof CardData, value: any) => void;
  resetCardData: () => void;
  saveCard: () => Promise<void>;
  loadCard: (id: string) => Promise<void>;
  cardHistory: CardData[];
  isLoading: boolean;
  error: string | null;
}
```

#### ThemeContext
```typescript
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}
```

#### LanguageContext
```typescript
interface LanguageContextType {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: TranslationObject;
}
```

### 2. Custom Hooks

#### useCardData
Manages card data state with automatic persistence to LocalStorage.

```typescript
interface UseCardDataReturn {
  cardData: CardData;
  updateField: (field: keyof CardData, value: any) => void;
  reset: () => void;
  save: () => Promise<void>;
  load: (id: string) => Promise<void>;
  history: CardData[];
}
```

#### useValidation
Provides form validation logic with real-time feedback.

```typescript
interface ValidationRules {
  recipientName: (value: string) => ValidationResult;
  bouquet: (value: Flower[]) => ValidationResult;
  poem: (value: string) => ValidationResult;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}
```

#### useLocalStorage
Generic hook for LocalStorage operations with error handling.

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void];
```

### 3. Error Boundary Component

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
```

### 4. Enhanced Form Components

#### ValidatedInput
```typescript
interface ValidatedInputProps {
  value: string;
  onChange: (value: string) => void;
  validation: (value: string) => ValidationResult;
  label: string;
  placeholder?: string;
  maxLength?: number;
  ariaLabel?: string;
  required?: boolean;
}
```

#### AccessibleButton
```typescript
interface AccessibleButtonProps {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  ariaDescribedBy?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}
```

## Data Models

### Enhanced CardData
```typescript
interface CardData {
  id: string; // UUID for unique identification
  recipientName: string;
  occasion: string;
  bouquet: Flower[];
  poem: string;
  music: MusicTrack | null;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
}
```

### ValidationError
```typescript
interface ValidationError {
  field: keyof CardData;
  message: string;
  code: ValidationErrorCode;
}

enum ValidationErrorCode {
  REQUIRED = 'REQUIRED',
  TOO_LONG = 'TOO_LONG',
  TOO_SHORT = 'TOO_SHORT',
  INVALID_FORMAT = 'INVALID_FORMAT',
  MAX_ITEMS = 'MAX_ITEMS',
}
```

### StorageSchema
```typescript
interface StorageSchema {
  currentCard: CardData | null;
  cardHistory: CardData[];
  usageCount: number;
  preferences: {
    lang: LangCode;
    isDarkMode: boolean;
  };
  version: string; // For migration support
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Input Sanitization Preserves Safe Content
*For any* user text input containing only safe characters, sanitization should return the input unchanged while removing any potentially dangerous content from inputs containing malicious patterns.
**Validates: Requirements 9.1, 9.4**

### Property 2: Recipient Name Validation Rejects Whitespace-Only Strings
*For any* string composed entirely of whitespace characters (spaces, tabs, newlines), the validation function should reject it as invalid.
**Validates: Requirements 9.2, 2.3**

### Property 3: Bouquet Size Constraint Enforcement
*For any* bouquet selection operation, the resulting bouquet should never exceed 9 flowers, regardless of how many times the user attempts to add flowers.
**Validates: Requirements 9.3**

### Property 4: LocalStorage Round-Trip Consistency
*For any* valid CardData object, saving to LocalStorage and then loading should produce an equivalent CardData object with all fields preserved.
**Validates: Requirements 3.1, 3.2**

### Property 5: Language Switching Preserves Card Data
*For any* CardData state and any language switch operation, the card data should remain unchanged except for the occasion field which should be translated to the new language.
**Validates: Requirements 7.1, 7.2**

### Property 6: Error Boundary Preserves Card Data
*For any* CardData state when an error occurs and is caught by the error boundary, the card data should be preserved and recoverable after error resolution.
**Validates: Requirements 10.4**

### Property 7: Validation State Consistency
*For any* form field, if the validation function returns invalid for a value, the form should not allow progression to the next step with that value.
**Validates: Requirements 2.3**

### Property 8: Memoization Prevents Unnecessary Re-renders
*For any* component wrapped with React.memo, if props remain referentially equal between renders, the component should not re-render.
**Validates: Requirements 5.1**

### Property 9: Keyboard Navigation Completeness
*For any* interactive element in the application, it should be reachable and operable using only keyboard navigation (Tab, Enter, Space, Arrow keys).
**Validates: Requirements 4.1, 4.4**

### Property 10: ARIA Label Presence
*For any* interactive UI element without visible text, it should have an appropriate aria-label or aria-labelledby attribute.
**Validates: Requirements 4.2**

### Property 11: Debounced Function Call Frequency
*For any* debounced function with delay D milliseconds, if called N times within D milliseconds, it should execute at most once after the last call.
**Validates: Requirements 5.3**

### Property 12: Error Message Localization
*For any* error that occurs in the application, the error message displayed to the user should be in the currently selected language.
**Validates: Requirements 7.3**

### Property 13: State Update Immutability
*For any* state update operation, the previous state object should remain unchanged (immutable), and a new state object should be created.
**Validates: Requirements 8.3**

### Property 14: Maximum Input Length Enforcement
*For any* text input with a maximum length constraint of N characters, the input should reject any string longer than N characters.
**Validates: Requirements 2.5**

### Property 15: Corrupted Storage Recovery
*For any* corrupted or invalid data in LocalStorage, the application should initialize with default values without crashing.
**Validates: Requirements 3.5**

## Error Handling

### Error Categories

1. **Validation Errors**: User input that doesn't meet requirements
2. **Network Errors**: API communication failures
3. **Storage Errors**: LocalStorage quota exceeded or access denied
4. **Runtime Errors**: Unexpected JavaScript errors
5. **AI Service Errors**: Gemini API failures

### Error Handling Strategy

#### Validation Errors
- Display inline error messages next to the relevant field
- Prevent form submission until errors are resolved
- Provide clear guidance on how to fix the error

#### Network Errors
```typescript
interface NetworkErrorHandler {
  onError: (error: Error) => void;
  retry: () => Promise<void>;
  maxRetries: number;
  retryDelay: number;
}
```

- Show toast notification with error message
- Provide retry button
- Implement exponential backoff for retries
- Fall back to cached data when available

#### Storage Errors
- Catch quota exceeded errors
- Prompt user to clear old data
- Implement data compression for large objects
- Provide export functionality as backup

#### Runtime Errors
- Error boundary catches unhandled errors
- Display user-friendly error page
- Log error details to console (development) or error tracking service (production)
- Provide "Reset Application" option

#### AI Service Errors
- Use fallback poem templates when API fails
- Display clear message about AI unavailability
- Allow manual poem entry as alternative
- Cache successful responses for offline use

### Error Recovery Flows

```typescript
interface ErrorRecoveryStrategy {
  canRecover: boolean;
  recoveryAction: () => Promise<void>;
  fallbackAction: () => void;
  userMessage: string;
}
```

## Testing Strategy

### Unit Testing

**Framework**: Vitest (fast, Vite-native test runner)

**Coverage Areas**:
- Validation functions (pure functions, easy to test)
- Sanitization utilities
- Formatting functions
- Custom hooks (using @testing-library/react-hooks)
- Context providers
- Error boundary behavior

**Example Unit Tests**:
```typescript
describe('validateRecipientName', () => {
  it('should accept valid names', () => {
    expect(validateRecipientName('Sarah')).toEqual({ isValid: true });
  });

  it('should reject empty strings', () => {
    expect(validateRecipientName('')).toEqual({ 
      isValid: false, 
      error: 'Name is required' 
    });
  });

  it('should reject whitespace-only strings', () => {
    expect(validateRecipientName('   ')).toEqual({ 
      isValid: false, 
      error: 'Name cannot be only whitespace' 
    });
  });
});
```

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run minimum 100 iterations

**Test Tagging Format**: `**Feature: lovecard-improvements, Property {number}: {property_text}**`

**Coverage Areas**:
- Input sanitization across random strings
- Validation logic across edge cases
- State management consistency
- LocalStorage round-trip operations
- Language switching behavior

**Example Property Tests**:
```typescript
import fc from 'fast-check';

describe('Property Tests', () => {
  /**
   * Feature: lovecard-improvements, Property 1: Input Sanitization Preserves Safe Content
   * Validates: Requirements 9.1, 9.4
   */
  it('should preserve safe content while removing dangerous patterns', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (input) => {
          const sanitized = sanitizeInput(input);
          const hasDangerousContent = /<script|javascript:|onerror=/i.test(input);
          
          if (!hasDangerousContent) {
            expect(sanitized).toBe(input);
          } else {
            expect(sanitized).not.toContain('<script');
            expect(sanitized).not.toContain('javascript:');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: lovecard-improvements, Property 2: Recipient Name Validation Rejects Whitespace-Only Strings
   * Validates: Requirements 9.2, 2.3
   */
  it('should reject any string composed entirely of whitespace', () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom(' ', '\t', '\n', '\r')),
        (whitespaceString) => {
          const result = validateRecipientName(whitespaceString);
          expect(result.isValid).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: lovecard-improvements, Property 3: Bouquet Size Constraint Enforcement
   * Validates: Requirements 9.3
   */
  it('should never allow bouquet to exceed 9 flowers', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 9 }), { minLength: 1, maxLength: 20 }),
        (flowerIds) => {
          let bouquet: Flower[] = [];
          flowerIds.forEach(id => {
            bouquet = addFlowerToBouquet(bouquet, FLOWERS[id % FLOWERS.length]);
          });
          expect(bouquet.length).toBeLessThanOrEqual(9);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: lovecard-improvements, Property 4: LocalStorage Round-Trip Consistency
   * Validates: Requirements 3.1, 3.2
   */
  it('should preserve all card data through save and load cycle', () => {
    fc.assert(
      fc.property(
        fc.record({
          recipientName: fc.string({ minLength: 1, maxLength: 50 }),
          occasion: fc.constantFrom(...Object.values(OCCASIONS)),
          bouquet: fc.array(fc.constantFrom(...FLOWERS), { maxLength: 9 }),
          poem: fc.string({ maxLength: 500 }),
        }),
        (cardData) => {
          const saved = saveToLocalStorage('test-card', cardData);
          const loaded = loadFromLocalStorage('test-card');
          
          expect(loaded).toEqual(cardData);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**Framework**: React Testing Library

**Coverage Areas**:
- Multi-step form flow
- Error boundary integration
- Context provider interactions
- Accessibility features (keyboard navigation, screen reader announcements)

### Accessibility Testing

**Tools**: 
- jest-axe for automated accessibility testing
- Manual keyboard navigation testing
- Screen reader testing (NVDA/JAWS)

**Tests**:
- All interactive elements have proper ARIA labels
- Focus management works correctly
- Color contrast meets WCAG AA standards
- Keyboard navigation covers all functionality

## Performance Optimization

### Memoization Strategy

1. **Component Memoization**: Use `React.memo` for expensive components
   - RecipientCard (complex rendering)
   - FlowerGrid (large list)
   - ProModal (conditional rendering)

2. **Value Memoization**: Use `useMemo` for expensive calculations
   - Filtered/sorted lists
   - Derived state calculations
   - Translation lookups

3. **Callback Memoization**: Use `useCallback` for event handlers
   - Prevents child component re-renders
   - Stabilizes dependency arrays

### Code Splitting

```typescript
// Lazy load heavy components
const RecipientCard = lazy(() => import('./components/RecipientCard'));
const ProModal = lazy(() => import('./components/ProModal'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <RecipientCard data={cardData} />
</Suspense>
```

### Debouncing Strategy

```typescript
// Debounce rapid state updates
const debouncedSave = useMemo(
  () => debounce((data: CardData) => saveToLocalStorage(data), 500),
  []
);
```

### Asset Optimization

- Lazy load images
- Use appropriate image formats (WebP with fallbacks)
- Implement intersection observer for off-screen content
- Minimize bundle size with tree-shaking

## Implementation Phases

### Phase 1: Foundation (Testing & Error Handling)
- Set up testing infrastructure (Vitest, fast-check, React Testing Library)
- Implement error boundary
- Create validation utilities
- Add input sanitization

### Phase 2: State Management
- Implement Context providers
- Create custom hooks
- Refactor App.tsx to use contexts
- Add state persistence

### Phase 3: Accessibility
- Add ARIA labels and roles
- Implement keyboard navigation
- Add focus management
- Test with screen readers

### Phase 4: Performance
- Add memoization
- Implement code splitting
- Add debouncing
- Optimize re-renders

### Phase 5: Enhanced Features
- Card history
- Template system
- Enhanced sharing
- Poem editing

### Phase 6: Polish
- Comprehensive testing
- Documentation
- Performance profiling
- Accessibility audit

## Migration Strategy

### Backward Compatibility

- Existing localStorage data should be migrated automatically
- Version field in storage schema enables migration logic
- Fallback to defaults if migration fails

### Migration Function

```typescript
function migrateStorageData(oldData: any): StorageSchema {
  const version = oldData.version || '0.0.0';
  
  if (version === '0.0.0') {
    // Migrate from old format to new format
    return {
      currentCard: null,
      cardHistory: [],
      usageCount: oldData.loveCardUsage || 0,
      preferences: {
        lang: 'en',
        isDarkMode: false,
      },
      version: '1.0.0',
    };
  }
  
  return oldData;
}
```

## Security Considerations

### Input Sanitization

- Strip HTML tags from user input
- Escape special characters
- Validate against XSS patterns
- Use DOMPurify library for robust sanitization

### Content Security Policy

```typescript
// Recommended CSP headers
const csp = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"], // Vite requires unsafe-inline in dev
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'", 'https://generativelanguage.googleapis.com'],
};
```

### API Key Protection

- Never expose API keys in client code
- Use environment variables
- Implement rate limiting
- Consider backend proxy for API calls

## Monitoring and Logging

### Error Tracking

```typescript
interface ErrorLog {
  timestamp: Date;
  error: Error;
  componentStack: string;
  userAgent: string;
  cardDataSnapshot: Partial<CardData>;
}
```

### Performance Monitoring

- Track component render times
- Monitor API response times
- Log LocalStorage operations
- Track user flow completion rates

## Documentation Requirements

- JSDoc comments for all public functions
- README updates with new features
- Component usage examples
- Testing guide
- Accessibility guide
- Performance optimization guide
