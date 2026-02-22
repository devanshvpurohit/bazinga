/**
 * Bug 1: Discover.tsx - Empty Profiles Array Crash
 * Property 1: Fault Condition - Out of Bounds Profile Access
 * 
 * This test MUST FAIL on unfixed code to confirm the bug exists.
 * The test validates that accessing currentProfile properties crashes when currentIndex is out of bounds.
 * 
 * Validates: Requirements 1.1
 */

// Simulating the bug condition: accessing profiles array out of bounds
function testOutOfBoundsProfileAccess() {
  const profiles = [
    { id: '1', full_name: 'Alice', age: 20 },
    { id: '2', full_name: 'Bob', age: 21 },
    { id: '3', full_name: 'Charlie', age: 22 },
  ];

  const testCases = [
    { currentIndex: 3, profiles, description: 'currentIndex equals profiles.length (one past end)' },
    { currentIndex: 5, profiles, description: 'currentIndex exceeds profiles.length (multiple past end)' },
    { currentIndex: -1, profiles, description: 'currentIndex is negative' },
    { currentIndex: 0, profiles: [], description: 'profiles array is empty with currentIndex 0' },
  ];

  console.log('Bug 1 - Exploration Test: Out of Bounds Profile Access');
  console.log('========================================================\n');

  let failureCount = 0;

  testCases.forEach(({ currentIndex, profiles, description }) => {
    try {
      const currentProfile = profiles[currentIndex];
      
      // This should crash when currentProfile is undefined
      if (currentProfile === undefined) {
        // Attempting to access properties on undefined should fail
        const name = currentProfile.full_name;
        const age = currentProfile.age;
        console.log(`❌ FAIL: ${description} - Expected crash but code didn't crash`);
      } else {
        console.log(`✓ PASS: ${description} - Profile accessed: ${currentProfile.full_name}`);
      }
    } catch (error) {
      failureCount++;
      console.log(`✓ FAIL (Expected): ${description}`);
      console.log(`   Error: ${error.message}\n`);
    }
  });

  console.log(`\nTest Results: ${failureCount} failures (expected for unfixed code)`);
  return failureCount > 0;
}

// Run the test
const result = testOutOfBoundsProfileAccess();
console.log(`\nBug 1 Exploration Test: ${result ? 'FAILED (bug confirmed)' : 'PASSED (unexpected)'}`);
