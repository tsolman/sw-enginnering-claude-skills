# Testing Patterns and Best Practices

This reference guide documents testing patterns and strategies used by the testing-generator skill to create comprehensive, maintainable test suites.

## Unit Testing Patterns

### AAA Pattern (Arrange-Act-Assert)

The foundational pattern for all unit tests:

```
Arrange: Set up test data and dependencies
Act: Call the function/method being tested
Assert: Verify the results
```

Example (JavaScript):
```javascript
test('adds two numbers correctly', () => {
  // Arrange
  const a = 5;
  const b = 3;

  // Act
  const result = add(a, b);

  // Assert
  expect(result).toBe(8);
});
```

Example (Python):
```python
def test_add_two_numbers():
    # Arrange
    a = 5
    b = 3

    # Act
    result = add(a, b)

    # Assert
    assert result == 8
```

### Test Isolation

Each test must be independent and not rely on other tests:

- No shared state between tests
- Use setup/teardown to initialize clean state
- Mock external dependencies
- Each test tests one thing

Example test structure:
```
beforeEach: Initialize fresh state
test 1: Specific scenario
test 2: Different scenario (same fresh state)
afterEach: Clean up resources
```

### Mocking Strategies

#### 1. Mock External Services
Replace HTTP calls, database queries, file I/O with controlled replacements:

```javascript
// Jest example
jest.mock('axios');
axios.get.mockResolvedValue({ data: { id: 1 } });
```

```python
# Python unittest.mock example
from unittest.mock import patch

@patch('requests.get')
def test_api_call(mock_get):
    mock_get.return_value.json.return_value = {'id': 1}
    result = fetch_user()
    assert result['id'] == 1
```

#### 2. Stub Functions
Replace functions that have side effects:

```javascript
const saveUser = jest.fn().mockResolvedValue({ success: true });
```

#### 3. Spy on Methods
Verify functions are called with expected arguments:

```javascript
const spy = jest.spyOn(object, 'method');
functionUnderTest();
expect(spy).toHaveBeenCalledWith(expectedArgs);
```

### Test Naming Conventions

Clear test names describe what is being tested and the expected outcome:

**Pattern**: `test('[description of what being tested] [expected behavior]')`

Good examples:
- `test('returns user when ID exists')`
- `test('throws error when password is too short')`
- `test('saves file to disk when path is valid')`

Bad examples:
- `test('user test')`
- `test('error handling')`
- `test('it works')`

### Test Organization

Group related tests using describe blocks:

```javascript
describe('UserService', () => {
  describe('createUser', () => {
    test('returns user with ID', () => {});
    test('saves user to database', () => {});
    test('throws error for invalid email', () => {});
  });

  describe('deleteUser', () => {
    test('removes user from database', () => {});
    test('returns true on success', () => {});
  });
});
```

## Edge Case Identification

Systematically identify cases that need testing:

### Null and Undefined Cases
- `null` input
- `undefined` parameters
- Missing required fields
- Empty collections

### Boundary Values
- Zero (for numeric values)
- Negative numbers
- Maximum/minimum values
- Very large numbers
- Empty strings, arrays, objects

### Error States
- Network failures
- File not found
- Permission denied
- Timeout
- Invalid input format
- Constraint violations

### State-Related Cases
- Initial/empty state
- Populated state
- After modification
- Concurrent access scenarios

Example edge case checklist for a function:
```
Input validation:
- null inputs
- undefined inputs
- wrong type inputs
- out-of-range values
- empty values

Processing:
- happy path
- each error condition
- each state change

Output:
- correct return type
- expected values
- side effects (database, files)
```

## Integration Testing Patterns

### Database Setup/Teardown

Manage database state for reproducible tests:

```javascript
// JavaScript with test database
beforeEach(async () => {
  await db.clearAllTables();
  await db.seed(testData);
});

afterEach(async () => {
  await db.rollbackTransaction();
});

test('saves and retrieves user', async () => {
  await userService.create(testUser);
  const result = await userService.getById(testUser.id);
  expect(result).toEqual(testUser);
});
```

```python
# Python with pytest fixtures
@pytest.fixture
def db_setup():
    db.clear_all_tables()
    db.seed(test_data)
    yield
    db.rollback()

def test_saves_and_retrieves_user(db_setup):
    user_service.create(test_user)
    result = user_service.get_by_id(test_user.id)
    assert result == test_user
```

### API Mocking

Mock HTTP endpoints while testing integration:

```javascript
// Mock API responses
nock('https://api.example.com')
  .get('/users/1')
  .reply(200, { id: 1, name: 'John' });
```

### Multi-Component Interaction

Test how components work together:

```javascript
describe('User registration flow', () => {
  test('creates user and sends welcome email', async () => {
    const mockEmail = jest.fn().mockResolvedValue({});
    const userService = new UserService(mockEmail);

    await userService.registerUser(testData);

    expect(mockEmail).toHaveBeenCalledWith(testData.email);
  });
});
```

## Test Data and Fixtures

### Factory Functions

Create reusable test objects:

```javascript
// JavaScript factory
const createUser = (overrides = {}) => ({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  ...overrides
});

test('admin has special permissions', () => {
  const admin = createUser({ role: 'admin' });
  expect(admin.permissions).toContain('delete_users');
});
```

```python
# Python factory with pytest
@pytest.fixture
def user():
    return {
        'id': 1,
        'name': 'John Doe',
        'email': 'john@example.com',
        'role': 'user'
    }

def test_admin_has_special_permissions(user):
    admin = {**user, 'role': 'admin'}
    assert 'delete_users' in admin.get('permissions', [])
```

### Test Data Sets

For parametrized tests with multiple scenarios:

```javascript
// JavaScript parametrized test
describe.each([
  [5, 3, 8],
  [0, 0, 0],
  [-1, 1, 0],
  [100, -50, 50]
])('add(%i, %i) = %i', (a, b, expected) => {
  test('calculates correctly', () => {
    expect(add(a, b)).toBe(expected);
  });
});
```

```python
# Python parametrized test with pytest
@pytest.mark.parametrize('a,b,expected', [
    (5, 3, 8),
    (0, 0, 0),
    (-1, 1, 0),
    (100, -50, 50)
])
def test_add(a, b, expected):
    assert add(a, b) == expected
```

## Coverage Strategies

### Code Path Prioritization

Focus testing efforts on high-impact areas:

**High Priority:**
- Business logic (calculations, validations)
- Error handling and edge cases
- State transitions
- Security-related code
- User-facing operations

**Medium Priority:**
- Helper functions
- Logging and monitoring
- Data transformation
- Standard library usage

**Lower Priority:**
- Comment code
- Third-party library integration (trust their tests)
- Very simple getters/setters
- Auto-generated code

### Coverage Metrics

Aim for meaningful coverage, not just numbers:

- **Line Coverage**: Percentage of code lines executed
- **Branch Coverage**: All if/else paths taken
- **Function Coverage**: All functions called

Target: 80%+ overall, 100% for critical paths

### Identifying Gaps

Look for untested scenarios:
- All error conditions tested?
- All state changes tested?
- All input validation paths tested?
- All return values verified?
- All side effects checked?

### Testing Asynchronous Code

```javascript
// Jest async test
test('resolves with user data', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('John');
});

// Or with .then()
test('resolves with user data', () => {
  return fetchUser(1).then(user => {
    expect(user.name).toBe('John');
  });
});
```

```python
# Pytest async test
@pytest.mark.asyncio
async def test_resolves_with_user_data():
    user = await fetch_user(1)
    assert user['name'] == 'John'
```

### Testing Promises and Callbacks

```javascript
// Promise handling in Jest
test('rejects on error', () => {
  return expect(failingFunction()).rejects.toThrow('Error message');
});

// Callback handling with done()
test('calls callback with data', (done) => {
  fetchData((error, data) => {
    expect(error).toBeNull();
    expect(data.id).toBe(1);
    done();
  });
});
```

## Framework-Specific Patterns

### Jest Patterns

```javascript
// Setup and teardown
beforeAll(() => { /* run once */ });
beforeEach(() => { /* run before each test */ });
afterEach(() => { /* run after each test */ });
afterAll(() => { /* run once after all */ });

// Snapshots for complex objects
test('renders correctly', () => {
  expect(component).toMatchSnapshot();
});

// Module mocking
jest.mock('module-name');

// Timer mocking
jest.useFakeTimers();
jest.advanceTimersByTime(1000);
jest.runAllTimers();
jest.runOnlyPendingTimers();
```

### Pytest Patterns

```python
# Fixtures for setup/teardown
@pytest.fixture
def database():
    db = Database()
    db.setup()
    yield db
    db.teardown()

# Parametrization
@pytest.mark.parametrize('input,expected', [(1, 2), (2, 4)])
def test_double(input, expected):
    assert double(input) == expected

# Markers
@pytest.mark.slow
def test_slow_operation():
    pass
```

### Go Testing Patterns

```go
// Table-driven tests
func TestAdd(t *testing.T) {
    tests := []struct {
        a, b, want int
    }{
        {1, 2, 3},
        {0, 0, 0},
        {-1, 1, 0},
    }

    for _, tt := range tests {
        t.Run(fmt.Sprintf("%d+%d", tt.a, tt.b), func(t *testing.T) {
            if got := Add(tt.a, tt.b); got != tt.want {
                t.Errorf("got %d, want %d", got, tt.want)
            }
        })
    }
}
```

### PHPUnit Patterns

```php
// Setup and teardown
protected function setUp(): void
{
    $this->service = new UserService();
}

protected function tearDown(): void
{
    unset($this->service);
}

// Data providers for parametrization
public function additionProvider()
{
    return [
        [1, 2, 3],
        [0, 0, 0],
        [-1, 1, 0],
    ];
}

/**
 * @dataProvider additionProvider
 */
public function testAdd($a, $b, $expected)
{
    $this->assertEquals($expected, add($a, $b));
}

// Mocking
$mock = $this->createMock(PaymentGateway::class);
$mock->method('charge')->willReturn(true);
```

## Common Mistakes to Avoid

1. **Shared State Between Tests**: Each test should be independent
2. **Testing Implementation Details**: Test behavior, not internals
3. **Ignoring Async Code**: Don't forget to handle promises/callbacks
4. **Over-Mocking**: Don't mock the code under test
5. **Vague Test Names**: Be specific about what's being tested
6. **Too Many Assertions**: Keep tests focused (ideally one assertion)
7. **Flaky Tests**: Tests that pass sometimes and fail sometimes (usually due to timing)
8. **Not Testing Error Cases**: 50% of the code is usually error handling
9. **Ignoring Setup/Teardown**: Proper cleanup prevents test pollution
10. **Testing Implementation**: Test the public API, not private implementation details

