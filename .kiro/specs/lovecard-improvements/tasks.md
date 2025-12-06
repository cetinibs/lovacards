# Implementation Plan

- [ ] 1. Set up testing infrastructure and utilities
  - Install and configure Vitest, fast-check, React Testing Library, and jest-axe
  - Create test setup files and configuration
  - Set up test utilities and helpers
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Implement validation and sanitization utilities
  - Create validation utility functions for all input types
  - Implement input sanitization to prevent XSS attacks
  - Add validation error types and interfaces
  - _Requirements: 9.1, 9.2, 9.4, 9.5, 2.5_

- [ ]* 2.1 Write property test for input sanitization
  - **Property 1: Input Sanitization Preserves Safe Content**
  - **Validates: Requirements 9.1, 9.4**

- [ ]* 2.2 Write property test for recipient name validation
  - **Property 2: Recipient Name Validation Rejects Whitespace-Only Strings**
  - **Validates: Requirements 9.2, 2.3**

- [ ]* 2.3 Write property test for maximum input length
  - **Property 14: Maximum Input Length Enforcement**
  - **Validates: Requirements 2.5**

- [ ]* 2.4 Write property test for email/URL validation
  - **Property: Email and URL Format Validation**
  - **Validates: Requirements 9.5**

- [ ] 3. Create LocalStorage service with error handling
  - Implement storage service with get, set, remove, and clear methods
  - Add error handling for quota exceeded and access denied
  - Implement data migration logic for version updates
  - Create storage schema types
  - _Requirements: 3.1, 3.2, 3.5_

- [ ]* 3.1 Write property test for LocalStorage round-trip
  - **Property 4: LocalStorage Round-Trip Consistency**
  - **Validates: Requirements 3.1, 3.2**

- [ ]* 3.2 Write unit test for corrupted storage recovery
  - Test that corrupted data initializes with defaults
  - **Validates: Requirements 3.5**

- [ ] 4. Implement custom hooks for state management
  - Create useLocalStorage hook with generic type support
  - Implement useCardData hook with auto-save functionality
  - Create useValidation hook for form validation
  - Add useDebounce hook for performance optimization
  - _Requirements: 8.1, 8.2, 8.3, 8.5, 5.3_

- [ ]* 4.1 Write property test for state immutability
  - **Property 13: State Update Immutability**
  - **Validates: Requirements 8.3**

- [ ]* 4.2 Write property test for debounce behavior
  - **Property 11: Debounced Function Call Frequency**
  - **Validates: Requirements 5.3**

- [ ] 5. Create Context providers for global state
  - Implement CardDataContext with CRUD operations
  - Create ThemeContext for dark mode management
  - Implement LanguageContext with translation support
  - Add context provider composition component
  - _Requirements: 8.1, 8.2, 7.1_

- [ ]* 5.1 Write property test for language switching
  - **Property 5: Language Switching Preserves Card Data**
  - **Validates: Requirements 7.1, 7.2**

- [ ]* 5.2 Write unit tests for context providers
  - Test CardDataContext operations
  - Test ThemeContext toggle behavior
  - Test LanguageContext translation lookups
  - _Requirements: 8.1, 8.2_

- [ ] 6. Implement Error Boundary component
  - Create ErrorBoundary component with error catching
  - Implement error fallback UI with recovery options
  - Add error logging functionality
  - Preserve card data on error occurrence
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]* 6.1 Write property test for error boundary data preservation
  - **Property 6: Error Boundary Preserves Card Data**
  - **Validates: Requirements 10.4**

- [ ]* 6.2 Write integration test for error boundary
  - Test error catching and fallback UI display
  - Test recovery functionality
  - _Requirements: 10.1, 10.2, 10.5_

- [ ] 7. Create validated form components
  - Implement ValidatedInput component with real-time validation
  - Create AccessibleButton component with ARIA support
  - Add FormField wrapper with error display
  - Implement form validation state management
  - _Requirements: 2.1, 2.3, 4.1, 4.2_

- [ ]* 7.1 Write property test for validation state consistency
  - **Property 7: Validation State Consistency**
  - **Validates: Requirements 2.3**

- [ ]* 7.2 Write unit tests for form components
  - Test ValidatedInput validation display
  - Test AccessibleButton ARIA attributes
  - Test FormField error rendering
  - _Requirements: 2.1, 4.2_

- [ ] 8. Enhance bouquet selection with constraints
  - Update toggleFlower function to enforce 9-flower maximum
  - Add visual feedback for maximum reached
  - Implement bouquet validation
  - _Requirements: 9.3_

- [ ]* 8.1 Write property test for bouquet size constraint
  - **Property 3: Bouquet Size Constraint Enforcement**
  - **Validates: Requirements 9.3**

- [ ] 9. Refactor App.tsx to use Context providers
  - Wrap App with all context providers
  - Replace local state with context consumption
  - Update event handlers to use context actions
  - Remove prop drilling by using contexts
  - _Requirements: 8.1, 8.2_

- [ ]* 9.1 Write integration tests for refactored App
  - Test multi-step form flow with contexts
  - Test state persistence across navigation
  - _Requirements: 8.1, 8.2_

- [ ] 10. Implement card history and persistence
  - Add card history storage in LocalStorage
  - Create card history display component
  - Implement load card from history functionality
  - Add auto-save on card data changes
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]* 10.1 Write property test for card history
  - **Property: Card History Completeness**
  - **Validates: Requirements 3.3, 3.4**

- [ ]* 10.2 Write integration test for card persistence
  - Test auto-save functionality
  - Test card restoration on app reload
  - _Requirements: 3.1, 3.2_

- [ ] 11. Add comprehensive error handling to Gemini service
  - Implement retry logic with exponential backoff
  - Add user-friendly error notifications
  - Create fallback poem templates
  - Add error recovery UI
  - _Requirements: 2.2, 2.4_

- [ ]* 11.1 Write unit tests for Gemini service error handling
  - Test retry logic
  - Test fallback behavior
  - Test error message display
  - _Requirements: 2.2, 2.4_

- [ ] 12. Implement accessibility features
  - Add ARIA labels to all interactive elements
  - Implement keyboard navigation support
  - Add focus management for modals and step transitions
  - Create skip navigation links
  - _Requirements: 4.1, 4.2, 4.4_

- [ ]* 12.1 Write property test for ARIA label presence
  - **Property 10: ARIA Label Presence**
  - **Validates: Requirements 4.2**

- [ ]* 12.2 Write property test for keyboard navigation
  - **Property 9: Keyboard Navigation Completeness**
  - **Validates: Requirements 4.1, 4.4**

- [ ]* 12.3 Write accessibility tests with jest-axe
  - Test all pages for WCAG violations
  - Test color contrast ratios
  - _Requirements: 4.3_

- [ ] 13. Add ARIA live regions for dynamic content
  - Implement live region for AI poem generation status
  - Add announcements for form validation errors
  - Create live region for step navigation
  - _Requirements: 4.5_

- [ ]* 13.1 Write unit tests for ARIA live regions
  - Test announcement triggers
  - Test screen reader compatibility
  - _Requirements: 4.5_

- [ ] 14. Implement performance optimizations
  - Add React.memo to RecipientCard, FlowerGrid, and ProModal
  - Implement useMemo for expensive calculations
  - Add useCallback for event handlers
  - Implement code splitting with React.lazy
  - _Requirements: 5.1, 5.2_

- [ ]* 14.1 Write property test for memoization
  - **Property 8: Memoization Prevents Unnecessary Re-renders**
  - **Validates: Requirements 5.1**

- [ ]* 14.2 Write performance tests
  - Test component render counts
  - Test memoization effectiveness
  - _Requirements: 5.1_

- [ ] 15. Enhance internationalization support
  - Persist language preference to LocalStorage
  - Ensure all error messages are localized
  - Add locale-based date and number formatting
  - Update Gemini service to respect language setting
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ]* 15.1 Write property test for error message localization
  - **Property 12: Error Message Localization**
  - **Validates: Requirements 7.3**

- [ ]* 15.2 Write property test for locale formatting
  - **Property: Locale-Based Formatting**
  - **Validates: Requirements 7.4**

- [ ]* 15.3 Write integration tests for language switching
  - Test language persistence
  - Test UI translation updates
  - Test AI poem language consistency
  - _Requirements: 7.1, 7.2_

- [ ] 16. Implement enhanced UX features
  - Add reset button with confirmation dialog
  - Create card template system
  - Implement poem editing functionality
  - Add shareable link generation
  - _Requirements: 6.1, 6.2, 6.4, 6.5_

- [ ]* 16.1 Write property test for shareable link preservation
  - **Property: Shareable Link Round-Trip**
  - **Validates: Requirements 6.4**

- [ ]* 16.2 Write unit tests for UX features
  - Test reset functionality
  - Test template switching
  - Test poem editing
  - _Requirements: 6.1, 6.2, 6.5_

- [ ] 17. Add comprehensive error notifications
  - Create toast notification system
  - Implement error notification component
  - Add success notifications for key actions
  - Ensure all notifications are accessible
  - _Requirements: 2.1, 2.2, 2.4_

- [ ]* 17.1 Write unit tests for notification system
  - Test notification display and dismissal
  - Test notification accessibility
  - _Requirements: 2.1_

- [ ] 18. Checkpoint - Ensure all tests pass
  - Run full test suite
  - Fix any failing tests
  - Verify all property tests pass with 100+ iterations
  - Check test coverage meets targets
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Implement validation for all form fields
  - Add validation to recipient name input
  - Validate occasion selection
  - Add bouquet validation feedback
  - Implement poem length validation
  - _Requirements: 2.1, 2.3, 2.5_

- [ ]* 19.1 Write integration tests for form validation
  - Test complete form validation flow
  - Test error message display
  - Test validation state updates
  - _Requirements: 2.1, 2.3_

- [ ] 20. Add loading states and skeletons
  - Implement loading spinner for AI generation
  - Add skeleton screens for lazy-loaded components
  - Create loading state for card history
  - Add progress indicators for multi-step form
  - _Requirements: 5.2_

- [ ]* 20.1 Write unit tests for loading states
  - Test loading indicator display
  - Test skeleton screen rendering
  - _Requirements: 5.2_

- [ ] 21. Implement data export functionality
  - Add export card as JSON
  - Implement export card as image
  - Create backup/restore functionality
  - _Requirements: 3.4_

- [ ]* 21.1 Write unit tests for export functionality
  - Test JSON export format
  - Test backup/restore operations
  - _Requirements: 3.4_

- [ ] 22. Add comprehensive documentation
  - Document all custom hooks with JSDoc
  - Add component usage examples
  - Create testing guide
  - Write accessibility guide
  - Update README with new features

- [ ] 23. Final checkpoint - Complete testing and validation
  - Run full test suite including property tests
  - Perform manual accessibility testing
  - Test keyboard navigation thoroughly
  - Verify all error scenarios
  - Check performance metrics
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 24. Code cleanup and optimization
  - Remove unused imports and code
  - Optimize bundle size
  - Add missing TypeScript types
  - Ensure consistent code style
  - Run linter and fix issues
