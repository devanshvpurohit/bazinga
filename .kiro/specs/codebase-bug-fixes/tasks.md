# Implementation Plan - Codebase Bug Fixes

## Bug 1: Discover.tsx - Empty Profiles Array Crash

- [-] 1.1 Write bug condition exploration test
  - **Property 1: Fault Condition** - Out of Bounds Profile Access
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases: currentIndex >= profiles.length
  - Test that accessing currentProfile properties crashes when currentIndex is out of bounds
  - Test cases:
    - currentIndex equals profiles.length (one past end)
    - currentIndex exceeds profiles.length (multiple past end)
    - currentIndex is negative
    - profiles array is empty with currentIndex 0
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause (e.g., "TypeError: Cannot read property 'name' of undefined")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1_

- [ ] 1.2 Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Valid Profile Index Access
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for valid profile indices
  - Test cases for non-buggy inputs:
    - currentIndex is 0 with populated profiles array
    - currentIndex is within valid bounds (0 to profiles.length - 1)
    - Profile properties are accessible and correct
    - Toast messages display correctly for valid profiles
  - Write property-based test: for all valid currentIndex values (0 <= currentIndex < profiles.length), profile properties are accessible and toast displays correctly
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1_

- [ ] 1.3 Fix for empty profiles array crash

  - [ ] 1.3.1 Implement bounds checking and safe property access
    - Add bounds check before accessing currentProfile: `if (currentIndex < 0 || currentIndex >= profiles.length) return null`
    - Use optional chaining for profile property access: `currentProfile?.name`, `currentProfile?.age`
    - Add null check before displaying toast message
    - Reset currentIndex to 0 if it exceeds new array length when profiles update
    - _Bug_Condition: currentIndex >= profiles.length OR currentIndex < 0_
    - _Expected_Behavior: System safely handles undefined currentProfile without crashing_
    - _Preservation: Valid profile indices continue to display correctly_
    - _Requirements: 1.1, 2.1, 3.1_

  - [ ] 1.3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Out of Bounds Profile Access Handled
    - **IMPORTANT**: Re-run the SAME test from task 1.1 - do NOT write a new test
    - The test from task 1.1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1.1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1_

  - [ ] 1.3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Valid Profile Index Access
    - **IMPORTANT**: Re-run the SAME tests from task 1.2 - do NOT write new tests
    - Run preservation property tests from step 1.2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1_

---

## Bug 2: Messages.tsx - Scroll Area Ref Issue

- [ ] 2.1 Write bug condition exploration test
  - **Property 1: Fault Condition** - Auto-Scroll Failure
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases: new message arrives and auto-scroll is triggered
  - Test that auto-scroll fails when scrollAreaRef doesn't expose scrollTo method
  - Test cases:
    - New message arrives, auto-scroll should scroll to bottom but doesn't
    - Multiple messages arrive rapidly, scroll position doesn't reach bottom
    - scrollAreaRef.current doesn't have scrollTo method
    - Viewport element is not accessible via ref
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause (e.g., "scrollAreaRef.current.scrollTo is not a function")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.2_

- [ ] 2.2 Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Manual Scrolling and Message Display
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-auto-scroll operations
  - Test cases for non-buggy inputs:
    - Manual scrolling works correctly
    - Messages render and display correctly
    - Message list layout is preserved
    - User can scroll through message history manually
  - Write property-based test: for all message sequences without auto-scroll, messages display correctly and manual scrolling works
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.2_

- [ ] 2.3 Fix for scroll area ref issue

  - [ ] 2.3.1 Implement correct ref mechanism for auto-scroll
    - Change scrollAreaRef to point to the viewport element instead of ScrollArea component
    - Use `scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]')` to access viewport
    - Or create separate ref directly on scrollable container div
    - Update useEffect that triggers auto-scroll to use correct DOM element
    - Call `scrollTop = scrollHeight` on viewport element for bottom scroll
    - Add null checks before calling scroll methods
    - _Bug_Condition: scrollAreaRef.current does not have scrollTo method_
    - _Expected_Behavior: Auto-scroll works correctly by accessing viewport element_
    - _Preservation: Manual scrolling and message display continue to work_
    - _Requirements: 1.2, 2.2, 3.2_

  - [ ] 2.3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Auto-Scroll Works Correctly
    - **IMPORTANT**: Re-run the SAME test from task 2.1 - do NOT write a new test
    - The test from task 2.1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 2.1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.2_

  - [ ] 2.3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Manual Scrolling and Message Display
    - **IMPORTANT**: Re-run the SAME tests from task 2.2 - do NOT write new tests
    - Run preservation property tests from step 2.2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.2_

---

## Bug 3: Messages.tsx - VoiceNoteRecorder Double Rendering

- [ ] 3.1 Write bug condition exploration test
  - **Property 1: Fault Condition** - Duplicate VoiceNoteRecorder Instances
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing case: Messages component renders with input area
  - Test that VoiceNoteRecorder component is rendered exactly once
  - Test cases:
    - Render Messages component and count VoiceNoteRecorder instances (expect 1, get 2)
    - Verify both instances are mounted simultaneously
    - Check that recording state is duplicated across instances
    - Verify cleanup runs twice on unmount
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause (e.g., "Expected 1 VoiceNoteRecorder instance, found 2")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.3_

- [ ] 3.2 Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Voice Note Recording and Message Sending
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for normal voice recording operations
  - Test cases for non-buggy inputs:
    - Voice note recording works correctly
    - Messages are sent successfully
    - Message input area layout is preserved
    - User interactions with input area work as expected
  - Write property-based test: for all voice recording and message sending operations, functionality works correctly despite duplicate instances
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.3_

- [ ] 3.3 Fix for VoiceNoteRecorder double rendering

  - [ ] 3.3.1 Remove duplicate VoiceNoteRecorder instance
    - Search for all VoiceNoteRecorder components in Messages.tsx
    - Identify the duplicate instance (likely in conditional block and button area)
    - Remove the duplicate, keeping only one instance in the correct location
    - Consolidate any conditional logic into a single render
    - Verify state is managed at correct component level
    - Ensure cleanup logic runs only once in useEffect
    - _Bug_Condition: VoiceNoteRecorder appears in multiple render locations_
    - _Expected_Behavior: VoiceNoteRecorder renders exactly once_
    - _Preservation: Voice note recording and message sending continue to work_
    - _Requirements: 1.3, 2.3, 3.3_

  - [ ] 3.3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Single VoiceNoteRecorder Instance
    - **IMPORTANT**: Re-run the SAME test from task 3.1 - do NOT write a new test
    - The test from task 3.1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 3.1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.3_

  - [ ] 3.3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Voice Note Recording and Message Sending
    - **IMPORTANT**: Re-run the SAME tests from task 3.2 - do NOT write new tests
    - Run preservation property tests from step 3.2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.3_

---

## Bug 4: Discover.tsx - Null Reference in calculateCompatibility

- [ ] 4.1 Write bug condition exploration test
  - **Property 1: Fault Condition** - Undefined Interests Array Access
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases: other.interests is undefined or null
  - Test that calculateCompatibility crashes when other.interests is undefined
  - Test cases:
    - calculateCompatibility(user1, user2) where user2.interests is undefined
    - calculateCompatibility(user1, user2) where user2.interests is null
    - calculateCompatibility(user1, user2) where user2 is missing interests property
    - Verify crash occurs on .includes() call
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause (e.g., "TypeError: Cannot read property 'includes' of undefined")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.4_

- [ ] 4.2 Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Valid Compatibility Calculations
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for users with defined interests
  - Test cases for non-buggy inputs:
    - calculateCompatibility with both users having defined interests arrays
    - Compatibility scores are calculated correctly
    - Profile matching logic works as expected
    - User profile data handling is preserved
  - Write property-based test: for all user pairs with defined interests, compatibility scores are calculated correctly and consistently
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.4_

- [ ] 4.3 Fix for null reference in calculateCompatibility

  - [ ] 4.3.1 Add null checks and safe property access
    - Add input validation at function entry: verify both user objects exist
    - Add null check before calling .includes(): `other.interests?.includes(interest)`
    - Or provide default empty array: `const interests = other.interests || []`
    - Return safe default value (0 or null) if validation fails
    - Add logging for debugging purposes when data is invalid
    - _Bug_Condition: other.interests is undefined or null_
    - _Expected_Behavior: calculateCompatibility handles undefined interests gracefully_
    - _Preservation: Compatibility calculations with valid data remain unchanged_
    - _Requirements: 1.4, 2.4, 3.4_

  - [ ] 4.3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Undefined Interests Handled Gracefully
    - **IMPORTANT**: Re-run the SAME test from task 4.1 - do NOT write a new test
    - The test from task 4.1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 4.1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.4_

  - [ ] 4.3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Valid Compatibility Calculations
    - **IMPORTANT**: Re-run the SAME tests from task 4.2 - do NOT write new tests
    - Run preservation property tests from step 4.2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.4_

---

## Bug 5: Messages.tsx - Missing Error Handling for Image Upload

- [ ] 5.1 Write bug condition exploration test
  - **Property 1: Fault Condition** - Orphaned Image After Failed Insert
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing case: upload succeeds, insert fails
  - Test that image remains orphaned in storage when message insert fails
  - Test cases:
    - Image uploads successfully, message insert fails due to network error
    - Image exists in storage after insert failure
    - No cleanup function is triggered
    - Orphaned image consumes storage space
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause (e.g., "Image exists in storage but no corresponding message created")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.5_

- [ ] 5.2 Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Successful Image Upload and Message Creation
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for successful upload and insert operations
  - Test cases for non-buggy inputs:
    - Image uploads successfully and message insert succeeds
    - Image is properly associated with message
    - Message sending and receiving functionality works
    - User notifications for successful operations display correctly
  - Write property-based test: for all successful image upload and message creation operations, images are properly stored and associated with messages
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.5_

- [ ] 5.3 Fix for missing error handling for image upload

  - [ ] 5.3.1 Add error handling and cleanup for failed inserts
    - Wrap message insert operation in try-catch block
    - Create cleanup function to delete orphaned images from storage
    - If insert fails, immediately call cleanup to delete uploaded image
    - Notify user of upload failure with error message
    - Add logging for upload success/failure and cleanup operations
    - Ensure transaction-like behavior: upload and insert are atomic
    - _Bug_Condition: uploadResult.success is true AND insertResult.success is false_
    - _Expected_Behavior: Orphaned image is cleaned up from storage_
    - _Preservation: Successful uploads and inserts continue to work_
    - _Requirements: 1.5, 2.5, 3.5_

  - [ ] 5.3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Orphaned Images Cleaned Up
    - **IMPORTANT**: Re-run the SAME test from task 5.1 - do NOT write a new test
    - The test from task 5.1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 5.1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.5_

  - [ ] 5.3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Successful Image Upload and Message Creation
    - **IMPORTANT**: Re-run the SAME tests from task 5.2 - do NOT write new tests
    - Run preservation property tests from step 5.2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.5_

---

## Bug 6: Console Statements in Production

- [ ] 6.1 Write bug condition exploration test
  - **Property 1: Fault Condition** - Debug Statements in Production
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing case: environment is production
  - Test that console.log() and console.error() statements execute in production
  - Test cases:
    - Production build runs and console.log statements execute
    - Debug information is visible in browser console
    - console.error() outputs stack traces in production
    - Environment detection is incorrect or missing
  - Run test on UNFIXED code (production build)
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause (e.g., "Debug logs visible in production console")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.6_

- [ ] 6.2 Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Development Mode Logging
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code in development mode
  - Test cases for non-buggy inputs:
    - Development mode outputs debug information to console
    - Error logging for actual errors works correctly
    - Application functionality remains unchanged
    - Performance in development mode is preserved
  - Write property-based test: for all development environment operations, debug information is logged correctly
  - Run tests on UNFIXED code (development build)
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.6_

- [ ] 6.3 Fix for console statements in production

  - [ ] 6.3.1 Create environment-aware logger and replace all console statements
    - Create logger utility that checks `process.env.NODE_ENV`
    - Logger should only output in development mode
    - Provide no-op function for production
    - Search for all `console.log()` statements and replace with `logger.log()`
    - Search for all `console.error()` statements and replace with `logger.error()`
    - Verify environment detection works correctly
    - Consider using proper error tracking service for production errors
    - Ensure production build strips debug code via tree-shaking
    - _Bug_Condition: environment is "production" AND console statements execute_
    - _Expected_Behavior: Console statements do not execute in production_
    - _Preservation: Development mode logging continues to work_
    - _Requirements: 1.6, 2.6, 3.6_

  - [ ] 6.3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - No Debug Statements in Production
    - **IMPORTANT**: Re-run the SAME test from task 6.1 - do NOT write a new test
    - The test from task 6.1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 6.1 (production build)
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.6_

  - [ ] 6.3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Development Mode Logging
    - **IMPORTANT**: Re-run the SAME tests from task 6.2 - do NOT write new tests
    - Run preservation property tests from step 6.2 (development build)
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.6_

---

## Checkpoint

- [ ] 7. Checkpoint - Ensure all tests pass
  - Verify all exploration tests pass (Property 1 tests for all 6 bugs)
  - Verify all preservation tests pass (Property 2 tests for all 6 bugs)
  - Confirm no regressions in existing functionality
  - Ensure all implementation tasks are complete
  - Ask the user if questions arise
